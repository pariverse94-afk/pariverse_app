import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { onDocumentDeleted } from "firebase-functions/v2/firestore";

const REGION = "asia-south1";

/**
 * Deletes a post's image when the post goes.
 *
 * Storage has no notion of the Firestore document that references it, so
 * without this every deleted post leaves its image behind, paid for forever and
 * reachable by anyone who kept the URL.
 *
 * Deletes the prefix rather than one fixed filename so a future change to the
 * upload naming cannot silently start leaking objects.
 *
 * Known gap, accepted: an upload that succeeds while the document write fails
 * leaves an orphan nothing will ever clean up. A scheduled sweep is not worth
 * building before it is a real problem — noted so it is a decision rather than
 * an oversight.
 */
export const onPostDeleted = onDocumentDeleted(
  { document: "communityPosts/{postId}", region: REGION },
  async (event) => {
    const postId = event.params.postId;
    try {
      await getStorage().bucket().deleteFiles({ prefix: `postImages/${postId}/` });
      logger.info("Deleted images for removed post", { postId });
    } catch (err) {
      logger.error("Failed to delete post images", {
        postId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
);

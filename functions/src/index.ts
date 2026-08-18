import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";

initializeApp();
const db = getFirestore();

/**
 * How many *distinct* accounts must report a post before it is hidden.
 *
 * Three is a deliberate compromise. One is far too few — it hands any single
 * account a delete button for other people's posts. Much higher and nothing
 * happens at Pariverse's current size, which defeats the point: the whole
 * reason this exists is that a bad post would otherwise stay live until Priya
 * happens to open the Firebase console.
 */
const HIDE_THRESHOLD = 3;

/**
 * Region matches Firestore's location so the trigger runs next to the data.
 */
const REGION = "asia-south1";

/**
 * Maintains `reportCount` on a post and hides it once enough distinct people
 * have reported it.
 *
 * Written server-side on purpose. The client cannot be trusted with either
 * field — rules deny writing them — so this function is the only thing that
 * sets them.
 *
 * Hiding is reversible and non-destructive: it sets a flag, it never deletes.
 * A false positive costs a post's visibility until Priya looks; a deletion
 * would cost the post. Given three strangers can trigger it, reversible is the
 * only defensible choice.
 */
export const onReportCreated = onDocumentCreated(
  { document: "reports/{reportId}", region: REGION },
  async (event) => {
    const report = event.data?.data();
    const postId = report?.postId;
    if (!postId || typeof postId !== "string") {
      logger.warn("Report has no usable postId; ignoring", { reportId: event.params.reportId });
      return;
    }

    // Count distinct reporters, not reports. Without this one account could
    // report the same post three times and hide it alone, which is exactly the
    // abuse the threshold is supposed to prevent.
    const snapshot = await db.collection("reports").where("postId", "==", postId).get();
    const reporters = new Set<string>();
    for (const doc of snapshot.docs) {
      const uid = doc.get("reportedBy");
      if (typeof uid === "string" && uid) reporters.add(uid);
    }
    const distinctReporters = reporters.size;

    const postRef = db.collection("communityPosts").doc(postId);
    const post = await postRef.get();
    if (!post.exists) {
      // Author deleted it, or a previous run removed it. Nothing to mark.
      logger.info("Reported post no longer exists", { postId });
      return;
    }

    const shouldHide = distinctReporters >= HIDE_THRESHOLD;
    const alreadyHidden = post.get("hidden") === true;

    await postRef.set(
      {
        reportCount: distinctReporters,
        ...(shouldHide && !alreadyHidden
          ? { hidden: true, hiddenAt: new Date().toISOString() }
          : {}),
      },
      { merge: true },
    );

    if (shouldHide && !alreadyHidden) {
      // Logged at error level so it is easy to attach a Cloud Logging alert to
      // this exact condition without also alerting on routine reports.
      logger.error("POST AUTO-HIDDEN — review needed", {
        postId,
        distinctReporters,
        authorId: post.get("authorId") ?? null,
        // Truncated: enough to triage from the log line, without copying user
        // content wholesale into a second system.
        contentPreview: String(post.get("content") ?? "").slice(0, 140),
        consoleUrl: `https://console.firebase.google.com/project/pariverse-prod/firestore/data/~2FcommunityPosts~2F${postId}`,
      });
    } else {
      logger.info("Report recorded", { postId, distinctReporters, hidden: alreadyHidden });
    }
  },
);

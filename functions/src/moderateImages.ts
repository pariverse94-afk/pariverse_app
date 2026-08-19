import { ImageAnnotatorClient } from "@google-cloud/vision";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";
import { onObjectFinalized } from "firebase-functions/v2/storage";

const REGION = "asia-south1";
const vision = new ImageAnnotatorClient();

/**
 * SafeSearch returns a likelihood word, not a score. LIKELY and VERY_LIKELY are
 * the two we act on: POSSIBLE fires on a lot of ordinary photographs of people,
 * and this feed is mothers posting pictures of their children and their food.
 * A false positive deletes something innocent and tells someone their photo was
 * inappropriate, which is a worse failure here than a missed borderline image
 * that three reports will catch anyway.
 */
const BLOCKED = new Set(["LIKELY", "VERY_LIKELY"]);

/** Categories worth blocking on. `spoof` is excluded — it means "meme", not "unsafe". */
const CHECKED = ["adult", "violence", "racy"] as const;

/**
 * Scans every uploaded image and removes anything SafeSearch flags.
 *
 * Runs on upload rather than on first view because the blast radius of a bad
 * image is wide: an avatar appears on every post its owner ever wrote, and a
 * post image is visible to the whole feed the moment it lands.
 */
export const onImageUploaded = onObjectFinalized(
  { region: REGION, memory: "512MiB" },
  async (event) => {
    const path = event.data.name;
    const bucketName = event.data.bucket;
    if (!path) return;

    const isAvatar = path.startsWith("profilePhotos/");
    const isPostImage = path.startsWith("postImages/");
    if (!isAvatar && !isPostImage) return;

    let flagged: string | null = null;
    try {
      const [result] = await vision.safeSearchDetection(`gs://${bucketName}/${path}`);
      const annotation = result.safeSearchAnnotation;
      if (!annotation) {
        logger.warn("No SafeSearch annotation returned; leaving image in place", { path });
        return;
      }
      for (const category of CHECKED) {
        const likelihood = annotation[category];
        if (typeof likelihood === "string" && BLOCKED.has(likelihood)) {
          flagged = `${category}=${likelihood}`;
          break;
        }
      }
    } catch (err) {
      // Fail open, and say so loudly. Deleting people's uploads because the
      // Vision API had a bad minute would be worse than the three-reporter
      // threshold catching it, which is still in place underneath.
      logger.error("SafeSearch failed; image left in place for report-based review", {
        path,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    if (!flagged) {
      logger.info("Image passed SafeSearch", { path });
      return;
    }

    const db = getFirestore();
    await getStorage().bucket(bucketName).file(path).delete().catch(() => {});

    if (isAvatar) {
      // profilePhotos/{uid}/avatar.jpg
      const uid = path.split("/")[1];
      if (uid) {
        await db.collection("users").doc(uid).set({ photoUrl: null }, { merge: true });
        // Existing posts carry a denormalised copy of the URL, so clearing the
        // profile alone would leave the image referenced on every post the user
        // has already made. The object is gone, but a broken image is still a
        // worse outcome than an initial.
        const posts = await db.collection("communityPosts").where("authorId", "==", uid).get();
        await Promise.all(
          posts.docs.map((d) => d.ref.update({ authorPhotoUrl: FieldValue.delete() })),
        );
      }
    } else {
      // postImages/{postId}/image.jpg — hide the whole post, not just the
      // image. A caption written around a blocked picture is not made safe by
      // removing the picture.
      const postId = path.split("/")[1];
      if (postId) {
        await db.collection("communityPosts").doc(postId).set(
          { hidden: true, hiddenAt: new Date().toISOString(), hiddenReason: "image_safesearch" },
          { merge: true },
        );
      }
    }

    logger.error("IMAGE BLOCKED by SafeSearch", {
      path,
      flagged,
      target: isAvatar ? "avatar cleared" : "post hidden",
    });
  },
);

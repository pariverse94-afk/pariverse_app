import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

const REGION = "asia-south1";

/**
 * Held as a Functions secret, not an EXPO_PUBLIC_ value compiled into the app
 * bundle. This is the first Groq call in the project that an attacker cannot
 * simply grep out of the shipped APK.
 */
const GROQ_API_KEY = defineSecret("GROQ_API_KEY");

const CATEGORIES = ["recipe", "parenting", "health", "general"] as const;
type Category = (typeof CATEGORIES)[number];

const MODEL = "llama-3.3-70b-versatile";

const PROMPT = `You label posts in an Indian parenting community app. Reply with exactly one word from this list and nothing else:

recipe    - food, cooking, tiffin, meal ideas, ingredients
parenting - behaviour, sleep, school, discipline, routines, milestones
health    - illness, symptoms, medicine, vaccination, injuries, doctors
general   - anything else, or if you are unsure

If a post could plausibly be two of these, answer general.`;

/**
 * Assigns a category to each new post.
 *
 * The composer no longer asks. That removes a step from posting, at the cost of
 * no in-app remedy for a wrong label — category only drives a filter chip and a
 * coloured badge, and it stays correctable in the Firestore console.
 *
 * Anything unexpected falls back to "general". A confident wrong label is worse
 * than an honest vague one, especially between health and parenting, which
 * genuinely overlap for a lot of real posts.
 */
export const onPostCreatedClassify = onDocumentCreated(
  { document: "communityPosts/{postId}", region: REGION, secrets: [GROQ_API_KEY] },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const content = String(snap.get("content") ?? "").trim();
    // An image-only post has nothing to classify, and seeds arrive already
    // labelled — re-labelling them would churn the feed for no benefit.
    if (!content || snap.get("isSeed") === true) return;

    let category: Category = "general";
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY.value()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 4,
          temperature: 0,
          messages: [
            { role: "system", content: PROMPT },
            { role: "user", content: content.slice(0, 2000) },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Groq returned ${response.status}`);

      const json = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const answer = json.choices?.[0]?.message?.content?.trim().toLowerCase() ?? "";
      const match = CATEGORIES.find((c) => answer.startsWith(c));
      if (match) category = match;
      else logger.warn("Unrecognised classification; defaulting to general", { answer });
    } catch (err) {
      // The post keeps the "general" the client wrote. Classification is a
      // convenience, so it must never be able to lose someone's post.
      logger.error("Classification failed; leaving as general", {
        postId: event.params.postId,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    if (category === "general") return; // already what the client wrote

    await getFirestore()
      .collection("communityPosts")
      .doc(event.params.postId)
      .set({ category }, { merge: true });

    logger.info("Post classified", { postId: event.params.postId, category });
  },
);

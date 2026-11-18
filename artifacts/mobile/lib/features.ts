/**
 * Release switches for features that depend on paid backend services.
 *
 * Both need the Firebase Blaze (pay-as-you-go) plan, which pariverse-prod is not
 * on as of 2026-11 (billing disabled). On the free Spark plan:
 *   - Cloud Storage uploads are refused (storage.rules is also deny-all live),
 *   - Cloud Vision SafeSearch and every Cloud Function cannot run.
 *
 * To turn them back on: enable Blaze, deploy storage.rules and the functions
 * (onImageUploaded, onPostDeleted, onPostCreatedClassify — see firebase-deploy
 * skill), set the GROQ_API_KEY secret, then flip these and update the privacy
 * policy (photos, Cloud Storage, Cloud Vision, AI post labelling) in the same
 * release. Do not flip either flag without the backend in place.
 */

/** Profile photos and images on community posts. */
export const PHOTOS_ENABLED = false;

/**
 * Post categories assigned server-side by functions/src/classifyPost.ts.
 * While false, the composer asks the author to pick a category.
 */
export const AUTO_CATEGORY_ENABLED = false;

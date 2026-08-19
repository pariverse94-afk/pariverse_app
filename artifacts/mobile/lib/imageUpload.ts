import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "@/lib/firebase";

export const storage = getStorage(app);

/**
 * Avatars are rendered small and everywhere; post images are the main subject
 * of their card. Both are resized before upload rather than after, because
 * egress from a busy feed is the way this project's bill grows — and a phone
 * camera file is several megabytes before anyone touches it.
 */
const PRESETS = {
  avatar: { maxDimension: 512, quality: 0.8 },
  post: { maxDimension: 1080, quality: 0.7 },
} as const;

export type ImagePreset = keyof typeof PRESETS;

/** Opens the OS picker. Returns null if the user backs out — a normal outcome. */
export async function pickImage(preset: ImagePreset): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    // Avatars are shown in a circle, so a square crop avoids surprising the
    // user with an off-centre face. Post images keep their own framing.
    allowsEditing: preset === "avatar",
    aspect: preset === "avatar" ? [1, 1] : undefined,
    quality: 1, // compression happens in resize(), after the crop
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

/** Downscale + re-encode as JPEG. Returns a new local uri. */
export async function resize(uri: string, preset: ImagePreset): Promise<string> {
  const { maxDimension, quality } = PRESETS[preset];
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxDimension } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}

/**
 * Upload a local uri to Storage and return its public download URL.
 *
 * `fetch(uri).blob()` is the one approach that works on both web and native
 * here — on native the uri is a file:// path, on web it is a blob: url, and
 * fetch handles both.
 */
export async function uploadImage(localUri: string, storagePath: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const objectRef = ref(storage, storagePath);
  await uploadBytes(objectRef, blob, { contentType: "image/jpeg" });
  return getDownloadURL(objectRef);
}

/**
 * Pick → resize → upload, the whole flow. Returns null if the user cancelled.
 * Throws if the upload itself fails, so callers can tell "changed their mind"
 * apart from "something broke" and only show an error for the latter.
 */
export async function pickResizeAndUpload(
  preset: ImagePreset,
  storagePath: string,
): Promise<string | null> {
  const picked = await pickImage(preset);
  if (!picked) return null;
  const resized = await resize(picked, preset);
  return uploadImage(resized, storagePath);
}

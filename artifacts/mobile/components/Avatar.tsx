import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  /** Public byline. Only its first letter is used. */
  name: string;
  /** Fallback background when there is no photo. */
  color: string;
  /** Optional — most users will not have one, and that is a supported state. */
  photoUrl?: string | null;
  size?: number;
}

/**
 * Photo when there is one, coloured initial when there is not.
 *
 * The fallback is the point, not a degraded case: avatars are optional so that
 * a community name stays genuinely pseudonymous. Most users will show an
 * initial, so it has to look deliberate rather than broken.
 */
export function Avatar({ name, color, photoUrl, size = 40 }: AvatarProps) {
  const box = { width: size, height: size, borderRadius: size / 2 };

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.image, box]}
        contentFit="cover"
        // expo-image caches on disk, which matters here: a feed scrolled
        // repeatedly would otherwise re-fetch every avatar and every fetch is
        // billed egress.
        cachePolicy="memory-disk"
        transition={150}
        accessibilityLabel={`${name}'s profile photo`}
      />
    );
  }

  return (
    <View style={[styles.fallback, box, { backgroundColor: color }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: "#00000010" },
  fallback: { alignItems: "center", justifyContent: "center" },
  initial: { color: "#fff", fontFamily: "Inter_600SemiBold" },
});

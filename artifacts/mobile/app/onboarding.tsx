import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import { auth } from "@/lib/firebase";
import { pickImage, resize, uploadImage } from "@/lib/imageUpload";

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveProfile, savePhotoUrl } = useUser();
  const [step, setStep] = useState<"welcome" | "profile">("welcome");
  const [yourName, setYourName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const familyNameRef = useRef<TextInput>(null);

  const handlePickPhoto = async () => {
    try {
      const uri = await pickImage("avatar");
      if (uri) setPhoto(uri);
    } catch {
      // Picker unavailable or permission refused. Silent: a photo is optional,
      // so failing to choose one must never block finishing signup.
    }
  };

  const handleGetStarted = async () => {
    if (!yourName.trim() || loading) return;
    setLoading(true);
    setSaveError("");
    try {
      await saveProfile(
        yourName.trim(),
        familyName.trim() || `${yourName.trim()}'s Family`,
      );

      // After the profile, and never blocking it. The upload needs an
      // authenticated uid for its Storage path, and a failed photo must not
      // cost someone their whole signup — they can add one later from Profile.
      if (photo) {
        try {
          const uid = auth.currentUser?.uid;
          if (uid) {
            const resized = await resize(photo, "avatar");
            const url = await uploadImage(resized, `profilePhotos/${uid}/avatar.jpg`);
            await savePhotoUrl(url);
          }
        } catch {
          // Swallowed deliberately — see above.
        }
      }
      // NavigationGuard watches profile state and navigates to /(tabs) automatically
      // once saveProfile sets the profile. Keep loading=true until unmount.
    } catch (e: unknown) {
      setLoading(false);
      setSaveError(e instanceof Error ? e.message : "Could not save profile. Please try again.");
    }
  };

  if (step === "welcome") {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.welcomeContainer, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
          {/* Logo area */}
          <View style={styles.logoArea}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoEmoji}>🏠</Text>
            </View>
            <View style={styles.logoTextArea}>
              <Text style={[styles.appName, { color: colors.foreground }]}>Pariverse</Text>
              <Text style={[styles.appNameHindi, { color: colors.primary }]}>परिवर्स</Text>
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={[styles.tagline, { color: colors.foreground }]}>
              Your family, organised.
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Manage chores, plan Indian meals, connect with other moms, and get AI first aid guidance — all in one place.
            </Text>
          </View>

          {/* Feature pills */}
          <View style={styles.features}>
            {[
              { icon: "check-square", label: "Chore Planner" },
              { icon: "shopping-bag", label: "AI Meal Planning" },
              { icon: "users", label: "Mom's Community" },
              { icon: "heart", label: "First Aid Guide" },
            ].map((f) => (
              <View key={f.label} style={[styles.featurePill, { backgroundColor: colors.muted }]}>
                <Feather name={f.icon as any} size={14} color={colors.primary} />
                <Text style={[styles.featurePillText, { color: colors.foreground }]}>{f.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: colors.primary }]}
            onPress={() => setStep("profile")}
            testID="welcome-continue-btn"
          >
            <Text style={styles.continueBtnText}>Get Started</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.profileContainer, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep("welcome")}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.profileIconBox, { backgroundColor: colors.primary + "20" }]}>
          <Feather name="user" size={32} color={colors.primary} />
        </View>

        <Text style={[styles.profileTitle, { color: colors.foreground }]}>Tell us about yourself</Text>
        <Text style={[styles.profileSubtitle, { color: colors.mutedForeground }]}>
          We'll personalise your Pariverse experience
        </Text>

        <Text style={[styles.inputLabel, { color: colors.foreground }]}>Your name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
          placeholder="e.g. Priya"
          placeholderTextColor={colors.mutedForeground}
          value={yourName}
          onChangeText={setYourName}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => familyNameRef.current?.focus()}
          blurOnSubmit={false}
          testID="your-name-input"
        />

        <Text style={[styles.inputLabel, { color: colors.foreground }]}>Family name <Text style={[styles.optional, { color: colors.mutedForeground }]}>(optional)</Text></Text>
        <TextInput
          ref={familyNameRef}
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
          placeholder="e.g. The Sharma Family"
          placeholderTextColor={colors.mutedForeground}
          value={familyName}
          onChangeText={setFamilyName}
          returnKeyType="done"
          onSubmitEditing={handleGetStarted}
          testID="family-name-input"
        />

        <Text style={[styles.inputLabel, { color: colors.foreground }]}>
          Photo <Text style={[styles.optional, { color: colors.mutedForeground }]}>(optional)</Text>
        </Text>
        <TouchableOpacity
          style={styles.photoRow}
          onPress={handlePickPhoto}
          testID="onboarding-photo-btn"
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} contentFit="cover" />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Feather name="camera" size={20} color={colors.mutedForeground} />
            </View>
          )}
          <View style={styles.photoTextWrap}>
            <Text style={[styles.photoAction, { color: colors.primary }]}>
              {photo ? "Change photo" : "Add a photo"}
            </Text>
            <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>
              Shown next to your posts in Mom's Corner, which everyone using Pariverse can
              read. Skip it and you'll get a coloured initial instead — that's perfectly normal.
            </Text>
          </View>
        </TouchableOpacity>
        {!!photo && (
          <TouchableOpacity onPress={() => setPhoto(null)} testID="onboarding-photo-remove">
            <Text style={[styles.photoRemove, { color: colors.mutedForeground }]}>Remove photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.primary, opacity: yourName.trim() && !loading ? 1 : 0.4 }]}
          onPress={handleGetStarted}
          disabled={!yourName.trim() || loading}
          testID="profile-continue-btn"
        >
          <Text style={styles.continueBtnText}>{loading ? "Saving…" : "Enter Pariverse"}</Text>
          {!loading && <Feather name="arrow-right" size={18} color="#fff" />}
        </TouchableOpacity>

        {saveError ? (
          <Text style={[styles.errorNote, { color: "#D32F2F" }]}>{saveError}</Text>
        ) : null}

        <Text style={[styles.privacyNote, { color: colors.mutedForeground }]}>
          Your data is securely stored and synced via Supabase
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  welcomeContainer: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoCircle: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  logoEmoji: { fontSize: 28 },
  logoTextArea: {},
  appName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  appNameHindi: { fontSize: 16, fontFamily: "Inter_500Medium", marginTop: 1 },
  heroContent: { gap: 12 },
  tagline: { fontSize: 30, fontFamily: "Inter_700Bold", lineHeight: 38 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  featurePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  featurePillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  continueBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14 },
  continueBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  profileContainer: { paddingHorizontal: 28, flexGrow: 1 },
  backBtn: { marginBottom: 32 },
  profileIconBox: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  profileTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 8 },
  profileSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21, marginBottom: 32 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  optional: { fontFamily: "Inter_400Regular", fontSize: 12 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 8 },
  photoPreview: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#00000010" },
  photoPlaceholder: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  photoTextWrap: { flex: 1 },
  photoAction: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  photoHint: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  photoRemove: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, fontFamily: "Inter_400Regular", marginBottom: 20 },
  privacyNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 20 },
  errorNote: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center", marginTop: 8 },
});

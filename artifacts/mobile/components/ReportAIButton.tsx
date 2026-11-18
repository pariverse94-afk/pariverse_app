import { Feather } from "@expo/vector-icons";
import { addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { auth } from "@/lib/firebase";
import { reportsCollection } from "@/lib/firestore";

/**
 * "Report this answer" control for AI-generated content.
 *
 * Google Play's AI-Generated Content policy requires apps that generate content
 * with AI to let users report or flag offensive or harmful output from inside
 * the app. Reports go to the same `reports` collection as post reports, tagged
 * with `type: "ai_output"` and no `postId` — the onReportCreated function
 * ignores reports without a postId, so these never touch community moderation.
 */
export function ReportAIButton({
  feature,
  content,
  context,
}: {
  feature: "first_aid" | "meal_suggestions";
  content: string;
  /** Short description of what was asked, e.g. "High Fever • 3 years • Severe". */
  context: string;
}) {
  const colors = useColors();
  const [reported, setReported] = useState(false);

  const submit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await addDoc(reportsCollection(), {
        type: "ai_output",
        feature,
        context: context.slice(0, 300),
        content: content.slice(0, 4000),
        reason: "harmful_or_wrong_ai_output",
        reportedBy: uid,
        createdAt: new Date().toISOString(),
      });
      setReported(true);
    } catch {
      Alert.alert("Couldn't send report", "Please check your connection and try again.");
    }
  };

  const confirm = () => {
    const message =
      "Report this AI answer as harmful, offensive or wrong? It will be sent to the Pariverse team for review.";
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) void submit();
      return;
    }
    Alert.alert("Report AI answer", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Report", style: "destructive", onPress: () => void submit() },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={confirm}
      disabled={reported}
      testID={`report-ai-${feature}`}
      accessibilityRole="button"
    >
      <Feather name={reported ? "check" : "flag"} size={14} color={colors.mutedForeground} />
      <Text style={[styles.text, { color: colors.mutedForeground }]}>
        {reported ? "Reported — thank you" : "Report this answer"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 8 },
  text: { fontSize: 13, fontFamily: "Inter_500Medium" },
});

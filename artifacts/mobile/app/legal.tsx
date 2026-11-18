import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const TABS = ["Privacy Policy", "Terms of Service", "EULA"] as const;
type Tab = typeof TABS[number];

const CONTACT_EMAIL = "pariverse94@gmail.com";
const APP_NAME = "Pariverse";
const LAST_UPDATED = "17 November 2026";

function PrivacyPolicy() {
  return (
    <View>
      <Section title="Introduction">
        {`Pariverse ("we", "our", "us") is a family app for organising chores and meals, getting AI first-aid guidance for children, and sharing tips with other parents in Mom's Corner. This policy explains what we collect, why, who processes it, and how to delete it.
Pariverse is for adults aged 18 and over. Children do not have accounts; a parent may add children as family members.`}
      </Section>

      <Section title="Information we collect">
        {`• Account: your name, family name and email address, from email sign-up or Google Sign-In.
• Community profile: the public name you choose for Mom's Corner and, if you add one, a profile photo.
• Family data: names and roles of family members you add, chores and who they are assigned to, and email addresses you enter to invite family members.
• Meal data: your meal plan, pantry items, dietary preferences and nutritional goals.
• Community content: posts you write, photos you attach, posts you like or save, people you block and posts you report.
• First-aid questions: the condition, your child's age, how severe it seems and any details you type. These are sent to our AI provider to generate an answer and are not saved by us.
• Reports of AI answers: if you report an AI answer, we keep a copy of that answer and what was asked so we can review it.
We do not use analytics or advertising SDKs, do not collect your location, contacts or device identifiers for tracking, and do not run crash reporting.`}
      </Section>

      <Section title="Who can see what">
        {`• Your family data, meal data, saved posts and blocked list are private to your account.
• Mom's Corner is one shared feed. Your posts, attached photos, community name, profile photo and likes are visible to every signed-in Pariverse user. Do not post anything you would not want other members to see.
• If you enter a family member's email address, we check whether that address belongs to a Pariverse account so we can show them as "On Pariverse". We do not email them.`}
      </Section>

      <Section title="How we use your information">
        {`• To run the app and sync your data across your devices.
• To generate meal suggestions and first-aid guidance with AI.
• To label community posts with a category (recipe, parenting, health, general) using AI.
• To check uploaded photos for explicit or violent content before they are shown to others.
• To review reported posts and AI answers, and to hide posts that several members report.`}
      </Section>

      <Section title="Service providers">
        {`We do not sell, rent or trade your personal information, and we do not share it for advertising. Your data is processed only by these providers, for the purposes above:
• Google Firebase — sign-in (Firebase Authentication), data storage (Cloud Firestore), photo storage (Cloud Storage for Firebase), server functions (Cloud Functions) and web hosting.
• Google Cloud Vision — SafeSearch scanning of uploaded photos.
• Groq — AI processing of meal requests, first-aid questions and community post text. Requests are sent to Groq to produce a response and are subject to Groq's own privacy policy.
• Google Sign-In — only if you choose to sign in with Google.`}
      </Section>

      <Section title="Storage and security">
        {`Your data is stored by Google Firebase and a copy is kept on your device so the app works offline. Data is encrypted in transit (HTTPS). Access to your private data is restricted to your account by server-side security rules. No method of storage or transmission is 100% secure.`}
      </Section>

      <Section title="Retention">
        {`We keep your data for as long as your account exists. Reports and reported content are kept while they are needed for review. When your account is deleted, your data is deleted as described below.`}
      </Section>

      <Section title="Deleting your account and data">
        {`You can request deletion from the app (Profile → Delete Account) or at https://pariverse-prod.web.app/delete-account, or by emailing pariverse94@gmail.com with the subject "Pariverse Account Deletion Request". We will delete your account, profile, profile photo, family, chore and meal data, community posts and their photos within 30 days and confirm by email.`}
      </Section>

      <Section title="Children">
        {`Pariverse is not directed at children and children cannot create accounts. Information a parent enters about their children (names, roles, an age in a first-aid question) is used only to provide the app's features to that parent.`}
      </Section>

      <Section title="Changes to this policy">
        {`We will update this page when our practices change and revise the date above. Significant changes will be shown in the app.`}
      </Section>

      <Section title="Contact">
        {`For any privacy question or request, email pariverse94@gmail.com.`}
      </Section>
    </View>
  );
}

function TermsOfService() {
  return (
    <View>
      <Section title="Acceptance of Terms">
        {`By downloading or using ${APP_NAME}, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.`}
      </Section>

      <Section title="Description of Service">
        {`${APP_NAME} is a family management app for urban Indian families that provides:\n• Chore assignment and tracking\n• AI-assisted Indian meal planning\n• Mom's Corner community features\n• AI-powered first aid guidance for children`}
      </Section>

      <Section title="User Accounts">
        {`• You must provide accurate information when creating your account\n• You are responsible for maintaining the confidentiality of your account\n• You must be at least 18 years old to create an account\n• One person may not maintain multiple accounts`}
      </Section>

      <Section title="Acceptable Use">
        {`You agree not to:\n• Post harmful, offensive, or misleading content in Mom's Corner\n• Use the app for any unlawful purpose\n• Attempt to gain unauthorised access to any part of the service\n• Impersonate any person or entity`}
      </Section>

      <Section title="Medical Disclaimer">
        {`The First Aid guidance provided by ${APP_NAME} is for informational purposes ONLY. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for medical emergencies. In case of emergency, call 108 immediately.`}
      </Section>

      <Section title="AI-Generated Content">
        {`Meal suggestions and first aid guidance are generated by AI and may not always be accurate or appropriate. Always use your judgment and consult professionals when in doubt.`}
      </Section>

      <Section title="Community Content">
        {`Users are solely responsible for content they post in Mom's Corner. We reserve the right to remove content that violates these terms without notice.`}
      </Section>

      <Section title="Limitation of Liability">
        {`${APP_NAME} and its developers shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app. Our total liability shall not exceed ₹0 (the app is provided free of charge).`}
      </Section>

      <Section title="Changes to Terms">
        {`We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.`}
      </Section>

      <Section title="Governing Law">
        {`These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.`}
      </Section>

      <Section title="Contact">
        {`Questions about these terms? Email us at:\n${CONTACT_EMAIL}`}
      </Section>
    </View>
  );
}

function EULA() {
  return (
    <View>
      <Section title="End User Licence Agreement">
        {`This End User Licence Agreement ("EULA") is a legal agreement between you ("User") and ${APP_NAME} ("Licensor") for the use of the ${APP_NAME} mobile application ("App").`}
      </Section>

      <Section title="Licence Grant">
        {`Licensor grants you a limited, non-exclusive, non-transferable, revocable licence to download, install, and use the App on Android devices that you own or control, solely for your personal, non-commercial purposes.`}
      </Section>

      <Section title="Restrictions">
        {`You may not:\n• Copy, modify, or distribute the App\n• Reverse engineer or decompile the App\n• Rent, lease, or lend the App to any third party\n• Use the App for commercial purposes without written consent\n• Remove any proprietary notices or labels on the App`}
      </Section>

      <Section title="Intellectual Property">
        {`The App and all its content, features, and functionality are owned by ${APP_NAME} and are protected by Indian and international copyright, trademark, and other intellectual property laws.`}
      </Section>

      <Section title="Google Play Store Additional Terms">
        {`If you obtained this App from Google Play, your use is also subject to the Google Play Terms of Service. In the event of a conflict between this EULA and Google Play Terms, this EULA shall govern to the extent permitted.`}
      </Section>

      <Section title="Updates">
        {`${APP_NAME} may provide updates to the App from time to time. Updates may be automatically installed. These updates are subject to this EULA unless accompanied by a separate agreement.`}
      </Section>

      <Section title="Termination">
        {`This licence is effective until terminated. Your rights under this licence will terminate automatically if you fail to comply with any of its terms. Upon termination, you must delete all copies of the App from your devices.`}
      </Section>

      <Section title="No Warranty">
        {`THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LICENSOR DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED.`}
      </Section>

      <Section title="Governing Law">
        {`This EULA is governed by the laws of India. Any dispute arising under this EULA shall be subject to the exclusive jurisdiction of courts in India.`}
      </Section>

      <Section title="Contact">
        {`For queries regarding this EULA:\n${CONTACT_EMAIL}`}
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>{children}</Text>
    </View>
  );
}

export default function LegalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<Tab>(
    (params.tab as Tab) ?? "Privacy Policy"
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Legal</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Last updated: {LAST_UPDATED}
        </Text>
        {activeTab === "Privacy Policy" && <PrivacyPolicy />}
        {activeTab === "Terms of Service" && <TermsOfService />}
        {activeTab === "EULA" && <EULA />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  lastUpdated: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 8 },
  sectionBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
});

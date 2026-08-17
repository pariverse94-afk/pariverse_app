import AsyncStorage from "@react-native-async-storage/async-storage";
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { emailIndexDoc, userDoc } from "@/lib/firestore";

export interface UserProfile {
  id: string;
  name: string;
  familyName: string;
  email?: string;
  /**
   * Public byline used on Mom's Corner posts. Deliberately separate from
   * `name`: posts are visible to every user of the app, and people share
   * things about their children's health there. Undefined until the user is
   * asked, which happens the first time they post — not during onboarding,
   * where a third question before any value is delivered costs signups.
   */
  communityName?: string;
}

interface UserContextValue {
  /** Firebase User object — truthy when signed in, null when signed out. */
  session: User | null;
  profile: UserProfile | null;
  isLoaded: boolean;
  saveProfile: (name: string, familyName: string) => Promise<void>;
  /** Set the public byline used on community posts. */
  saveCommunityName: (communityName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const PROFILE_CACHE_PREFIX = "parivaar_profile_v6_";
const UserContext = createContext<UserContextValue | null>(null);

function profileCacheKey(uid: string) {
  return `${PROFILE_CACHE_PREFIX}${uid}`;
}

/**
 * Best-effort: write the profile to Firestore plus an emailIndex entry so
 * other users' invite flow can detect this account. Fire-and-forget — the
 * app stays local-first and never blocks on the network.
 */
function pushProfileToCloud(uid: string, name: string, familyName: string, email?: string | null) {
  setDoc(
    userDoc(uid),
    { name, familyName, email: email ?? null, updatedAt: new Date().toISOString() },
    { merge: true },
  ).catch(() => {});
  if (email) {
    setDoc(emailIndexDoc(email), { uid }, { merge: true }).catch(() => {});
  }
}

/**
 * Written on its own rather than through pushProfileToCloud so that editing
 * your display name can never touch the community byline, and vice versa.
 */
function pushCommunityNameToCloud(uid: string, communityName: string) {
  setDoc(
    userDoc(uid),
    { communityName, updatedAt: new Date().toISOString() },
    { merge: true },
  ).catch(() => {});
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false);

  async function loadProfile(uid: string, email?: string) {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      // 1. Firestore is the source of truth for the profile.
      try {
        const snap = await getDoc(userDoc(uid));
        if (snap.exists()) {
          const data = snap.data();
          const p: UserProfile = {
            id: uid,
            name: data.name,
            familyName: data.familyName,
            email: data.email ?? email,
            communityName: data.communityName ?? undefined,
          };
          setProfile(p);
          await AsyncStorage.setItem(profileCacheKey(uid), JSON.stringify(p));
          // Keep the email lookup entry fresh (covers accounts created
          // before the index existed).
          if (email) setDoc(emailIndexDoc(email), { uid }, { merge: true }).catch(() => {});
          return;
        }

        // 2. No cloud profile yet — existing users have one cached locally
        //    from before Firestore. Adopt it and migrate it up.
        const cached = await AsyncStorage.getItem(profileCacheKey(uid));
        if (cached) {
          const p: UserProfile = { ...JSON.parse(cached), id: uid };
          setProfile(p);
          pushProfileToCloud(uid, p.name, p.familyName, email ?? p.email);
          return;
        }

        // 3. Genuinely new user — needs onboarding.
        setProfile(null);
      } catch {
        // Firestore unreachable (offline) — fall back to the local cache.
        const cached = await AsyncStorage.getItem(profileCacheKey(uid));
        setProfile(cached ? JSON.parse(cached) : null);
      }
    } finally {
      setIsLoaded(true);
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setSession(user);
      if (user) {
        loadingRef.current = false;
        await loadProfile(user.uid, user.email ?? undefined);
      } else {
        setProfile(null);
        setIsLoaded(true);
      }
    });
    return unsubscribe;
  }, []);

  const saveProfile = useCallback(async (name: string, familyName: string) => {
    const user = auth.currentUser ?? session;
    const uid = user?.uid ?? `anon_${Date.now()}`;
    // Carry communityName through. This rebuilds the whole profile object, so
    // omitting it here would silently reset a user's community byline every
    // time they edited their display name.
    const p: UserProfile = {
      id: uid,
      name,
      familyName,
      email: user?.email ?? undefined,
      communityName: profile?.communityName,
    };

    if (user) {
      pushProfileToCloud(user.uid, name, familyName, user.email);
    }

    try {
      await AsyncStorage.setItem(profileCacheKey(uid), JSON.stringify(p));
    } catch {
      // AsyncStorage failure — profile still set in memory
    }

    setProfile(p);
  }, [session, profile?.communityName]);

  const saveCommunityName = useCallback(async (communityName: string) => {
    const trimmed = communityName.trim();
    if (!trimmed) return;

    const user = auth.currentUser ?? session;
    const uid = user?.uid;
    if (!uid) return;

    setProfile((prev) => {
      const next = prev
        ? { ...prev, communityName: trimmed }
        : { id: uid, name: trimmed, familyName: "", communityName: trimmed };
      AsyncStorage.setItem(profileCacheKey(uid), JSON.stringify(next)).catch(() => {});
      return next;
    });

    pushCommunityNameToCloud(uid, trimmed);
  }, [session]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    await AsyncStorage.multiRemove([
      "parivaar_members_v2",
      "parivaar_chores_v2",
      "parivaar_meals_v2",
      "parivaar_community_v3",
      "parivaar_community_me_v1",
    ]);
    setProfile(null);
    setSession(null);
  }, []);

  return (
    <UserContext.Provider value={{ session, profile, isLoaded, saveProfile, saveCommunityName, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

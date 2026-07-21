import AsyncStorage from "@react-native-async-storage/async-storage";
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";

export interface UserProfile {
  id: string;
  name: string;
  familyName: string;
  email?: string;
}

interface UserContextValue {
  /** Firebase User object — truthy when signed in, null when signed out. */
  session: User | null;
  profile: UserProfile | null;
  isLoaded: boolean;
  saveProfile: (name: string, familyName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const PROFILE_CACHE_PREFIX = "parivaar_profile_v6_";
const UserContext = createContext<UserContextValue | null>(null);

function profileCacheKey(uid: string) {
  return `${PROFILE_CACHE_PREFIX}${uid}`;
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
      // 1. Try the API server (Cloud SQL) — only works when Cloud Run is deployed
      try {
        const domain = process.env.EXPO_PUBLIC_DOMAIN;
        if (domain) {
          const user = auth.currentUser;
          const token = user ? await user.getIdToken() : null;
          if (token) {
            const res = await fetch(`https://${domain}/api/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              const p: UserProfile = {
                id:         data.id,
                name:       data.name,
                familyName: data.familyName,
                email:      data.email ?? email,
              };
              setProfile(p);
              await AsyncStorage.setItem(profileCacheKey(uid), JSON.stringify(p));
              return;
            }
          }
        }
      } catch {
        // API unavailable — fall through to local cache
      }

      // 2. Fall back to per-user AsyncStorage cache
      const cached = await AsyncStorage.getItem(profileCacheKey(uid));
      if (cached) {
        setProfile(JSON.parse(cached));
        return;
      }

      // 3. New user — needs onboarding
      setProfile(null);
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
    const cacheKey = profileCacheKey(uid);

    // Best-effort: upsert to Cloud SQL via API
    let dbId: string | null = null;
    if (user) {
      try {
        const domain = process.env.EXPO_PUBLIC_DOMAIN;
        if (domain) {
          const token = await user.getIdToken();
          const res = await fetch(`https://${domain}/api/profile`, {
            method:  "POST",
            headers: {
              Authorization:  `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, familyName }),
          });
          if (res.ok) {
            const data = await res.json();
            dbId = data.id ?? null;
          }
        }
      } catch {
        // API save failed — local only
      }
    }

    const id = dbId ?? `auth_${uid}`;
    const p: UserProfile = { id, name, familyName, email: user?.email ?? undefined };

    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(p));
    } catch {
      // AsyncStorage failure — profile still set in memory
    }

    setProfile(p);
  }, [session]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    await AsyncStorage.multiRemove([
      "parivaar_members_v2",
      "parivaar_chores_v2",
      "parivaar_meals_v2",
    ]);
    setProfile(null);
    setSession(null);
  }, []);

  return (
    <UserContext.Provider value={{ session, profile, isLoaded, saveProfile, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

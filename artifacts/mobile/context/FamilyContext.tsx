import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { emailIndexDoc, stripUndefined, userDataDoc } from "@/lib/firestore";
import { useUser } from "@/context/UserContext";

export interface FamilyMember {
  id: string;
  name: string;
  role: "parent" | "child";
  color: string;
  invitedEmail?: string;
  isOnApp?: boolean;
}

export interface Chore {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  category: "cleaning" | "cooking" | "shopping" | "childcare" | "other";
  recurring: "daily" | "weekly" | null;
  createdAt: string;
}

interface FamilyContextValue {
  members: FamilyMember[];
  chores: Chore[];
  addMember: (name: string, role: FamilyMember["role"], invitedEmail?: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMemberEmail: (memberId: string, email: string) => Promise<void>;
  addChore: (chore: Omit<Chore, "id" | "createdAt" | "completed">) => Promise<void>;
  toggleChore: (id: string) => Promise<void>;
  deleteChore: (id: string) => Promise<void>;
}

const MEMBER_COLORS = [
  "#E07B39", "#2D6A4F", "#C44B2B", "#7B5EA7", "#2E86AB",
  "#E8A838", "#D45087", "#3B82F6", "#10B981", "#F59E0B",
];

const STORAGE_KEYS = {
  members: "parivaar_members_v2",
  chores: "parivaar_chores_v2",
};

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "m1", name: "Priya", role: "parent", color: "#E07B39" },
  { id: "m2", name: "Rahul", role: "parent", color: "#2D6A4F" },
  { id: "m3", name: "Aryan", role: "child", color: "#7B5EA7" },
];

const DEFAULT_CHORES: Chore[] = [
  { id: "c1", title: "Make breakfast", assignedTo: "m1", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c2", title: "School drop-off", assignedTo: "m2", completed: false, category: "childcare", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c3", title: "Tidy bedroom", assignedTo: "m3", completed: true, category: "cleaning", recurring: "daily", createdAt: new Date().toISOString() },
  { id: "c4", title: "Grocery run", assignedTo: "m1", completed: false, category: "shopping", recurring: "weekly", createdAt: new Date().toISOString() },
  { id: "c5", title: "Dishes after dinner", assignedTo: "m2", completed: false, category: "cooking", recurring: "daily", createdAt: new Date().toISOString() },
];

function generateId() {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { session } = useUser();
  const uid = session?.uid ?? null;

  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_MEMBERS);
  const [chores, setChores] = useState<Chore[]>(DEFAULT_CHORES);
  const [loaded, setLoaded] = useState(false);

  // Latest values for use inside async callbacks and the snapshot listener.
  const membersRef = useRef<FamilyMember[]>(DEFAULT_MEMBERS);
  const choresRef = useRef<Chore[]>(DEFAULT_CHORES);

  function applyState(nextMembers: FamilyMember[], nextChores: Chore[]) {
    membersRef.current = nextMembers;
    choresRef.current = nextChores;
    setMembers(nextMembers);
    setChores(nextChores);
  }

  // Load the local cache first — the app must work offline.
  useEffect(() => {
    async function load() {
      try {
        const [storedMembers, storedChores] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.members),
          AsyncStorage.getItem(STORAGE_KEYS.chores),
        ]);
        const m = storedMembers ? JSON.parse(storedMembers) : membersRef.current;
        const c = storedChores ? JSON.parse(storedChores) : choresRef.current;
        applyState(m, c);
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  // Live sync with Firestore once signed in.
  useEffect(() => {
    if (!uid || !loaded) return;
    let migrated = false;

    const unsubscribe = onSnapshot(
      userDataDoc(uid, "family"),
      (snap) => {
        if (!snap.exists()) {
          // No cloud data for this account yet. Once the *server* (not the
          // local cache) confirms that, upload this device's data so
          // existing users keep their families and chores.
          if (!snap.metadata.fromCache && !migrated) {
            migrated = true;
            setDoc(
              userDataDoc(uid, "family"),
              stripUndefined({
                members: membersRef.current,
                chores: choresRef.current,
                updatedAt: new Date().toISOString(),
              }),
            ).catch(() => {});
          }
          return;
        }

        const data = snap.data();
        const nextMembers: FamilyMember[] = Array.isArray(data.members) ? data.members : [];
        const nextChores: Chore[] = Array.isArray(data.chores) ? data.chores : [];
        applyState(nextMembers, nextChores);
        void refreshIsOnApp(nextMembers);
      },
      () => {
        // Permission/network error — keep local data, stay usable offline.
      },
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, loaded]);

  // Keep the local cache in sync with state.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members)).catch(() => {});
  }, [members, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.chores, JSON.stringify(chores)).catch(() => {});
  }, [chores, loaded]);

  /** Apply locally and write through to Firestore (fire-and-forget). */
  const persist = useCallback((nextMembers: FamilyMember[], nextChores: Chore[]) => {
    applyState(nextMembers, nextChores);
    if (uid) {
      setDoc(
        userDataDoc(uid, "family"),
        stripUndefined({
          members: nextMembers,
          chores: nextChores,
          updatedAt: new Date().toISOString(),
        }),
      ).catch(() => {});
    }
  }, [uid]);

  /** Re-check which invited emails belong to registered accounts. */
  async function refreshIsOnApp(current: FamilyMember[]) {
    const emails = Array.from(
      new Set(current.map((m) => m.invitedEmail).filter(Boolean) as string[]),
    );
    if (emails.length === 0) return;

    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          const snap = await getDoc(emailIndexDoc(email));
          return [email, snap.exists()] as const;
        } catch {
          return [email, undefined] as const;
        }
      }),
    );
    const lookup = new Map<string, boolean | undefined>(results);

    const prev = membersRef.current;
    const next = prev.map((m) => {
      if (!m.invitedEmail) return m;
      const isOnApp = lookup.get(m.invitedEmail);
      return isOnApp === undefined || isOnApp === m.isOnApp ? m : { ...m, isOnApp };
    });
    if (next.some((m, i) => m !== prev[i])) {
      membersRef.current = next;
      setMembers(next);
    }
  }

  const addMember = useCallback(async (name: string, role: FamilyMember["role"], invitedEmail?: string) => {
    const color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    const member: FamilyMember = {
      id: generateId(),
      name,
      role,
      color,
      invitedEmail: invitedEmail?.trim().toLowerCase() || undefined,
      isOnApp: undefined,
    };
    const nextMembers = [...membersRef.current, member];
    persist(nextMembers, choresRef.current);
    if (member.invitedEmail) void refreshIsOnApp(nextMembers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  const deleteMember = useCallback(async (id: string) => {
    persist(
      membersRef.current.filter((m) => m.id !== id),
      choresRef.current.filter((c) => c.assignedTo !== id),
    );
  }, [persist]);

  const updateMemberEmail = useCallback(async (memberId: string, email: string) => {
    const trimmed = email.trim().toLowerCase();

    // Check whether this email belongs to a registered Pariverse account.
    let isOnApp = false;
    try {
      const snap = await getDoc(emailIndexDoc(trimmed));
      isOnApp = snap.exists();
    } catch {}

    const nextMembers = membersRef.current.map((m) =>
      m.id === memberId ? { ...m, invitedEmail: trimmed, isOnApp } : m,
    );
    persist(nextMembers, choresRef.current);
  }, [persist]);

  const addChore = useCallback(async (chore: Omit<Chore, "id" | "createdAt" | "completed">) => {
    const next: Chore = {
      ...chore,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist(membersRef.current, [...choresRef.current, next]);
  }, [persist]);

  const toggleChore = useCallback(async (id: string) => {
    persist(
      membersRef.current,
      choresRef.current.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)),
    );
  }, [persist]);

  const deleteChore = useCallback(async (id: string) => {
    persist(
      membersRef.current,
      choresRef.current.filter((c) => c.id !== id),
    );
  }, [persist]);

  return (
    <FamilyContext.Provider value={{
      members, chores,
      addMember, deleteMember, updateMemberEmail,
      addChore, toggleChore, deleteChore,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}

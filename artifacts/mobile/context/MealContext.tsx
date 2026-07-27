import AsyncStorage from "@react-native-async-storage/async-storage";
import { onSnapshot, setDoc } from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { stripUndefined, userDataDoc } from "@/lib/firestore";
import { useUser } from "@/context/UserContext";

export interface MealEntry {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  ingredients: string[];
  prepTime: string;
  nutritionHighlights?: string;
}

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type MealSlot = "breakfast" | "lunch" | "dinner";

export type WeeklyPlan = {
  [day in DayKey]: { breakfast?: MealEntry; lunch?: MealEntry; dinner?: MealEntry };
};

interface MealContextValue {
  weeklyPlan: WeeklyPlan;
  inventory: string[];
  preferences: string[];
  nutritionalGoals: string[];
  setMeal: (day: DayKey, slot: MealSlot, meal: MealEntry | undefined) => void;
  addInventoryItem: (item: string) => void;
  removeInventoryItem: (item: string) => void;
  setPreferences: (prefs: string[]) => void;
  setNutritionalGoals: (goals: string[]) => void;
}

const EMPTY_PLAN: WeeklyPlan = {
  Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {},
};

const DEFAULT_INVENTORY = [
  "Rice", "Dal (lentils)", "Onions", "Tomatoes", "Potatoes",
  "Garlic", "Ginger", "Cumin", "Turmeric", "Mustard seeds",
  "Coriander", "Paneer", "Yogurt", "Ghee", "Wheat flour",
];

const DEFAULT_PREFERENCES = ["Vegetarian", "No MSG"];
const DEFAULT_GOALS = ["High protein", "Low oil"];

const STORAGE_KEY = "parivaar_meals_v2";
const MealContext = createContext<MealContextValue | null>(null);

interface MealsState {
  weeklyPlan: WeeklyPlan;
  inventory: string[];
  preferences: string[];
  nutritionalGoals: string[];
}

const DEFAULT_STATE: MealsState = {
  weeklyPlan: { ...EMPTY_PLAN },
  inventory: DEFAULT_INVENTORY,
  preferences: DEFAULT_PREFERENCES,
  nutritionalGoals: DEFAULT_GOALS,
};

export function MealProvider({ children }: { children: React.ReactNode }) {
  const { session } = useUser();
  const uid = session?.uid ?? null;

  const [state, setState] = useState<MealsState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef<MealsState>(DEFAULT_STATE);

  function applyState(next: MealsState) {
    stateRef.current = next;
    setState(next);
  }

  // If the signed-in account changes (sign-out, or a different user signing
  // in on this device), drop all in-memory data so the previous user's
  // meals can never leak into — or be migrated into — the next account.
  // Cold start (null -> uid) must NOT reset, or migration would lose the
  // device data loaded from AsyncStorage.
  const prevUidRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevUidRef.current !== null && uid !== prevUidRef.current) {
      applyState(DEFAULT_STATE);
    }
    prevUidRef.current = uid;
  }, [uid]);

  // Load the local cache first — the app must work offline.
  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          applyState({
            weeklyPlan: { ...EMPTY_PLAN, ...(data.weeklyPlan ?? {}) },
            inventory: data.inventory ?? DEFAULT_INVENTORY,
            preferences: data.preferences ?? DEFAULT_PREFERENCES,
            nutritionalGoals: data.nutritionalGoals ?? DEFAULT_GOALS,
          });
        }
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
      userDataDoc(uid, "meals"),
      (snap) => {
        if (!snap.exists()) {
          // First server-confirmed look at an empty account: upload this
          // device's data so existing meal plans and inventory are kept.
          if (!snap.metadata.fromCache && !migrated) {
            migrated = true;
            setDoc(
              userDataDoc(uid, "meals"),
              stripUndefined({ ...stateRef.current, updatedAt: new Date().toISOString() }),
            ).catch(() => {});
          }
          return;
        }

        const data = snap.data();
        applyState({
          weeklyPlan: { ...EMPTY_PLAN, ...(data.weeklyPlan ?? {}) },
          inventory: Array.isArray(data.inventory) ? data.inventory : stateRef.current.inventory,
          preferences: Array.isArray(data.preferences) ? data.preferences : stateRef.current.preferences,
          nutritionalGoals: Array.isArray(data.nutritionalGoals)
            ? data.nutritionalGoals
            : stateRef.current.nutritionalGoals,
        });
      },
      () => {
        // Permission/network error — keep local data, stay usable offline.
      },
    );
    return unsubscribe;
  }, [uid, loaded]);

  // Keep the local cache in sync with state.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  /** Apply locally and write through to Firestore (fire-and-forget). */
  const persist = useCallback((next: MealsState) => {
    applyState(next);
    if (uid) {
      setDoc(
        userDataDoc(uid, "meals"),
        stripUndefined({ ...next, updatedAt: new Date().toISOString() }),
      ).catch(() => {});
    }
  }, [uid]);

  const setMeal = useCallback((day: DayKey, slot: MealSlot, meal: MealEntry | undefined) => {
    const prev = stateRef.current;
    persist({
      ...prev,
      weeklyPlan: { ...prev.weeklyPlan, [day]: { ...prev.weeklyPlan[day], [slot]: meal } },
    });
  }, [persist]);

  const addInventoryItem = useCallback((item: string) => {
    const prev = stateRef.current;
    if (prev.inventory.includes(item)) return;
    persist({ ...prev, inventory: [...prev.inventory, item] });
  }, [persist]);

  const removeInventoryItem = useCallback((item: string) => {
    const prev = stateRef.current;
    persist({ ...prev, inventory: prev.inventory.filter((i) => i !== item) });
  }, [persist]);

  const setPreferences = useCallback((prefs: string[]) => {
    persist({ ...stateRef.current, preferences: prefs });
  }, [persist]);

  const setNutritionalGoals = useCallback((goals: string[]) => {
    persist({ ...stateRef.current, nutritionalGoals: goals });
  }, [persist]);

  return (
    <MealContext.Provider value={{
      weeklyPlan: state.weeklyPlan,
      inventory: state.inventory,
      preferences: state.preferences,
      nutritionalGoals: state.nutritionalGoals,
      setMeal, addInventoryItem, removeInventoryItem, setPreferences, setNutritionalGoals,
    }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error("useMeals must be used within MealProvider");
  return ctx;
}

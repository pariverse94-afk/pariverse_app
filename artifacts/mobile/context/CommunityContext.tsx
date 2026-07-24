import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  deleteDoc,
  getDoc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { postDoc, postsCollection, reportsCollection, userDataDoc } from "@/lib/firestore";
import { useUser } from "@/context/UserContext";

export type PostCategory = "recipe" | "parenting" | "health" | "general";

/** Shape shown to the UI (per-user liked/saved flags resolved). */
export interface Post {
  id: string;
  authorId?: string;
  authorName: string;
  authorColor: string;
  content: string;
  category: PostCategory;
  likes: number;
  liked: boolean;
  saved: boolean;
  createdAt: string;
  isOwn?: boolean;
}

/** Shape stored in the shared communityPosts collection. */
interface StoredPost {
  id: string;
  authorId: string;
  authorName: string;
  authorColor: string;
  content: string;
  category: PostCategory;
  likeCount: number;
  createdAt: string;
  isSeed?: boolean;
}

interface CommunityContextValue {
  posts: Post[];
  loading: boolean;
  addPost: (content: string, category: PostCategory) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  savePost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  /** Report a post as inappropriate and hide it from this user's feed. */
  reportPost: (id: string) => Promise<void>;
}

const SEEDS: Array<Omit<StoredPost, "authorId" | "createdAt" | "likeCount"> & { hoursAgo: number }> = [
  { id: "seed1", authorName: "Sunita Sharma", authorColor: "#E07B39", content: "My 3-year-old has been refusing vegetables for weeks. Finally cracked the code — blend spinach into his dal! He has no idea and finishes everything. Game changer for picky eaters.", category: "parenting", isSeed: true, hoursAgo: 2 },
  { id: "seed2", authorName: "Kavitha R.", authorColor: "#2D6A4F", content: "Sharing my protein-rich tiffin box recipe for school kids: moong dal chilla with mint chutney, boiled egg, mixed fruit. My son's teacher said he's more focused in afternoon class now!", category: "recipe", isSeed: true, hoursAgo: 5 },
  { id: "seed3", authorName: "Ananya M.", authorColor: "#7B5EA7", content: "Paediatrician confirmed — screen time guidelines for under-2s: zero. For 2-5: max 1 hour/day of quality content. Our new rule: no screens during meals and 1 hour before bed. Already seeing calmer bedtimes!", category: "health", isSeed: true, hoursAgo: 8 },
  { id: "seed4", authorName: "Divya Nair", authorColor: "#2E86AB", content: "Anyone else dealing with separation anxiety when dropping off at daycare? What worked for us: a special goodbye ritual — one hug, one high-five, one wave from the window. Consistency was key. Took 2 weeks but now she walks in happily.", category: "parenting", isSeed: true, hoursAgo: 12 },
  { id: "seed5", authorName: "Meena Kulkarni", authorColor: "#D45087", content: "Quick weeknight recipe: Palak paneer in 20 minutes. Blanch spinach, blend with 1 onion + 2 tomatoes. Saute with ghee, cumin, garam masala. Add paneer cubes. Perfect with roti. Kids love the color!", category: "recipe", isSeed: true, hoursAgo: 24 },
  { id: "seed6", authorName: "Lakshmi P.", authorColor: "#E8A838", content: "Varicella vaccination reminder: if your child hasn't had chickenpox or the vaccine, the second dose is due between 4-6 years. Our local PHC gives it free under Universal Immunization. Don't skip boosters!", category: "health", isSeed: true, hoursAgo: 48 },
];

const POSTS_CACHE_KEY = "parivaar_community_v3";
const ME_CACHE_KEY = "parivaar_community_me_v1";
const OWN_COLORS = ["#C44B2B", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

/** One-time: fill an empty community with friendly starter posts. */
async function seedCommunity(uid: string) {
  await Promise.all(
    SEEDS.map(({ id, hoursAgo, ...rest }) =>
      setDoc(postDoc(id), {
        ...rest,
        authorId: uid,
        likeCount: 0,
        createdAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      }).catch(() => {}),
    ),
  );
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { session, profile } = useUser();
  const uid = session?.uid ?? null;

  const [rawPosts, setRawPosts] = useState<StoredPost[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);

  // Cold-start: show cached feed and personal flags immediately.
  useEffect(() => {
    (async () => {
      try {
        const [cachedPosts, cachedMe] = await Promise.all([
          AsyncStorage.getItem(POSTS_CACHE_KEY),
          AsyncStorage.getItem(ME_CACHE_KEY),
        ]);
        if (cachedPosts) setRawPosts(JSON.parse(cachedPosts));
        if (cachedMe) {
          const me = JSON.parse(cachedMe);
          setLikedIds(new Set(me.likedPostIds ?? []));
          setSavedIds(new Set(me.savedPostIds ?? []));
          setHiddenIds(new Set(me.hiddenPostIds ?? []));
        }
      } catch {}
    })();
  }, []);

  // Live shared feed (rules require a signed-in user).
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const feedQuery = query(postsCollection(), orderBy("createdAt", "desc"), limit(200));
    const unsubscribe = onSnapshot(
      feedQuery,
      (snap) => {
        const list: StoredPost[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<StoredPost, "id">),
          id: d.id,
        }));
        setRawPosts(list);
        setLoading(false);
        AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(list)).catch(() => {});

        // Server-confirmed empty community → write the starter posts once.
        if (snap.empty && !snap.metadata.fromCache && !seededRef.current) {
          seededRef.current = true;
          void seedCommunity(uid);
        }
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, [uid]);

  // Personal liked/saved/hidden sets from Firestore (cross-device).
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const snap = await getDoc(userDataDoc(uid, "community"));
        if (snap.exists()) {
          const d = snap.data();
          setLikedIds(new Set(d.likedPostIds ?? []));
          setSavedIds(new Set(d.savedPostIds ?? []));
          setHiddenIds(new Set(d.hiddenPostIds ?? []));
          AsyncStorage.setItem(ME_CACHE_KEY, JSON.stringify({
            likedPostIds: d.likedPostIds ?? [],
            savedPostIds: d.savedPostIds ?? [],
            hiddenPostIds: d.hiddenPostIds ?? [],
          })).catch(() => {});
        }
      } catch {}
    })();
  }, [uid]);

  const persistMe = useCallback((liked: Set<string>, saved: Set<string>, hidden: Set<string>) => {
    const payload = {
      likedPostIds: [...liked],
      savedPostIds: [...saved],
      hiddenPostIds: [...hidden],
      updatedAt: new Date().toISOString(),
    };
    AsyncStorage.setItem(ME_CACHE_KEY, JSON.stringify(payload)).catch(() => {});
    if (uid) {
      setDoc(userDataDoc(uid, "community"), payload, { merge: true }).catch(() => {});
    }
  }, [uid]);

  const posts: Post[] = useMemo(
    () =>
      rawPosts
        .filter((p) => !hiddenIds.has(p.id))
        .map((p) => ({
          id: p.id,
          authorId: p.authorId,
          authorName: p.authorName,
          authorColor: p.authorColor,
          content: p.content,
          category: p.category,
          likes: p.likeCount ?? 0,
          liked: likedIds.has(p.id),
          saved: savedIds.has(p.id),
          createdAt: p.createdAt,
          isOwn: !!uid && p.authorId === uid && !p.isSeed,
        })),
    [rawPosts, likedIds, savedIds, hiddenIds, uid],
  );

  const addPost = useCallback(async (content: string, category: PostCategory) => {
    if (!uid) return;
    const color = OWN_COLORS[Math.floor(Math.random() * OWN_COLORS.length)];
    const authorName = profile?.name?.trim() || "Pariverse Mom";
    try {
      await addDoc(postsCollection(), {
        authorId: uid,
        authorName,
        authorColor: color,
        content,
        category,
        likeCount: 0,
        createdAt: new Date().toISOString(),
      });
    } catch {}
  }, [uid, profile?.name]);

  const likePost = useCallback(async (id: string) => {
    const isLiked = likedIds.has(id);
    const next = new Set(likedIds);
    if (isLiked) next.delete(id);
    else next.add(id);
    setLikedIds(next);
    persistMe(next, savedIds, hiddenIds);

    if (uid) {
      updateDoc(postDoc(id), { likeCount: increment(isLiked ? -1 : 1) }).catch(() => {});
    }
  }, [likedIds, savedIds, hiddenIds, uid, persistMe]);

  const savePost = useCallback(async (id: string) => {
    const next = new Set(savedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedIds(next);
    persistMe(likedIds, next, hiddenIds);
  }, [likedIds, savedIds, hiddenIds, persistMe]);

  const deletePost = useCallback(async (id: string) => {
    // Optimistic removal; rules only allow deleting your own posts.
    setRawPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(postDoc(id));
    } catch {}
  }, []);

  const reportPost = useCallback(async (id: string) => {
    if (!uid) return;
    const post = rawPosts.find((p) => p.id === id);

    // Hide immediately on this account (synced across the user's devices).
    const nextHidden = new Set(hiddenIds);
    nextHidden.add(id);
    setHiddenIds(nextHidden);
    persistMe(likedIds, savedIds, nextHidden);

    try {
      await addDoc(reportsCollection(), {
        postId: id,
        postAuthorId: post?.authorId ?? null,
        postContent: post?.content ?? "",
        reason: "inappropriate_content",
        reportedBy: uid,
        createdAt: new Date().toISOString(),
      });
    } catch {}
  }, [uid, rawPosts, likedIds, savedIds, hiddenIds, persistMe]);

  return (
    <CommunityContext.Provider value={{ posts, loading, addPost, likePost, savePost, deletePost, reportPost }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}

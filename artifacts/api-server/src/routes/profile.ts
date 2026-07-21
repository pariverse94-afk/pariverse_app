import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, usersTable } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middlewares/auth";

const router = Router();

const upsertSchema = z.object({
  name:       z.string().min(1).max(100),
  familyName: z.string().min(1).max(100),
});

/**
 * GET /api/profile
 * Returns the current user's profile from Cloud SQL.
 * Requires: Authorization: Bearer <firebase-id-token>
 */
router.get("/profile", requireAuth, async (req, res) => {
  const { uid, userEmail } = req as AuthedRequest;

  try {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.firebaseUid, uid))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    const row = rows[0]!;
    res.json({
      id:         row.id,
      name:       row.name,
      familyName: row.familyName,
      email:      row.email ?? userEmail ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "GET /api/profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/profile
 * Upsert the current user's profile in Cloud SQL.
 * Requires: Authorization: Bearer <firebase-id-token>
 * Body: { name: string, familyName: string }
 */
router.post("/profile", requireAuth, async (req, res) => {
  const { uid, userEmail } = req as AuthedRequest;

  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  const { name, familyName } = parsed.data;

  try {
    const rows = await db
      .insert(usersTable)
      .values({ firebaseUid: uid, email: userEmail ?? null, name, familyName })
      .onConflictDoUpdate({
        target: usersTable.firebaseUid,
        set: { name, familyName, email: userEmail ?? null },
      })
      .returning();

    const row = rows[0]!;
    res.json({
      id:         row.id,
      name:       row.name,
      familyName: row.familyName,
      email:      row.email ?? userEmail ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "POST /api/profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/profile
 * Permanently deletes the user's profile and Firebase auth account.
 * Requires: Authorization: Bearer <firebase-id-token>
 */
router.delete("/profile", requireAuth, async (req, res) => {
  const { uid } = req as AuthedRequest;

  try {
    await db.delete(usersTable).where(eq(usersTable.firebaseUid, uid));

    // Best-effort: delete the Firebase Auth account so the user can re-register fresh.
    const { adminAuth } = await import("../lib/firebase-admin");
    try { await adminAuth.deleteUser(uid); } catch { /* already gone */ }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "DELETE /api/profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

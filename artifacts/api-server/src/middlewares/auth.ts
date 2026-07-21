import type { NextFunction, Request, Response } from "express";
import { verifyIdToken } from "../lib/firebase-admin";

export interface AuthedRequest extends Request {
  uid: string;
  userEmail?: string;
}

/**
 * Middleware that verifies a Firebase ID token from the Authorization header.
 * Attaches req.uid and req.userEmail on success; returns 401 on failure.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  const decoded = await verifyIdToken(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  (req as AuthedRequest).uid = decoded.uid;
  (req as AuthedRequest).userEmail = decoded.email;
  next();
}

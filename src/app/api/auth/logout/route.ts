import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Clear the auth cookie and end session.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  clearTokenCookie(response);
  return response;
}

import { NextResponse } from "next/server";
import { agents } from "@/data/agents";

/**
 * GET /api/agents — Team roster (static data)
 */
export async function GET() {
  return NextResponse.json({ agents });
}

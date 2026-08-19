import { NextResponse } from "next/server";
import { listContext, storageMode } from "../../../lib/relay-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ...(await listContext()), storageMode });
}

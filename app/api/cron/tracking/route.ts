import { NextResponse } from "next/server";
import { runTrackingCheck } from "@/lib/tracking";

// Runs daily (see vercel.json). Vercel sends "Authorization: Bearer CRON_SECRET".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return NextResponse.json(await runTrackingCheck());
}

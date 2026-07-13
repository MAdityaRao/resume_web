import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }

    await pool.query("DELETE FROM resume_agent_logs WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Database error:", e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

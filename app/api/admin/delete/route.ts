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
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    if (req.headers.get("X-Requested-With") !== "XMLHttpRequest") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await pool.query("DELETE FROM resume_agent_logs WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Database error:", e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

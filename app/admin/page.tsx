import { pool } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

async function getLogs() {
  try {
    // Exclude logs from "Test" or containing "Test" in visitor_name
    const result = await pool.query(`
      SELECT * FROM resume_agent_logs
      WHERE LOWER(visitor_name) NOT LIKE '%test%'
      ORDER BY created_at DESC
    `);
    return result.rows;
  } catch (e) {
    console.error("Database error:", e);
    return [];
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    redirect("/admin/login");
  }

  const logs = await getLogs();

  return <AdminDashboard logs={logs} />;
}

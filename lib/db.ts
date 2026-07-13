import { Pool } from "@neondatabase/serverless";

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL must be defined");
}

export const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

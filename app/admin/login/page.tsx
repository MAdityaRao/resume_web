"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Wrong password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh p-4 bg-bg text-primary">
      <div className="w-full max-w-sm mx-auto mt-4">
        <BackButton />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleLogin} className="flex flex-col gap-6 p-4 sm:p-8 bg-card rounded-2xl w-full max-w-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
            <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Authorized Access Only</p>
          </div>

          {/* Warning Section */}
          <div className="p-5 bg-red-100 border-2 border-red-200 rounded-xl">
            <p className="text-sm font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Restricted Area
            </p>
            <p className="text-xs text-red-800 leading-relaxed font-medium">
              This system is for the exclusive use of <strong>Aditya Rao</strong>. Unauthorized access attempts are actively monitored and logged. Proceed only if you are authorized.
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(e as any);
            }}
            placeholder="Password"
            className="p-3 bg-bg rounded-lg text-primary border border-border focus:border-yellow-500/50 outline-none transition-colors"
          />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-primary text-bg font-bold rounded-lg hover:bg-yellow-500 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Identity"}
          </button>
        </form>
      </div>
    </div>
  );
}

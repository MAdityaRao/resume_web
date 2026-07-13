"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col gap-6 p-8 glass-strong rounded-2xl w-full max-w-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Authorized Access Only</p>
        </div>

        {/* Warning Section */}
        <div className="p-5 bg-red-950/40 border-2 border-red-700/50 rounded-xl">
          <p className="text-sm font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Restricted Area
          </p>
          <p className="text-xs text-red-200 leading-relaxed font-medium">
            This system is for the exclusive use of <strong>Aditya Rao</strong>. Unauthorized access attempts are actively monitored and logged. Proceed only if you are authorized.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-3 bg-white/10 rounded-lg text-white border border-white/5 focus:border-amber/50 outline-none transition-colors"
        />
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button type="submit" className="p-3 bg-amber text-black font-bold rounded-lg hover:bg-amber/90 transition-colors">
          Verify Identity
        </button>
      </form>
    </div>
  );
}

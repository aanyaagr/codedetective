"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") await register(name, email, password);
      else await login(email, password);
      router.push("/case-board");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07090F] text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/25 bg-[#0B0E17] p-7 shadow-2xl">
        <Link href="/" className="text-xs font-mono text-amber-400">← CODEDETECTIVE ACADEMY</Link>
        <h1 className="mt-6 text-3xl font-black tracking-tight">{mode === "login" ? "ENTER THE BUREAU" : "CREATE DETECTIVE ID"}</h1>
        <p className="mt-2 text-sm text-slate-400">Your account stores XP, evidence, cases and investigation progress.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {mode === "register" && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Detective name" required className="w-full rounded-lg border border-white/10 bg-[#07090F] px-4 py-3 outline-none focus:border-amber-500/50" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full rounded-lg border border-white/10 bg-[#07090F] px-4 py-3 outline-none focus:border-amber-500/50" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (6+ characters)" minLength={6} required className="w-full rounded-lg border border-white/10 bg-[#07090F] px-4 py-3 outline-none focus:border-amber-500/50" />
          {error && <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</div>}
          <button disabled={loading} className="w-full rounded-lg bg-amber-500 px-4 py-3 font-black text-black transition hover:bg-amber-400 disabled:opacity-50">
            {loading ? "AUTHENTICATING..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="mt-5 w-full text-sm text-slate-400 hover:text-amber-300">
          {mode === "login" ? "New detective? Create an account" : "Already registered? Sign in"}
        </button>
      </div>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth";
import { AlertTriangle, ArrowLeft, LockKeyhole, Mail, ShieldCheck, Terminal } from "lucide-react";
import { DetectiveLogoIcon, RubberStamp } from "@/components/ui/Icons";

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

  const isLogin = mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050608] text-slate-100">
      {/* Noir investigation-board atmosphere */}
      <div className="absolute inset-0 corkboard-surface opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(220,38,38,0.10),transparent_38%)]" />
      <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-red-700/[0.07] blur-[110px]" />
      <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-amber-600/[0.05] blur-[110px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Case-file branding */}
          <section className="hidden lg:block">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-red-700/50 bg-black/40 shadow-[0_0_25px_rgba(220,38,38,0.12)] transition-transform group-hover:scale-105">
                <DetectiveLogoIcon className="h-10 w-10" />
              </div>
              <div>
                <div className="font-sans text-xl font-black tracking-[0.12em] text-[#F5F2ED]">
                  CODE<span className="text-red-500">DETECTIVE</span>
                </div>
                <div className="font-mono text-[9px] font-black tracking-[0.32em] text-slate-500">
                  ACADEMY // CRIME LAB
                </div>
              </div>
            </Link>

            <div className="mt-12 border-l-2 border-red-600/80 pl-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                BUREAU ACCESS // SECURE CHANNEL
              </p>
              <h2 className="mt-4 max-w-md font-sans text-5xl font-black uppercase leading-[0.95] tracking-tight text-[#F5F2ED]">
                YOUR CASE FILE
                <span className="block text-red-500">AWAITS.</span>
              </h2>
              <p className="mt-5 max-w-md font-mono text-sm leading-7 text-slate-500">
                Sign in to continue your investigation, preserve your evidence, collect XP, and advance your detective rank.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              BUREAU NETWORK ONLINE
            </div>
          </section>

          {/* Authentication dossier */}
          <section className="relative mx-auto w-full max-w-xl">
            <div className="absolute -top-3 left-7 z-20">
              <div className="h-7 w-7 rounded-full border border-red-400/70 bg-red-700 shadow-[0_3px_8px_rgba(0,0,0,0.7)]" />
            </div>
            <div className="absolute -top-3 right-7 z-20">
              <div className="h-7 w-7 rounded-full border border-amber-300/50 bg-amber-600 shadow-[0_3px_8px_rgba(0,0,0,0.7)]" />
            </div>

            <div className="relative overflow-hidden rounded-sm border border-red-900/70 bg-[#0B0D12]/95 shadow-[0_30px_80px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="border-b border-red-950/70 bg-[#0E1015] px-6 py-3 sm:px-8">
                <div className="flex items-center justify-between gap-4 font-mono text-[9px] font-black uppercase tracking-[0.22em]">
                  <span className="text-red-500">PRECINCT #404 // ACCESS DESK</span>
                  <span className="text-slate-600">FILE AUTH-001</span>
                </div>
              </div>

              <div className="p-6 sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded border border-amber-600/40 bg-amber-950/20 lg:hidden">
                        <DetectiveLogoIcon className="h-9 w-9" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
                          {isLogin ? "RETURNING DETECTIVE" : "NEW RECRUIT"}
                        </p>
                        <h1 className="mt-1 font-sans text-3xl font-black uppercase tracking-tight text-[#F5F2ED] sm:text-4xl">
                          {isLogin ? "ENTER THE BUREAU" : "CREATE DETECTIVE ID"}
                        </h1>
                      </div>
                    </div>
                    <p className="max-w-lg font-mono text-xs leading-6 text-slate-500">
                      {isLogin
                        ? "Authenticate your credentials to reopen your active investigation."
                        : "Register your detective identity to begin storing cases, evidence and XP."}
                    </p>
                  </div>
                  <RubberStamp
                    text={isLogin ? "AUTHORIZED" : "NEW FILE"}
                    color={isLogin ? "emerald" : "red"}
                    rotation="rotate-3"
                    className="hidden sm:inline-block shrink-0"
                  />
                </div>

                <div className="my-7 h-px bg-gradient-to-r from-red-800/70 via-white/[0.08] to-transparent" />

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === "register" && (
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Detective Name
                      </span>
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="ENTER YOUR DETECTIVE NAME"
                        required
                        className="w-full rounded-sm border border-white/[0.09] bg-[#07090D] px-4 py-3.5 font-mono text-sm text-slate-100 placeholder:text-slate-700 outline-none transition focus:border-red-600/70 focus:ring-1 focus:ring-red-600/20"
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      <Mail className="h-3.5 w-3.5 text-red-500" /> Bureau Email
                    </span>
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      placeholder="ENTER REGISTERED EMAIL"
                      required
                      className="w-full rounded-sm border border-white/[0.09] bg-[#07090D] px-4 py-3.5 font-mono text-sm text-slate-100 placeholder:text-slate-700 outline-none transition focus:border-red-600/70 focus:ring-1 focus:ring-red-600/20"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      <LockKeyhole className="h-3.5 w-3.5 text-amber-500" /> Access Code
                    </span>
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                      placeholder="ENTER PASSWORD"
                      minLength={6}
                      required
                      className="w-full rounded-sm border border-white/[0.09] bg-[#07090D] px-4 py-3.5 font-mono text-sm text-slate-100 placeholder:text-slate-700 outline-none transition focus:border-red-600/70 focus:ring-1 focus:ring-red-600/20"
                    />
                  </label>

                  {error && (
                    <div className="flex items-start gap-3 rounded-sm border border-red-700/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-red-500">ACCESS DENIED</p>
                        <p className="mt-1 font-mono text-xs leading-5">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-sm border border-red-400/60 bg-red-600 px-4 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(220,38,38,0.16)] transition hover:bg-red-500 hover:shadow-[0_12px_36px_rgba(220,38,38,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Terminal className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                    {loading ? "AUTHENTICATING..." : isLogin ? "AUTHENTICATE & ENTER" : "OPEN DETECTIVE FILE"}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
                  <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-wider text-slate-600 transition hover:text-red-400">
                    <ArrowLeft className="h-3.5 w-3.5" /> Return to Academy
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}
                    className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 transition hover:text-amber-400"
                  >
                    {isLogin ? "NEW DETECTIVE? REGISTER" : "ALREADY REGISTERED? SIGN IN"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-2 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-700">
              <span>CONFIDENTIAL // EYES ONLY</span>
              <span className="flex items-center gap-1.5"><LockKeyhole className="h-3 w-3" /> SECURE AUTH CHANNEL</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

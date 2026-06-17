import { motion } from "framer-motion";
import { Lock, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { grimwoodMemberLog, hubItems } from "../data/siteData";
import { createMember, signInMember, signOutMember } from "../lib/firebase";
import { SectionHeader } from "./SectionHeader";

export function CommunityHub() {
  const { user, loading: authLoading, admin } = useAuth();
  const memberUser = user && !user.isAnonymous ? user : null;
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await signInMember(email, password);
      } else {
        await createMember(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOutMember();
  }

  return (
    <section id="hub" className="page-section px-5">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Member Hub"
          title="Team notes, design logs, and build targets."
          text="Members can review current Grimwood direction and keep production notes in one place."
        />

        {authLoading ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Checking member session...</div>
        ) : !memberUser ? (
          <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(70,48,130,0.08)] lg:grid-cols-2">
            <div className="rounded-t-[2rem] bg-[linear-gradient(135deg,rgba(251,191,36,.14),rgba(14,165,233,.08),transparent)] p-8 md:rounded-l-[2rem] md:rounded-tr-none md:p-10">
              <Lock className="mb-6 text-violet-700" size={42} />
              <h3 className="text-3xl font-black">Member access</h3>
              <p className="mt-4 leading-8 text-slate-600">
                Sign in to view announcements, documents, design notes, private links, and studio resources.
              </p>
              <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-600">
                Your member session is remembered in this browser until you sign out.
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-6 flex rounded-full bg-white/35 p-1 shadow-inner shadow-white/25 backdrop-blur-xl">
                {(["login", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 rounded-full px-4 py-3 text-sm font-black capitalize ${mode === tab ? "border border-amber-500/35 bg-amber-300/70 text-slate-950 shadow-sm backdrop-blur-xl" : "text-slate-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <label className="mb-2 block text-sm font-bold text-slate-600">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 outline-none ring-violet-200/0 transition focus:ring-4" />

              <label className="mb-2 block text-sm font-bold text-slate-600">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 outline-none ring-violet-200/0 transition focus:ring-4" />

              {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button onClick={handleSubmit} disabled={loading} className="w-full rounded-full border border-amber-500/35 bg-amber-300/70 px-5 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:opacity-60">
                {loading ? "Loading..." : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="section-panel p-6 md:p-8">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-violet-700">{admin ? "Admin Dashboard" : "Dashboard"}</p>
                  <h3 className="mt-2 text-3xl font-black">Welcome, {memberUser.displayName || memberUser.email}</h3>
                </div>
                <button onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/35 px-5 py-3 font-bold text-slate-950 backdrop-blur-xl hover:bg-white/60">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hubItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <item.icon className="mb-4 text-violet-700" />
                    <h4 className="text-lg font-black">{item.title}</h4>
                    <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <article className="section-panel overflow-hidden">
              <div className="rounded-t-[1.5rem] border-b border-slate-200 bg-violet-50 p-6 md:p-8">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-700">Member Log</p>
                <h3 className="mt-3 text-3xl font-black text-slate-950">{grimwoodMemberLog.project}</h3>
                <p className="mt-3 max-w-3xl leading-8 text-slate-600">{grimwoodMemberLog.heading}</p>
              </div>

              <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.1fr_.9fr]">
                <div>
                  <LogBlock title="Gameplay" items={grimwoodMemberLog.gameplay} />
                  <LogBlock title="Player Return Systems" items={grimwoodMemberLog.retention} />
                  <LogBlock title="Classes" items={grimwoodMemberLog.classes} />
                </div>

                <div>
                  <LogBlock title="Builders" items={grimwoodMemberLog.builders} />
                  <LogBlock title="Modelers" items={grimwoodMemberLog.modelers} compact />
                  <LogBlock title="Scripters" items={grimwoodMemberLog.scripters} />
                  <p className="border-t border-slate-200 pt-5 leading-7 text-slate-600">{grimwoodMemberLog.next}</p>
                </div>
              </div>
            </article>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function LogBlock({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) {
  return (
    <section className="mb-8">
      <h4 className="mb-4 text-xl font-black text-slate-950">{title}</h4>
      <ul className={`grid gap-3 ${compact ? "sm:grid-cols-2" : ""}`}>
        {items.map((item) => (
          <li key={item} className="member-log-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}


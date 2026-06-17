import { Megaphone, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { seedAnnouncements } from "../data/siteData";
import { postAnnouncement, watchAnnouncements, type Announcement } from "../lib/announcements";
import { SectionHeader } from "./SectionHeader";

export function AnnouncementsSection() {
  const { user, loading: authLoading, admin, adminLoading } = useAuth();
  const memberUser = user && !user.isAnonymous ? user : null;
  const [liveAnnouncements, setLiveAnnouncements] = useState<Announcement[]>([]);
  const [loadError, setLoadError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postError, setPostError] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!memberUser) {
      setLiveAnnouncements([]);
      setLoadError("");
      return;
    }

    return watchAnnouncements(setLiveAnnouncements, setLoadError);
  }, [memberUser]);

  const announcements = useMemo<Announcement[]>(() => [...liveAnnouncements, ...seedAnnouncements], [liveAnnouncements]);

  async function handlePublish() {
    if (!title.trim() || !body.trim()) {
      setPostError("Add both a title and announcement text.");
      return;
    }

    setPosting(true);
    setPostError("");
    try {
      await postAnnouncement(title, body);
      setTitle("");
      setBody("");
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "Announcement could not be posted.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="page-section px-5">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Announcements"
          title="Studio updates that the team should not miss."
          text="Announcement posts are visible here. Only Gambox admins can publish new ones."
        />

        {authLoading ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Checking member session...</div>
        ) : !memberUser ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center md:p-12">
            <Megaphone className="mx-auto text-violet-700" size={34} />
            <h3 className="mt-5 text-3xl font-black text-slate-950">Member announcements</h3>
            <p className="mx-auto mt-4 max-w-xl leading-8 text-slate-600">
              Announcements are for signed-in Gambox members.
            </p>
            <Link to="/members" className="mt-7 inline-flex rounded-full border border-amber-500/35 bg-amber-300/70 px-6 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl hover:bg-amber-300/85">
              Member Login
            </Link>
          </div>
        ) : (
        <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
          <aside className="section-panel h-fit p-6 md:p-8">
            <div className="flex items-center gap-3 text-violet-700">
              <Megaphone size={22} />
              <h3 className="text-2xl font-black text-slate-950">Post control</h3>
            </div>

            {adminLoading ? (
              <p className="mt-5 leading-7 text-slate-600">Checking admin access...</p>
            ) : admin ? (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-600">Title</label>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="mb-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-violet-200/0 transition focus:ring-4" />

                <label className="mb-2 block text-sm font-bold text-slate-600">Announcement</label>
                <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={7} className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 leading-7 outline-none ring-violet-200/0 transition focus:ring-4" />

                {postError && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{postError}</p>}

                <button onClick={handlePublish} disabled={posting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-5 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl hover:bg-amber-300/85 disabled:opacity-60">
                  <Send size={18} /> {posting ? "Publishing..." : "Publish Announcement"}
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4 leading-7 text-slate-600">
                <p>You are signed in as a member. Posting is reserved for admins.</p>
                <p className="border-l-2 border-violet-200 pl-4 text-sm text-slate-500">
                  Admin access is reserved for olerblaine@gmail.com.
                </p>
              </div>
            )}
          </aside>

          <div className="grid gap-4">
            {loadError && <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">Live announcement feed unavailable: {loadError}</p>}

            {announcements.map((announcement) => (
              <article key={announcement.id} className="section-panel p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-700">{formatAnnouncementDate(announcement)}</p>
                  {announcement.createdAt && <span className="rounded-full border border-emerald-200/70 bg-emerald-50/65 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 backdrop-blur-xl">Live</span>}
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-950">{announcement.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{announcement.body}</p>
                {announcement.href && (
                  <a href={announcement.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-violet-200/45 bg-white/35 px-4 py-3 font-bold text-slate-950 backdrop-blur-xl transition hover:border-violet-300 hover:bg-white/60 hover:text-violet-700">
                    {announcement.linkLabel || "Open link"}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

function formatAnnouncementDate(announcement: Announcement) {
  if (announcement.date) return announcement.date;
  if (!announcement.createdAt) return "New update";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(announcement.createdAt.seconds * 1000));
}


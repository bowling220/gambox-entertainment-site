import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Gamepad2, Image, ListChecks, Megaphone, Wrench, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import gamboxMark from "../assets/gambox-brand-icon.png";
import grimwoodArt from "../assets/grimwood-blackout-key-art.png";
import { games, seedAnnouncements } from "../data/siteData";

type Game = (typeof games)[number];

export function GameDetailPage() {
  const { slug } = useParams();
  const game = games.find((item) => item.slug === slug);

  if (!game) {
    return <Navigate to="/games" replace />;
  }

  const isGrimwood = game.slug === "grimwood-blackout";
  const relatedAnnouncements = seedAnnouncements
    .filter((announcement) => announcement.title.toLowerCase().includes(isGrimwood ? "grimwood" : game.title.toLowerCase().replace("!", "")) || announcement.body.toLowerCase().includes(isGrimwood ? "grimwood" : game.title.toLowerCase().replace("!", "")))
    .slice(0, 3);

  return (
    <section className="page-section px-5">
      <div className="mx-auto max-w-7xl">
        <Link to="/games" className="animated-cta mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/55 bg-white/55 px-5 py-3 text-sm font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75">
          <ArrowLeft size={17} /> Back to Games
        </Link>

        <article className="game-feature overflow-hidden rounded-[2rem] border border-violet-200/45 shadow-[0_18px_60px_rgba(70,48,130,0.12)]">
          <div className="relative min-h-[440px]">
            {isGrimwood ? (
              <img src={grimwoodArt} alt="Grimwood Blackout base under attack in a forest at night" className="h-full min-h-[440px] w-full object-cover" />
            ) : (
              <div className="highlight-game-fallback flex h-full min-h-[440px] w-full items-center justify-center">
                <img src={gamboxMark} alt="" className="h-28 w-28 rounded-[2rem] shadow-2xl shadow-violet-950/20" />
              </div>
            )}
            <div className="game-feature-overlay absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <span className="loading-status-badge rounded-full border border-amber-500/35 bg-amber-300/75 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950 backdrop-blur-xl">
                <span>{game.status}</span>
                <span className="loading-status-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] text-slate-950 md:text-7xl">{game.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">{game.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/games" className="animated-cta button-shimmer inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85">
                  Follow Development <ArrowRight className="animated-cta-icon" size={18} />
                </Link>
                <Link to="/careers" className="animated-cta inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/45 px-7 py-4 font-black text-slate-950 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/65">
                  Interested in Helping?
                </Link>
              </div>
            </div>
          </div>
        </article>

        {isGrimwood ? <GrimwoodDetails game={game} relatedAnnouncements={relatedAnnouncements} /> : <PlanningDetails game={game} />}
      </div>
    </section>
  );
}

function GrimwoodDetails({ game, relatedAnnouncements }: { game: Game; relatedAnnouncements: typeof seedAnnouncements }) {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <div className="grid gap-6">
        <DetailPanel icon={Gamepad2} title="Gameplay Loop">
          <ul className="grid gap-3">
            {game.gameplayLoop?.map((item) => (
              <li key={item} className="member-log-item">{item}</li>
            ))}
          </ul>
        </DetailPanel>

        <DetailPanel icon={Wrench} title="Planned Mechanics">
          <div className="grid gap-3 md:grid-cols-2">
            {game.plannedMechanics?.map((item) => (
              <div key={item} className="rounded-2xl border border-violet-200/45 bg-violet-50/55 p-4 font-bold leading-7 text-slate-700 backdrop-blur-xl">{item}</div>
            ))}
          </div>
        </DetailPanel>
      </div>

      <div className="grid gap-6">
        <DetailPanel icon={BriefcaseBusiness} title="Roles Needed">
          <div className="flex flex-wrap gap-2">
            {game.rolesNeeded?.map((role) => (
              <Link key={role} to="/careers" className="rounded-full border border-amber-500/35 bg-amber-300/70 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/10 backdrop-blur-xl transition hover:bg-amber-300/85">
                {role}
              </Link>
            ))}
          </div>
        </DetailPanel>

        <RoadmapPanel game={game} />

        <DetailPanel icon={Megaphone} title="Latest Updates">
          {relatedAnnouncements.length ? (
            <div className="grid gap-3">
              {relatedAnnouncements.map((announcement) => (
                <article key={announcement.id} className="rounded-2xl border border-violet-200/45 bg-white/45 p-4 backdrop-blur-xl">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{announcement.date}</p>
                  <h3 className="mt-2 font-black text-slate-950">{announcement.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{announcement.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState text="No game-specific updates are published yet." />
          )}
        </DetailPanel>

        <DetailPanel icon={Image} title="Media">
          <div className="overflow-hidden rounded-2xl border border-violet-200/45 bg-white/45 backdrop-blur-xl">
            <img src={grimwoodArt} alt="Grimwood Blackout key art" className="h-52 w-full object-cover" />
            <p className="p-4 text-sm font-bold leading-6 text-slate-600">Current key art. More screenshots and clips can be added here as builds are ready to show.</p>
          </div>
        </DetailPanel>
      </div>
    </div>
  );
}

function PlanningDetails({ game }: { game: Game }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
      <DetailPanel icon={ListChecks} title="What We Know So Far">
        <ul className="grid gap-3">
          {game.knownDetails?.map((item) => (
            <li key={item} className="member-log-item">{item}</li>
          ))}
        </ul>
      </DetailPanel>

      <div className="grid gap-6">
        <RoadmapPanel game={game} />
        <DetailPanel icon={CalendarDays} title="Details Not Announced Yet">
          <EmptyState text="This project is still early. Gameplay systems, media, release timing, and deeper production notes will be added after the team confirms them." />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link to="/games" className="animated-cta inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-6 py-3 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85">
              Follow Development <ArrowRight className="animated-cta-icon" size={17} />
            </Link>
            <Link to="/careers" className="animated-cta inline-flex items-center justify-center rounded-full border border-violet-200/45 bg-white/55 px-6 py-3 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75">
              Apply to Help Build
            </Link>
          </div>
        </DetailPanel>
      </div>
    </div>
  );
}

function RoadmapPanel({ game }: { game: Game }) {
  return (
    <DetailPanel icon={ListChecks} title="Development Roadmap">
      <div className="grid gap-3">
        {game.roadmap?.map(([label, status]) => (
          <div key={label} className="flex flex-col justify-between gap-3 rounded-2xl border border-violet-200/45 bg-white/45 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
            <p className="font-black text-slate-950">{label}</p>
            <span className="w-fit rounded-full border border-violet-200/55 bg-violet-50/70 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-700">{status}</span>
          </div>
        ))}
      </div>
    </DetailPanel>
  );
}

function DetailPanel({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="section-panel p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/55 bg-violet-50/80 text-violet-700">
          <Icon size={20} />
        </span>
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-violet-200/70 bg-violet-50/45 p-5 font-bold leading-7 text-slate-600">
      {text}
    </div>
  );
}

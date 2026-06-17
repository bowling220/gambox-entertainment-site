import { ArrowRight, BriefcaseBusiness, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { roles } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";

type CareersSectionProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function CareersSection({ ctaHref = "/careers", ctaLabel = "Apply Now" }: CareersSectionProps) {
  const ctaClassName =
    "mt-7 inline-flex items-center gap-2 rounded-full border border-violet-200/45 bg-white/55 px-6 py-3 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75";

  return (
    <section id="careers" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Careers"
          title="Gambox is hiring."
          text="Apply for active Gambox roles and help build Roblox games, community systems, trailers, and production workflows."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <div className="glass relative overflow-hidden p-8 md:p-10">
            <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-[1.4rem] border border-amber-500/30 bg-amber-300/65 text-slate-950 shadow-lg shadow-amber-400/20">
              <Sparkles size={24} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-violet-700">Now Hiring</p>
            <h3 className="mt-5 max-w-sm text-4xl font-black leading-tight text-slate-950 md:text-5xl">Bring taste, speed, and ownership.</h3>
            <p className="mt-5 max-w-md leading-8 text-slate-600">
              Gambox is looking for reliable people who can own a lane, communicate clearly, and help push projects forward.
            </p>
            {ctaHref.startsWith("#") ? (
              <a href={ctaHref} className={ctaClassName}>
                {ctaLabel} <ArrowRight size={18} />
              </a>
            ) : (
              <Link to={ctaHref} className={ctaClassName}>
                {ctaLabel} <ArrowRight size={18} />
              </Link>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map((role, index) => (
              <div key={role} className="career-role-card rounded-[1.5rem] border border-violet-200/45 p-5 shadow-[0_14px_40px_rgba(70,48,130,0.08)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/55 bg-violet-50/80 text-violet-700">
                    <BriefcaseBusiness size={19} />
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">0{index + 1}</span>
                </div>
                <p className="text-xl font-black text-slate-950">{role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Open role. Apply with your experience, work links, and the part of production you can own.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


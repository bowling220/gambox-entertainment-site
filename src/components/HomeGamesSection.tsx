import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import gamboxMark from "../assets/gambox-brand-icon.png";
import grimwoodArt from "../assets/grimwood-blackout-key-art.png";
import { games } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";

export function HomeGamesSection() {
  return (
    <section id="games" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Games"
          title="Highlighted Gambox projects."
          text="Current Roblox experiences and studio projects moving through production."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {games.slice(0, 3).map((game, index) => (
            <motion.article
              key={game.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="highlight-game-card highlight-game-card-motion overflow-hidden rounded-[2rem] border border-violet-200/45 shadow-[0_18px_60px_rgba(70,48,130,0.1)] backdrop-blur-xl"
            >
              <div className="relative h-52 overflow-hidden">
                {game.title === "Grimwood Blackout" ? (
                  <img src={grimwoodArt} alt="" className="highlight-game-media h-full w-full object-cover" />
                ) : (
                  <div className="highlight-game-media highlight-game-fallback flex h-full w-full items-center justify-center">
                    <img src={gamboxMark} alt="" className="h-20 w-20 rounded-[2rem] shadow-2xl shadow-violet-950/20" />
                  </div>
                )}
                <div className="highlight-game-overlay absolute inset-0" />
                <span className="loading-status-badge highlight-game-status absolute left-4 top-4 rounded-full border border-amber-500/35 bg-amber-300/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950 backdrop-blur-xl">
                  <span>{game.status}</span>
                  <span className="loading-status-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-200/55 bg-violet-50/80 text-violet-700">
                    <Gamepad2 size={19} />
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">{game.title}</h3>
                </div>
                <p className="mt-4 leading-7 text-slate-600">{game.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {game.modes.slice(0, 2).map((mode) => (
                    <span key={mode} className="rounded-full border border-violet-200/45 bg-violet-50/60 px-3 py-2 text-xs font-bold text-slate-700">
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/games" className="animated-cta inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/55 bg-white/55 px-7 py-4 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75">
            More Games <ArrowRight className="animated-cta-icon" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

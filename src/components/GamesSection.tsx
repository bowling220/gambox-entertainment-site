import { motion } from "framer-motion";
import { Crosshair, Flame, Map, Trophy } from "lucide-react";
import gamboxMark from "../assets/gambox-brand-icon.png";
import grimwoodArt from "../assets/grimwood-blackout-key-art.png";
import { games } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";

export function GamesSection() {
  const [game] = games;
  const otherGames = games.slice(1);
  const featureIcons = [Flame, Crosshair, Map, Trophy];
  const detailCards =
    game.title === "Grimwood Blackout"
      ? [
          ["Day", "Search ruined buildings for red canisters while the forest is still manageable."],
          ["Night", "Spend earned upgrades and protect the base while zombie waves pressure the generator."],
          ["Blackout", "Lose the generator and the rules change: enemies enter the base and a boss threat arrives."],
        ]
      : [
          ["Concept", "The project is listed now while the real gameplay direction is still being defined."],
          ["Details", "Specific mechanics, modes, and release information will be added when they are confirmed."],
          ["Production", "The team can update this page as SNIPER! moves from planning into active development."],
        ];

  return (
    <section id="games" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Featured Game"
          title={game.title}
          text={game.description}
        />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="game-feature overflow-hidden rounded-[2rem] border border-violet-200/45 shadow-[0_18px_60px_rgba(70,48,130,0.12)]"
        >
          <div className="relative min-h-[360px]">
            {game.title === "Grimwood Blackout" ? (
              <img src={grimwoodArt} alt="Grimwood Blackout base under attack in a forest at night" className="h-full min-h-[360px] w-full object-cover" />
            ) : (
              <div className="highlight-game-fallback flex h-full min-h-[360px] w-full items-center justify-center">
                <img src={gamboxMark} alt="" className="h-24 w-24 rounded-[2rem] shadow-2xl shadow-violet-950/20" />
              </div>
            )}
            <div className="game-feature-overlay absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="loading-status-badge rounded-full border border-amber-500/35 bg-amber-300/70 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950 backdrop-blur-xl">
                  <span>{game.status}</span>
                  <span className="loading-status-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
                {game.modes.map((mode) => (
                  <span key={mode} className="rounded-full border border-violet-200/45 bg-white/45 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-xl">
                    {mode}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-black text-slate-950 md:text-5xl">{game.title}</h3>
              <p className="mt-4 max-w-2xl leading-8 text-slate-700">{game.description}</p>
            </div>
          </div>

          <div className="game-feature-grid grid gap-px bg-slate-200 md:grid-cols-4">
            {game.focus.map((item, index) => {
              const Icon = featureIcons[index];

              return (
                <div key={item} className="game-feature-tile p-6 first:rounded-bl-[2rem] last:rounded-br-[2rem]">
                  <Icon className="mb-4 text-violet-700" size={22} />
                  <p className="text-lg font-black text-slate-950">{item}</p>
                </div>
              );
            })}
          </div>
        </motion.article>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {detailCards.map(([title, text]) => (
            <div key={title} className="section-panel p-6">
              <p className="text-sm font-black uppercase tracking-[0.26em] text-violet-700">{title}</p>
              <p className="mt-4 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        {otherGames.length > 0 && (
          <div className="mt-10 border-t border-slate-200 pt-10">
            <h3 className="text-2xl font-black text-slate-950">More Gambox games</h3>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {otherGames.map((otherGame) => (
                <article key={otherGame.title} className="section-panel p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-3xl font-black text-slate-950">{otherGame.title}</h4>
                    <span className="loading-status-badge rounded-full border border-violet-200 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                      <span>{otherGame.status}</span>
                      <span className="loading-status-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl leading-8 text-slate-600">{otherGame.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {otherGame.modes.map((mode) => (
                      <span key={mode} className="rounded-full border border-violet-200/45 bg-violet-50/55 px-3 py-2 text-sm font-bold text-slate-700 backdrop-blur-xl">
                        {mode}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


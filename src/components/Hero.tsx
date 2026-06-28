import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Fuel, Gamepad2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gamboxMark from "../assets/gambox-brand-icon.png";
import grimwoodArt from "../assets/grimwood-blackout-key-art.png";
import sniperBanner from "../assets/sniper-banner.png";
import { games } from "../data/siteData";

const heroGames = games.slice(0, 3);

const getGameArt = (slug: string) => {
  if (slug === "grimwood-blackout") return grimwoodArt;
  if (slug === "sniper") return sniperBanner;
  return undefined;
};

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGame = heroGames[activeIndex] ?? heroGames[0];

  useEffect(() => {
    if (heroGames.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroGames.length);
    }, 8500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[min(980px,100svh)] overflow-hidden px-5 pt-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGame.title}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 1.35 }}
          className="absolute inset-0"
        >
          {getGameArt(activeGame.slug) ? (
            <img src={getGameArt(activeGame.slug)} alt="" className="hero-background-drift h-full w-full object-cover object-[62%_center]" />
          ) : (
            <div className="hero-fallback-bg flex h-full w-full items-center justify-center">
              <img src={gamboxMark} alt="" className="hero-background-drift h-40 w-40 rounded-[3rem] opacity-85 shadow-2xl shadow-violet-950/30" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="hero-overlay absolute inset-0" />
      <div className="hero-fade absolute inset-x-0 bottom-0 h-52" />

      <div className="relative mx-auto flex min-h-[calc(min(980px,100svh)-7rem)] max-w-7xl flex-col justify-end pb-20 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-3xl"
          >
            <p className="mb-5 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.32em] text-violet-700">
              <img src={gamboxMark} alt="" className="h-8 w-8 rounded-2xl" />
              <span>Gambox Entertainment</span>
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-7xl">{activeGame.title}</h1>
            <p className="hero-status-line mt-6 max-w-2xl text-xl font-semibold text-slate-800 md:text-2xl">
              <span>{activeGame.status}</span>
              <span className="loading-status-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 md:text-lg">{activeGame.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/games" className="animated-cta button-shimmer inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85">
                Follow Development <ArrowRight className="animated-cta-icon" size={18} />
              </Link>
              <Link to="/careers" className="animated-cta inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/45 px-7 py-4 font-black text-slate-950 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/65">
                Apply to Help Build
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
          {(activeGame.focus.length ? activeGame.focus.slice(0, 2) : activeGame.modes.slice(0, 2)).map((item, index) => {
            const Icon = index === 0 ? activeGame.title === "Grimwood Blackout" ? Fuel : Gamepad2 : Shield;

            return (
              <motion.div
                key={`${activeGame.title}-${item}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                className="hero-stat"
              >
                <Icon size={18} />
                <span>{item}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 mt-6 flex w-full items-center justify-center gap-2">
          {heroGames.map((game, index) => (
            <button
              key={game.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-violet-700" : "w-2.5 bg-violet-300/70"}`}
              aria-label={`Show ${game.title}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import gamboxMark from "../assets/gambox-brand-icon.png";

export function Footer() {
  return (
    <footer className="site-footer-bar px-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 py-9 text-sm md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Gambox Entertainment home">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2"
            style={{ borderColor: "var(--gb-ink)", background: "var(--gb-amber)", boxShadow: "3px 3px 0 var(--gb-ink)" }}
          >
            <img src={gamboxMark} alt="" className="h-6 w-6 rounded-md" />
          </span>
          <div>
            <p className="font-display font-black uppercase tracking-[0.04em] text-[#fffaf1]">Gambox Entertainment</p>
            <p className="font-mono mt-1 text-xs text-[#fffaf1]/45">&copy; 2026. All rights reserved.</p>
          </div>
        </Link>

        <div className="font-mono flex flex-wrap items-center gap-x-7 gap-y-3 text-xs uppercase tracking-[0.12em] text-[#fffaf1]/60">
          <Link to="/games" className="transition hover:text-[var(--gb-amber)]">
            Games
          </Link>
          <Link to="/careers" className="transition hover:text-[var(--gb-amber)]">
            Careers
          </Link>
          <Link to="/about" className="transition hover:text-[var(--gb-amber)]">
            About
          </Link>
          <span className="rounded-full border border-[#fffaf1]/20 px-3 py-1.5 normal-case tracking-normal text-[#fffaf1]/75">Roblox Game Studio</span>
        </div>
      </div>
    </footer>
  );
}

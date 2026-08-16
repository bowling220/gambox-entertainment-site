import { ArrowRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import gamboxMark from "../assets/gambox-brand-icon.png";

const navLinks = [
  ["Games", "/games"],
  ["Careers", "/careers"],
  ["About", "/about"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activePill, setActivePill] = useState({ left: 0, width: 0, visible: false });
  const headerRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const activeNavIndex = navLinks.findIndex(([, to]) => location.pathname === to);

  const updateActivePill = useCallback(() => {
    const container = desktopNavRef.current;
    if (!container || activeNavIndex < 0) {
      setActivePill((currentPill) => ({ ...currentPill, visible: false }));
      return;
    }

    const activeLink = container.querySelector<HTMLElement>(`[data-nav-index="${activeNavIndex}"]`);
    if (!activeLink) {
      setActivePill((currentPill) => ({ ...currentPill, visible: false }));
      return;
    }

    setActivePill({
      left: activeLink.offsetLeft,
      width: activeLink.offsetWidth,
      visible: true,
    });
  }, [activeNavIndex]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("gambox-theme");
    const nextTheme = savedTheme === "dark" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("theme-dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    updateActivePill();

    window.addEventListener("resize", updateActivePill);
    return () => window.removeEventListener("resize", updateActivePill);
  }, [location.pathname, updateActivePill]);

  function toggleTheme(toggleElement: HTMLElement) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const rect = toggleElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.style.setProperty("--theme-transition-x", `${x}px`);
    root.style.setProperty("--theme-transition-y", `${y}px`);

    function applyThemeChange() {
      document.documentElement.classList.toggle("theme-dark", nextTheme === "dark");
      window.localStorage.setItem("gambox-theme", nextTheme);
      setTheme(nextTheme);
    }

    if (!document.startViewTransition || prefersReducedMotion) {
      applyThemeChange();
      return;
    }

    document.startViewTransition(() => {
      flushSync(applyThemeChange);
    });
  }

  function handleNavPointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    event.currentTarget.style.setProperty("--magnet-x", `${x * 0.18}px`);
    event.currentTarget.style.setProperty("--magnet-y", `${y * 0.22}px`);
  }

  function handleNavPointerLeave(event: ReactPointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty("--magnet-x", "0px");
    event.currentTarget.style.setProperty("--magnet-y", "0px");
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (open && headerRef.current && !headerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="site-navbar mx-auto flex max-w-7xl items-center justify-between px-5 py-3 text-slate-950 backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-3" aria-label="Gambox Entertainment home">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2"
            style={{ borderColor: "var(--gb-ink)", background: "var(--gb-amber)", boxShadow: "3px 3px 0 var(--gb-ink)", transform: "rotate(-4deg)" }}
          >
            <img src={gamboxMark} alt="" className="h-6 w-6 rounded-md" />
          </span>
          <p className="font-display hidden text-sm font-black uppercase tracking-[0.04em] text-slate-950 sm:block">
            Gambox<span className="text-violet-700">.</span>
          </p>
        </Link>

        <div ref={desktopNavRef} className="site-navbar-links relative hidden items-center gap-2 p-1 backdrop-blur-xl md:flex">
          <span
            className="site-navbar-active-pill"
            style={{
              opacity: activePill.visible ? 1 : 0,
              transform: `translateX(${activePill.left}px)`,
              width: `${activePill.width}px`,
            }}
          />
          {navLinks.map(([label, to], index) => (
            <NavLink
              key={label}
              to={to}
              data-nav-index={index}
              onPointerMove={handleNavPointerMove}
              onPointerLeave={handleNavPointerLeave}
              className={({ isActive }) =>
                `site-navbar-link font-mono rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition hover:text-violet-700 ${
                  isActive ? "site-navbar-link-active text-violet-700" : "text-slate-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/careers" className="button-primary hidden lg:inline-flex">
            We&apos;re Hiring <ArrowRight size={14} />
          </Link>
          <ThemeSwitch theme={theme} onClick={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitch className="theme-switch--small" theme={theme} onClick={toggleTheme} />

          <button
            className="site-navbar-menu rounded-full p-2 text-slate-950 transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="site-navbar-mobile mx-auto mt-3 max-w-7xl px-4 py-4 text-slate-950 backdrop-blur-2xl md:hidden">
          {navLinks.map(([label, to]) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-mono block rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] hover:bg-violet-50/70 ${
                  isActive ? "border border-violet-200/55 bg-violet-100/60 text-violet-700" : "text-slate-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/careers" onClick={() => setOpen(false)} className="button-primary mt-3 w-full justify-center">
            We&apos;re Hiring <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </header>
  );
}

function ThemeSwitch({ className = "", theme, onClick }: { className?: string; theme: "light" | "dark"; onClick: (toggleElement: HTMLElement) => void }) {
  return (
    <button
      className={`theme-switch ${className}`}
      data-theme={theme}
      onClick={(event) => onClick(event.currentTarget)}
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-switch__cloud" />
      <span className="theme-switch__star" />
      <span className="theme-switch__sea" />
      <span className="theme-switch__mountains" />
    </button>
  );
}

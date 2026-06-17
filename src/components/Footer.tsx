import gamboxMark from "../assets/gambox-brand-icon.png";

export function Footer() {
  return (
    <footer className="px-5 pb-8 pt-4">
      <div className="glass mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-[2rem] px-5 py-5 text-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src={gamboxMark} alt="" className="h-10 w-10 rounded-[1.25rem] shadow-lg shadow-violet-950/10" />
          <div>
            <p className="font-black text-slate-950">Gambox Entertainment</p>
            <p className="mt-1 font-semibold text-slate-500">&copy; 2026. All rights reserved.</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-violet-200/55 bg-white/55 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-700 backdrop-blur-xl">
          Roblox Game Studio
        </span>
      </div>
    </footer>
  );
}

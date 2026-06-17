import gamboxMark from "../assets/gambox-brand-icon.png";

type ComingSoonProps = {
  title?: string;
};

export function ComingSoon({ title = "Coming Soon" }: ComingSoonProps) {
  return (
    <section className="page-section flex items-center px-5">
      <div className="mx-auto flex max-w-3xl flex-col items-start">
        <img src={gamboxMark} alt="" className="h-16 w-16 rounded-[1.75rem] shadow-xl shadow-orange-500/20" />
        <p className="mt-8 text-sm font-black uppercase tracking-[0.32em] text-violet-700">Gambox Entertainment</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          This page is still being prepared. More details will be added soon.
        </p>
      </div>
    </section>
  );
}

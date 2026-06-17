import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="About"
          title="A Roblox-focused studio with serious production habits."
          text="Gambox Entertainment builds survival-focused Roblox experiences with clear gameplay loops and a strong player return path."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ["Mission", "Create Roblox games that feel polished, replayable, and worth players' time."],
            ["Culture", "Small-team speed, clear communication, practical planning, and a focus on finishing playable builds."],
            ["What We Build", "Survival systems, progression loops, class roles, reward tracks, events, and community-first updates."],
          ].map(([title, text]) => (
            <div key={title} className="section-panel p-7">
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-8 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

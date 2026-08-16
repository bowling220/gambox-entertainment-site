import { CareersSection } from "../components/CareersSection";
import { Hero } from "../components/Hero";
import { HomeGamesSection } from "../components/HomeGamesSection";
import { Marquee } from "../components/Marquee";

export function IndexPage() {
  return (
    <>
      <Hero />
      <Marquee />
      <HomeGamesSection />
      <CareersSection />
    </>
  );
}

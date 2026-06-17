import { CareersSection } from "../components/CareersSection";
import { Hero } from "../components/Hero";
import { HomeGamesSection } from "../components/HomeGamesSection";

export function IndexPage() {
  return (
    <>
      <Hero />
      <HomeGamesSection />
      <CareersSection />
    </>
  );
}

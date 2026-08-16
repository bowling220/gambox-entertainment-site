import { games } from "../data/siteData";

const baseItems = [...games.map((game) => game.title), "Now Hiring", "Roblox Game Studio", "Gambox Entertainment"];
const trackItems = [...baseItems, ...baseItems];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {trackItems.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item} <i>★</i>
          </span>
        ))}
      </div>
    </div>
  );
}

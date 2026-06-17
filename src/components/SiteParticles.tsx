import type { CSSProperties } from "react";
import gamboxMark from "../assets/gambox-brand-icon.png";

const particlesPerBand = 22;
const particleBands = 5;
const siteParticles = Array.from({ length: particlesPerBand * particleBands }, (_, index) => ({
  band: Math.floor(index / particlesPerBand),
  variant: (index % particlesPerBand) + 1,
}));

export function SiteParticles() {
  return (
    <div className="site-particle-field" aria-hidden="true">
      {siteParticles.map((particle, index) => (
        <span
          key={index}
          className={`site-logo-particle site-logo-particle--${particle.variant}`}
          style={{ "--particle-band": particle.band } as CSSProperties}
        >
          <img src={gamboxMark} alt="" />
        </span>
      ))}
    </div>
  );
}

import frame01 from "../assets/sniper-animation/frame-01.png";
import frame02 from "../assets/sniper-animation/frame-02.png";
import frame03 from "../assets/sniper-animation/frame-03.png";
import frame04 from "../assets/sniper-animation/frame-04.png";
import frame05 from "../assets/sniper-animation/frame-05.png";
import frame06 from "../assets/sniper-animation/frame-06.png";
import frame07 from "../assets/sniper-animation/frame-07.png";
import frame08 from "../assets/sniper-animation/frame-08.png";

const sniperFrames = [frame01, frame02, frame03, frame04, frame05, frame06, frame07, frame08];

export function SniperAnimation({ alt = "", className = "" }: { alt?: string; className?: string }) {
  return (
    <div className={`sniper-animation ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      {sniperFrames.map((frame, index) => (
        <img
          key={frame}
          src={frame}
          alt=""
          aria-hidden="true"
          className="sniper-animation-frame"
          // Keep this delay in sync with the CSS cycle length so the sequence ends cleanly on frame 8.
          style={{ animationDelay: `${index * 0.7}s` }}
        />
      ))}
    </div>
  );
}

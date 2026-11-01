import { useId } from "react";

export function InkLandscape() {
  const id = useId().replaceAll(":", "");
  const sky = `ink-sky-${id}`;
  const moon = `ink-moon-${id}`;

  return (
    <svg className="samurai-image ink-landscape" viewBox="0 0 720 760" fill="none" preserveAspectRatio="xMidYMax slice" role="img" aria-label="A crimson moon above layered mountains and a silhouetted pine tree" focusable="false">
      <defs>
        <linearGradient id={sky} x2="0" y2="1"><stop stopColor="var(--landscape-sky-top)" /><stop offset="1" stopColor="var(--landscape-sky-bottom)" /></linearGradient>
        <linearGradient id={moon} x2="0" y2="1"><stop stopColor="#f0184d" /><stop offset="1" stopColor="#bf1037" /></linearGradient>
      </defs>
      <path fill={`url(#${sky})`} d="M0 0h720v760H0z" />
      <g className="landscape-stars" fill="var(--landscape-stars)"><circle cx="491" cy="145" r="1.5" /><circle cx="420" cy="205" r="1" /><circle cx="605" cy="253" r="2" /><circle cx="212" cy="355" r="1.5" /><circle cx="320" cy="275" r="1" /><circle cx="565" cy="381" r="1" /></g>
      <g className="landscape-moon">
        <circle className="moon-halo" cx="417" cy="411" r="162" fill="#ea1646" />
        <circle className="moon-orbit" cx="417" cy="411" r="153" stroke="#ea1646" strokeWidth="1" strokeDasharray="1 15" />
        <circle cx="417" cy="411" r="144" fill={`url(#${moon})`} />
        <g fill="#981134" opacity=".22"><circle cx="451" cy="335" r="18" /><circle cx="369" cy="431" r="31" /><circle cx="470" cy="456" r="13" /><circle cx="397" cy="365" r="8" /></g>
      </g>
      <path d="M0 509l93-44 72 27 100-53 110 79 111-65 110 35 124-72v344H0z" fill="var(--landscape-mountain-far)" />
      <path d="M0 575l125-51 122 45 101-64 130 53 133-51 109 28v225H0z" fill="var(--landscape-mountain-mid)" />
      <path d="M0 629c120-99 205-45 307-62 134-23 226-32 413 72v121H0z" fill="var(--landscape-mountain-near)" />
      <path d="M0 701c161-83 298-6 413-41 120-35 213 9 307 20v80H0z" fill="var(--landscape-tree)" />
      <g stroke="var(--landscape-tree)" strokeLinecap="round"><path d="M170 643c-7-66-12-139-2-227m-2 94-49-45m49 80 54-61m-52 19 35-55m-39 96-55-18" strokeWidth="8" /><path d="m120 467-30-21m31 22-7-29m104 49 25-22m-41-18 23-22m-60 31-27-27m-28 94-31-6" strokeWidth="3" /></g>
      <g fill="var(--landscape-tree)"><path d="m65 450 52-29 50 31zm32 21 48-27 44 26zm67-31 47-26 42 26zm24 35 49-25 43 25zM62 526l42-22 45 24z" /><path d="m131 425 33-25 32 26z" /></g>
      <path d="M0 738h720" stroke="#ea1646" strokeOpacity=".15" />
    </svg>
  );
}

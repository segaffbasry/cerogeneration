import { LETTERS, LOGO_H, LOGO_W, RING } from "@/lib/logo";

/* Cero's real vector logo (lib/logo.ts, from their Code of Conduct PDF). The letters take currentColor (Navy on
   light grounds, white on dark, as the live POS/NEG PNGs do); the ring is always Sun. Each part carries data-part
   so the preloader can build it piece by piece. */
export function Logo({ title = "Cero Generation" }: { title?: string }) {
  return <svg className="logo" viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} focusable="false">
    {(Object.keys(LETTERS) as (keyof typeof LETTERS)[]).map((k) => <path key={k} data-part={k} d={LETTERS[k]} fill="currentColor" />)}
    <g className="logo-ring">
      {(Object.keys(RING) as (keyof typeof RING)[]).map((k) => <path key={k} data-part={k} d={RING[k]} fill="var(--sun)" />)}
    </g>
  </svg>;
}

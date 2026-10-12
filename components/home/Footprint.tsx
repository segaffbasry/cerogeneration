"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button, linkProps } from "@/components/ui";
import { bumbleBee, footprint, projects, type Project } from "@/lib/content";
import { MAP_H, MAP_W, OFFICE_POINTS, SITE_POINTS } from "@/lib/europe-map";

type Filter = "all" | "solar" | "bess" | "offices";
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "solar", label: "Solar PV" },
  { id: "bess", label: "Battery storage" },
  { id: "offices", label: "Offices" },
];

const sites: Project[] = [...projects, bumbleBee];
const point = (id: string) => SITE_POINTS.find((p) => p.id === id)!;
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const capacity = (p: Project) => [`${fmt(p.solar)}MWp solar`, p.bess ? `${fmt(p.bess)}MW BESS` : ""].filter(Boolean).join(" + ");
const pct = (x: number, total: number) => `${(x / total) * 100}%`;

/* Across Europe: the client's signature data visual, on an inset Ink panel (a contained dark card like the
   contact panel, not a section fill, so nothing recolours as you scroll). Review 1 found "too much text here":
   the site list is gone. What remains is the heading, two totals, the filter chips and the map itself.
   The six sites are real links (the five project pages, and the Bumble Bee release) placed over the map;
   hovering or focusing one opens its card with the project's photograph, place and capacity. Offices are labels.
   Dots and pins come from scripts/map.mjs (Natural Earth, conic conformal). */
export function Footprint() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<string | null>(null);

  const shown = useMemo(() => sites.filter((s) => filter === "all" || (filter === "solar" && s.solar) || (filter === "bess" && s.bess)), [filter]);
  const showOffices = filter === "all" || filter === "offices";
  const showSites = filter !== "offices";
  const solar = sites.reduce((n, s) => n + s.solar, 0);
  const bess = sites.reduce((n, s) => n + (s.bess ?? 0), 0);
  const active = hover ? sites.find((s) => s.id === hover) : undefined;

  return <section className="section footprint" id="projects" tabIndex={-1} aria-labelledby="footprint-title">
    <div className="wrap">
      <div className="fp-panel" data-tone="dark">
        <div className="fp-text">
          <h2 className="h3 fp-title" id="footprint-title" data-reveal="heading">{footprint.title}</h2>
          <div className="fp-totals">
            <p data-reveal="card"><span className="fp-total"><span data-count={solar}>{solar}</span>MWp</span><span className="fp-unit">solar PV</span></p>
            <p data-reveal="card"><span className="fp-total"><span data-count={fmt(bess)}>{fmt(bess)}</span>MW</span><span className="fp-unit">battery storage</span></p>
          </div>
          <div className="fp-chips" role="group" aria-label="Show on the map" data-reveal="label">
            {filters.map((f) => <button key={f.id} className="chip" aria-pressed={filter === f.id} onClick={() => { setFilter(f.id); setHover(null); }}>{f.label}</button>)}
          </div>
          <Button href={footprint.cta.href} tone="sun">{footprint.cta.label}</Button>
        </div>

        <div className="fp-map" data-reveal="card">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
            <image href="/media/europe-dots.svg" width={MAP_W} height={MAP_H} className="fp-dots" />
            {showSites && shown.map((s) => { const p = point(s.id); return <circle key={s.id} className={`fp-halo${s.status !== "Operational" ? " is-next" : ""}${hover === s.id ? " is-on" : ""}`} cx={p.x} cy={p.y} r={Math.sqrt(s.solar + (s.bess ?? 0)) * 2.6} />; })}
            {showOffices && OFFICE_POINTS.map((o) => <g key={o.id} className="fp-office" transform={`translate(${o.x} ${o.y})`}>
              <rect x={-4.5} y={-4.5} width={9} height={9} rx={2} />
              <text y={-12} textAnchor="middle">{o.name}</text>
            </g>)}
          </svg>
          <ul className="fp-pins" aria-label="Projects on the map">
            {showSites && shown.map((s) => { const p = point(s.id); return <li key={s.id} style={{ left: pct(p.x, MAP_W), top: pct(p.y, MAP_H) }}>
              <a href={s.href} {...linkProps(s.href)} className={`fp-pin${s.status !== "Operational" ? " is-next" : ""}${hover === s.id ? " is-on" : ""}`}
                aria-label={`${s.name}, ${s.place}: ${capacity(s)}, ${s.status.toLowerCase()}`}
                onPointerEnter={() => setHover(s.id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(s.id)} onBlur={() => setHover(null)} />
            </li>; })}
          </ul>
          {active && (() => { const p = point(active.id); return <div className={`fp-card${p.x > MAP_W * .62 ? " is-left" : ""}`} style={{ left: pct(p.x, MAP_W), top: pct(p.y, MAP_H) }} aria-hidden="true">
            <div className="fp-card-img"><Image src={active.img} alt="" fill sizes="240px" /></div>
            <div className="fp-card-body">
              <p className="fp-card-status">{active.status}</p>
              <p className="fp-card-name">{active.name}</p>
              <p className="fp-card-place">{active.place}</p>
              <p className="fp-card-cap">{capacity(active)}</p>
            </div>
          </div>; })()}
          <p className="fp-legend"><span className="fp-key fp-key-op" />Operational <span className="fp-key fp-key-next" />Financial close <span className="fp-key fp-key-office" />Office</p>
        </div>
      </div>
    </div>
  </section>;
}

"use client";

import { useMemo, useState } from "react";
import { Button, TwoTone, linkProps } from "@/components/ui";
import { bumbleBee, footprint, projects, type Project } from "@/lib/content";
import { MAP_H, MAP_W, OFFICE_POINTS, SITE_POINTS } from "@/lib/europe-map";
import { offices } from "@/lib/site";

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

/* Across Europe: the client's signature data visual (house rule: build one from their real data). After Virya's
   "Worldwide impact" dot map with its filter chips, reworked for Cero: the five case studies, Bumble Bee (financial
   close, Feb 2026) and the six offices on a dot-matrix Europe (scripts/map.mjs). Text sits beside the map, never
   under a full-width map (INTEC feedback). Hover or focus a row or a pin to light the site and open its card;
   the chips filter the map and the list. The two totals count up from the same data. */
export function Footprint() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<string | null>(null);

  const shown = useMemo(() => sites.filter((s) => filter === "all" || (filter === "solar" && s.solar) || (filter === "bess" && s.bess)), [filter]);
  const showOffices = filter === "all" || filter === "offices";
  const solar = sites.reduce((n, s) => n + s.solar, 0);
  const bess = sites.reduce((n, s) => n + (s.bess ?? 0), 0);
  const active = hover ? sites.find((s) => s.id === hover) : undefined;

  return <section className="section footprint" id="projects" tabIndex={-1} aria-labelledby="footprint-title">
    <div className="wrap fp-grid">
      <div className="fp-text">
        <h2 className="h2 fp-title" id="footprint-title" data-reveal="heading"><TwoTone parts={footprint.title} /></h2>
        <div className="fp-totals">
          <p data-reveal="card"><span className="fp-total"><span data-count={solar}>{solar}</span>MWp</span><span className="small">of solar PV across the six sites shown</span></p>
          <p data-reveal="card"><span className="fp-total"><span data-count={fmt(bess)}>{fmt(bess)}</span>MW</span><span className="small">of battery storage alongside</span></p>
        </div>
        <div className="fp-chips" role="group" aria-label="Show on the map" data-reveal="label">
          {filters.map((f) => <button key={f.id} className="chip" aria-pressed={filter === f.id} onClick={() => { setFilter(f.id); setHover(null); }}>{f.label}</button>)}
        </div>
        {filter !== "offices"
          ? <ul className="fp-list" data-reveal="card">{shown.map((s) => <li key={s.id}>
              <a href={s.href} className={`fp-row${hover === s.id ? " is-on" : ""}`} {...linkProps(s.href)}
                onPointerEnter={() => setHover(s.id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(s.id)} onBlur={() => setHover(null)}>
                <span className="fp-name">{s.name}</span><span className="fp-place">{s.place}</span><span className="fp-cap">{capacity(s)}</span>
              </a>
            </li>)}</ul>
          : <ul className="fp-list fp-offices" data-reveal="card">{offices.map((o) => <li key={o.city} className="fp-row"><span className="fp-name">{o.city}</span><span className="fp-place">{o.lines.join(", ")}</span></li>)}</ul>}
        <Button href={footprint.cta.href} tone="navy">{footprint.cta.label}</Button>
      </div>

      <div className="fp-map" data-reveal="card">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="Map of Europe showing Cero Generation's projects in England, Italy and Greece, and its offices in London, Madrid, Hamburg, Warsaw, Milan and Lyon">
          <image href="/media/europe-dots.svg" width={MAP_W} height={MAP_H} className="fp-dots" />
          {showOffices && OFFICE_POINTS.map((o) => <g key={o.id} className="fp-office" transform={`translate(${o.x} ${o.y})`}>
            <rect x={-5} y={-5} width={10} height={10} rx={2} />
            <text y={-12} textAnchor="middle">{o.name}</text>
          </g>)}
          {filter !== "offices" && shown.map((s) => { const p = point(s.id); const on = hover === s.id; return <g key={s.id} className={`fp-pin${on ? " is-on" : ""}${s.status !== "Operational" ? " is-next" : ""}`} transform={`translate(${p.x} ${p.y})`}
            onPointerEnter={() => setHover(s.id)} onPointerLeave={() => setHover(null)}>
            <circle className="fp-halo" r={Math.sqrt(s.solar + (s.bess ?? 0)) * 2.4} />
            <circle className="fp-core" r={7} />
          </g>; })}
        </svg>
        {active && (() => { const p = point(active.id); return <div className="fp-card" style={{ left: `${(p.x / MAP_W) * 100}%`, top: `${(p.y / MAP_H) * 100}%` }} aria-hidden="true">
          <p className="fp-card-status">{active.status}</p>
          <p className="fp-card-name">{active.name}</p>
          <p className="fp-card-place">{active.place}</p>
          <p className="fp-card-cap">{capacity(active)}</p>
        </div>; })()}
        <p className="fp-legend small"><span className="fp-key fp-key-op" />Operational <span className="fp-key fp-key-next" />Financial close <span className="fp-key fp-key-office" />Office</p>
      </div>
    </div>
  </section>;
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, linkProps } from "@/components/ui";
import { partners, projects } from "@/lib/content";

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/* Case studies: the live homepage's five, in its order, with each project page's own facts and lead photograph.
   After Virya's "Our projects" slider: a horizontal track of tall photo cards that snaps, scrolls with a trackpad or
   a drag on touch, and steps with the two round buttons (disabled at either end). Review 1 asked for one text colour
   in the boxes, so every card is the photograph with white type on an Ink shade: place, name and capacity at rest,
   the project's one-line summary sliding up on hover or focus (always shown on touch screens).
   Under it, the three household names Cero has industry-first PPAs with. */
export function CaseStudies() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current; if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);
  useEffect(() => {
    const el = track.current; if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => { el.removeEventListener("scroll", measure); window.removeEventListener("resize", measure); };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector("li"); if (!card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return <section className="section section-mist cases" id="case-studies" tabIndex={-1} aria-labelledby="cases-title">
    <div className="wrap">
      <div className="section-head">
        <h2 className="h2" id="cases-title" data-reveal="heading">Case studies</h2>
        <div className="cases-nav" data-reveal="label">
          <button className="round-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous case study"><Arrow className="arrow arrow-back" /></button>
          <button className="round-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next case study"><Arrow /></button>
        </div>
      </div>
    </div>
    <ul className="cases-track" ref={track} aria-label="Case studies">
      {projects.map((p) => <li key={p.id} className="case" data-reveal="card">
        <a href={p.href} {...linkProps(p.href)} className="case-link" data-tone="dark">
          <Image src={p.img} alt={`${p.name} solar project, ${p.place}`} fill sizes="(max-width: 700px) 80vw, 420px" />
          <span className="case-cap">{fmt(p.solar)}MWp{p.bess ? ` + ${fmt(p.bess)}MW BESS` : ""}</span>
          <span className="case-body">
            <span className="case-place">{p.place}</span>
            <span className="case-name">{p.name}</span>
            <span className="case-summary">{p.summary}</span>
            <span className="case-more">View project <Arrow /></span>
          </span>
        </a>
      </li>)}
    </ul>
    <div className="wrap partners">
      <p className="partners-text" data-reveal="text">{partners.text}</p>
      <ul className="partners-logos" aria-label="Power Purchase Agreement partners">
        {partners.logos.map((l) => <li key={l.name} data-reveal="label"><span className="partner" role="img" aria-label={l.name} style={{ ["--logo" as string]: `url(${l.src})` }} /></li>)}
      </ul>
    </div>
  </section>;
}

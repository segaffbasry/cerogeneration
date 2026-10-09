"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, linkProps } from "@/components/ui";
import { partners, projects } from "@/lib/content";

/* Case studies: the live homepage's five, in its order, with each project page's own facts. After Virya's
   "Our projects" slider: a horizontal track of rounded cards that snaps, scrolls with a trackpad or a drag on touch,
   and steps with the two round buttons (disabled at either end). Each card's photo eases toward full size as it
   becomes the first visible card. Under it, the three household names Cero has industry-first PPAs with. */
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
        <h2 className="h2" id="cases-title" data-reveal="heading">Case <span className="tone">studies</span></h2>
        <div className="cases-nav" data-reveal="label">
          <button className="round-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous case study"><Arrow className="arrow arrow-back" /></button>
          <button className="round-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next case study"><Arrow /></button>
        </div>
      </div>
    </div>
    <ul className="cases-track" ref={track} aria-label="Case studies" data-lenis-prevent-wheel-horizontal="">
      {projects.map((p) => <li key={p.id} className="case" data-reveal="card">
        <a href={p.href} {...linkProps(p.href)} className="case-link">
          <div className="case-media media">
            <Image src={p.img} alt={`${p.name} solar project, ${p.place}`} width={1600} height={667} sizes="(max-width: 700px) 86vw, 640px" />
            <span className="case-chip">{p.place}</span>
          </div>
          <div className="case-body">
            <div className="case-top">
              <h3 className="h3">{p.name}</h3>
              <p className="case-cap">{p.solar}<small>MWp</small>{p.bess ? <> + {p.bess}<small>MW BESS</small></> : null}</p>
            </div>
            <p className="case-summary">{p.summary} {p.detail}</p>
            <span className="case-more">View project <Arrow /></span>
          </div>
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

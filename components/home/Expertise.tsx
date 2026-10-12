"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { expertise } from "@/lib/content";

/* Our expertise (/what-we-do): Identify, Develop, Construct, Operate, each with its own photograph. Review 1 asked
   for the page after the hero to stand out more, so the four stages are now four photo panels side by side
   (an expanding-panel gallery, a common Awwwards pattern): the open one widens to show its text, the others narrow
   to a strip with the stage's name. Hover, focus or click opens a panel (each name is a button with aria-expanded);
   arrow keys also move between them. On phones the panels stack and the open one grows taller. No pin, no scroll-jacking. */
export function Expertise() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  // Each panel's text height, so the open panel's name can sit just above its text (--body-h).
  useEffect(() => {
    const el = root.current; if (!el) return;
    const measure = () => el.querySelectorAll<HTMLElement>(".exp-panel").forEach((panel) => {
      const body = panel.querySelector<HTMLElement>(".exp-body"); if (body) panel.style.setProperty("--body-h", `${body.offsetHeight}px`);
    });
    const ro = new ResizeObserver(measure);
    el.querySelectorAll(".exp-body").forEach((b) => ro.observe(b));
    measure();
    return () => ro.disconnect();
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = expertise.steps.length;
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setActive(next); tabs.current[next]?.focus();
  };

  return <section className="section expertise" id="expertise" tabIndex={-1} aria-labelledby="expertise-title">
    <div className="wrap">
      <div className="section-head">
        <div>
          <h2 className="h2" id="expertise-title" data-reveal="heading">{expertise.title}</h2>
          <p className="lede" data-reveal="text">{expertise.lede}</p>
        </div>
        <Button href={expertise.cta.href} tone="ink">{expertise.cta.label}</Button>
      </div>
      <div className="exp-panels" ref={root}>
        {expertise.steps.map((s, i) => <div key={s.name} className={`exp-panel${i === active ? " is-active" : ""}`} data-reveal="card" onPointerEnter={() => setActive(i)} data-tone="dark">
          <Image src={s.img} alt="" fill sizes="(max-width: 860px) 100vw, 60vw" />
          <button ref={(b) => { tabs.current[i] = b; }} id={`exp-tab-${i}`} aria-expanded={i === active} aria-controls={`exp-panel-${i}`}
            className="exp-tab" onClick={() => setActive(i)} onFocus={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}>
            <span className="exp-name">{s.name}</span>
          </button>
          <div className="exp-body" id={`exp-panel-${i}`} aria-hidden={i !== active}>
            <p>{s.body}</p>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}

"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, TwoTone, reducedMotion } from "@/components/ui";
import { expertise } from "@/lib/content";

const ADVANCE = 6; // seconds per stage while the section is on screen

/* Our expertise (/what-we-do): Identify, Develop, Construct, Operate. After Virya's "Our expertise" items slider,
   reworked as tabs so nothing scroll-jacks (house rule): the four stages stack on the left, the open one shows its
   text and a Sun progress line; its photograph opens on the right with a clip wipe. It advances by itself every
   6s while on screen, and stops for good once the visitor picks a stage, hovers or focuses it. Arrow keys move
   between tabs (WAI-ARIA tabs pattern). */
export function Expertise() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef<HTMLElement>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-advance, driven by the progress line's own tween so the two can never drift apart.
  useEffect(() => {
    const el = root.current; if (!el || !auto || reducedMotion()) return;
    const line = el.querySelector(`[data-step="${active}"] .exp-progress i`);
    progress.current = gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: ADVANCE, ease: "none", paused: true, onComplete: () => setActive((a) => (a + 1) % expertise.steps.length) });
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) progress.current?.play(); else progress.current?.pause(); }, { threshold: .35 });
    io.observe(el);
    return () => { io.disconnect(); progress.current?.kill(); if (line) gsap.set(line, { scaleX: 0 }); };
  }, [active, auto]);

  // The incoming photograph opens from the bottom edge over the previous one.
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const img = el.querySelector(`.exp-img[data-img="${active}"]`);
    gsap.fromTo(img, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "cero" });
    gsap.fromTo(img?.querySelector("img") ?? null, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "cero" });
  }, [active]);

  const choose = (i: number) => { setAuto(false); setActive(i); };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = expertise.steps.length;
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); choose(next); tabs.current[next]?.focus();
  };

  return <section className="section section-mist expertise" id="expertise" ref={root} tabIndex={-1} aria-labelledby="expertise-title">
    <div className="wrap">
      <div className="section-head">
        <div>
          <h2 className="h2" id="expertise-title" data-reveal="heading"><TwoTone parts={expertise.title} /></h2>
          <p className="lede" data-reveal="text">{expertise.lede}</p>
        </div>
        <Button href={expertise.cta.href} tone="ink">{expertise.cta.label}</Button>
      </div>
      <div className="exp-grid" onPointerEnter={() => setAuto(false)}>
        <div className="exp-tabs" role="tablist" aria-label="Our expertise" aria-orientation="vertical">
          {expertise.steps.map((s, i) => <div key={s.name} className={`exp-step${i === active ? " is-active" : ""}`} data-step={i} data-reveal="card">
            <button ref={(b) => { tabs.current[i] = b; }} role="tab" id={`exp-tab-${i}`} aria-selected={i === active} aria-controls={`exp-panel-${i}`} tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)} onKeyDown={(e) => onKey(e, i)} onFocus={() => setAuto(false)}>
              <span className="exp-name">{s.name}</span>
            </button>
            <span className="exp-progress" aria-hidden="true"><i /></span>
            <div className="exp-body" role="tabpanel" id={`exp-panel-${i}`} aria-labelledby={`exp-tab-${i}`} hidden={i !== active}>
              <p>{s.body}</p>
            </div>
          </div>)}
        </div>
        <div className="exp-media media" data-reveal="image">
          {expertise.steps.map((s, i) => <div key={s.img} className={`exp-img${i === active ? " is-active" : ""}`} data-img={i} aria-hidden={i !== active}>
            <Image src={s.img} alt="" fill sizes="(max-width: 860px) 100vw, 55vw" />
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}

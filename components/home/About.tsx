"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { about } from "@/lib/content";

/* About: the homepage's second and third paragraphs, its About Us reel and four figures. Restaged for review 1
   ("not sure on all this white space"): two full columns, then a wide film band, no empty cells.
   - Left: the statement brightens word by word as it crosses the screen (faers.tech's statement block), the MAM
     line, "What we do", then the four figures in a row of hairline columns (no boxes, one colour).
   - Right: a Pontinia photograph seen through Cero's own ring (the cover graphic of their Code of Conduct, used as
     a CSS mask). The idea is Sunsure Energy's (Awwwards nominee), which crops its photos into its logo shape.
     The ring turns a few degrees as the section scrolls past while the photo inside stays upright.
   - Below: the reel as a 21:9 band. It keeps its own sound, so it starts only on "Watch the Cero film" and pauses
     whenever it leaves the screen; its poster is a local frame with the reel's own caption. */
export function About() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = film.current; if (!video) return;
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); }, { threshold: .1 });
    io.observe(video);
    const sync = () => setPlaying(!video.paused);
    video.addEventListener("play", sync); video.addEventListener("pause", sync);
    return () => { io.disconnect(); video.removeEventListener("play", sync); video.removeEventListener("pause", sync); };
  }, []);

  // The ring turns 24° across the section's pass; the photo counter-turns so it never tilts.
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const ring = el.querySelector(".ring-mask"), photo = el.querySelector(".ring-mask img");
    const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: true };
    const a = gsap.fromTo(ring, { rotation: -12 }, { rotation: 12, ease: "none", scrollTrigger: st });
    const b = gsap.fromTo(photo, { rotation: 12, scale: 1.25 }, { rotation: -12, scale: 1.25, ease: "none", scrollTrigger: { ...st } });
    return () => { a.scrollTrigger?.kill(); a.kill(); b.scrollTrigger?.kill(); b.kill(); };
  }, []);

  const play = () => { const v = film.current; if (!v) return; v.controls = true; void v.play(); };

  return <section className="section about" id="about" ref={root} tabIndex={-1} aria-label="About Cero Generation">
    <div className="wrap">
      <div className="about-top">
        <div className="about-copy">
          <p className="about-statement" data-reveal="lit">{about.statement}</p>
          <p className="about-owner" data-reveal="text">{about.owner}</p>
          <Button href={about.cta.href} tone="navy">{about.cta.label}</Button>
          <ul className="about-figures">
            {about.figures.map((f) => <li key={f.label} data-reveal="card">
              <span className="about-value" data-count={f.value}>{f.value}</span>
              <span className="about-label">{f.label}</span>
            </li>)}
          </ul>
        </div>
        <div className="about-ring" aria-hidden="true" data-reveal="card">
          <div className="ring-mask"><Image src={about.ringPhoto} alt="" fill sizes="(max-width: 960px) 80vw, 560px" /></div>
        </div>
      </div>
      <div className={`about-reel media${playing ? " is-playing" : ""}`} data-reveal="image">
        <video ref={film} src={about.reel.src} poster={about.reel.poster} preload="none" playsInline controlsList="nodownload" aria-label="Cero Generation About Us reel" />
        {!playing && <button className="reel-play" onClick={play}>
          <span className="reel-play-disc" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M3.5 1.5v9l7-4.5z" fill="currentColor" /></svg></span>
          <span>{about.reel.label}</span>
        </button>}
      </div>
    </div>
  </section>;
}

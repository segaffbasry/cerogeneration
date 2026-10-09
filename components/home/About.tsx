"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { about } from "@/lib/content";

/* About: the homepage's second and third paragraphs and its About Us reel, restaged.
   The statement brightens word by word as it crosses the screen (faers.tech's "What is FAERS" block, data-reveal
   "lit"); under it, the reel in a wide card beside Virya's "in a few numbers" panel (a Navy card and four figures).
   The reel keeps its own sound, so it starts only when the visitor presses play; it pauses when it leaves the
   screen. Its poster is a local frame from the film. */
export function About() {
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

  const play = () => { const v = film.current; if (!v) return; v.controls = true; void v.play(); };

  return <section className="section about" id="about" tabIndex={-1} aria-label="About Cero Generation">
    <div className="wrap">
      <p className="about-statement" data-reveal="lit">{about.statement}</p>
      <div className="about-grid">
        <div className={`about-reel media${playing ? " is-playing" : ""}`} data-reveal="image">
          <video ref={film} src={about.reel.src} poster={about.reel.poster} preload="none" playsInline controlsList="nodownload" aria-label="Cero Generation About Us reel" />
          {!playing && <button className="reel-play" onClick={play}>
            <span className="reel-play-disc" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M3.5 1.5v9l7-4.5z" fill="currentColor" /></svg></span>
            <span>{about.reel.label}</span>
          </button>}
        </div>
        <div className="about-numbers">
          <div className="about-card" data-tone="dark" data-reveal="card">
            <h2 className="h3">Cero in a few <span className="tone">numbers</span></h2>
            <p>{about.owner}</p>
            <Button href={about.cta.href} tone="light" reveal={false}>{about.cta.label}</Button>
          </div>
          {about.figures.map((f) => <div key={f.label} className="about-figure" data-reveal="card">
            <p className="about-value" data-count={f.value}>{f.value}</p>
            <p className="about-label">{f.label}</p>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}

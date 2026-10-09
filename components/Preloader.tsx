"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The opening moment: Cero signing its name. Built from the logo's own vector parts (lib/logo.ts):
   the four letters, then the ring. Cero's mark is a ring made of two crescents that chase each other round a
   circle (the live favicon, "Logo shape"), so the build winds them in round its centre, one a beat behind the
   other, until they close into the ring above the o. That is the geometry the logo already suggests: a turning, generating motion.
   A counter runs 0 to 100% beside the line "for this and every generation" so the screen reads as loading
   (house rule: loaders must be noticed); there is no progress bar (the client disliked faers.tech's).

     Build   0.10–0.70s  c e r o rise into place one after another (power3.out)
             0.35–1.30s  the two crescents wind in round the ring's centre and close into the ring (expo.out)
             0.10–1.50s  counter 0 → 100%
     Hold    0.25s       the finished logo sits still
     Exit    0.60s       the logo glides into the header logo position while the Ink ground wipes up,
                         uncovering the hero film under its Ink veil (no colour jump)
   About 2.3s on a warm cache. It waits for the hero's web font and poster frame for at most 0.6s more, and a
   failsafe ends it at 3.2s whatever happens. The handover fires early in the exit: removes `is-loading`, sets
   `data-intro="done"`, dispatches `intro:done`; the hero entrance and Lenis wait for it.
   Plays on every load, never with reduced motion, hidden by <noscript>. */

// Read once at module load: did the boot script (app/layout.tsx) decide the intro plays? (React dev double-mount safe.)
const shouldPlay = typeof document !== "undefined" && document.documentElement.classList.contains("is-loading");

function heroReady() {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const poster = new Promise<void>((resolve) => { const img = new Image(); img.onload = img.onerror = () => resolve(); img.src = "/media/hero-poster.jpg"; });
  return Promise.all([fonts, poster]);
}

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false, dead = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives; then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; };
    delete root.dataset.intro;
    if (reducedMotion() || !shouldPlay) { finish(); return; }
    root.classList.add("is-loading", "is-landing");

    const q = (id: string) => el.querySelector<SVGPathElement>(`[data-part="${id}"]`)!;
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const target = document.querySelector<SVGSVGElement>(".site-header .brand .logo");
    const letters = ["c", "e", "r", "o"].map(q);
    const centre = ringCentre(el.querySelector<SVGGElement>(".logo-ring")!);
    const count = el.querySelector(".preloader-count span");
    const level = { v: 0 };
    const show = () => { if (count) count.textContent = String(Math.round(level.v)); };

    const build = gsap.timeline({ defaults: { ease: "cero" } });
    build.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      .fromTo(letters, { yPercent: 45, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .55, stagger: .08 }, .1)
      // Both crescents wind round the ring's own centre (svgOrigin, in SVG user units) like a turbine spinning up,
      // the second a beat behind the first, and settle into the closed ring.
      .fromTo(q("swirlA"), { rotation: -300, opacity: 0, svgOrigin: centre }, { rotation: 0, opacity: 1, svgOrigin: centre, duration: .9, ease: "cero-blur" }, .35)
      .fromTo(q("swirlB"), { rotation: -300, opacity: 0, svgOrigin: centre }, { rotation: 0, opacity: 1, svgOrigin: centre, duration: .9, ease: "cero-blur" }, .43)
      .fromTo(el.querySelector(".preloader-meta"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5 }, .2)
      .to(level, { v: 100, duration: 1.4, ease: "power1.inOut", onUpdate: show }, .1);

    let land: gsap.core.Timeline | null = null;
    const complete = () => {
      if (dead || land) return;
      land = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
      land.addLabel("exit", .25)
        .to(el.querySelector(".preloader-meta"), { opacity: 0, y: -10, duration: .3, ease: "power2.in" }, "exit")
        .add(() => {
          // Measured at exit time so a late web font or a resize cannot misplace the landing.
          if (!target || !target.getBoundingClientRect().width) { gsap.to(logo, { opacity: 0, duration: .4 }); return; }
          const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
          gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .6, ease: "power3.inOut" });
        }, "exit")
        .to(el.querySelector(".preloader-ground"), { clipPath: "inset(0% 0% 100% 0%)", duration: .6 }, "exit")
        .add(handover, "exit+=.1")
        .set({}, {}, "exit+=.6");
    };
    const wait = Promise.race([heroReady(), new Promise((r) => setTimeout(r, 2100))]);
    build.eventCallback("onComplete", () => { void wait.then(complete); });

    // Never hold the page beyond ~3.2s, even if a frame stalls or an asset hangs.
    const failsafe = window.setTimeout(finish, 3200);
    return () => {
      dead = true; window.clearTimeout(failsafe); build.kill(); land?.kill(); gsap.killTweensOf([logo, level]);
      root.classList.remove("is-loading", "is-landing");
    };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-ground">
      <div className="preloader-sign"><Logo title="" /></div>
      <div className="preloader-meta wrap">
        <p className="preloader-line">Powering a net zero future<br />for this and every generation.</p>
        <p className="preloader-count"><span>0</span>%</p>
      </div>
    </div>
  </div>;
}

// The ring group's centre in SVG user units, so it turns on the spot.
function ringCentre(g: SVGGElement) {
  const b = g.getBBox();
  return `${b.x + b.width / 2} ${b.y + b.height / 2}`;
}

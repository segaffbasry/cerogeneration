"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { EASE, EASE_BLUR, timing } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitText, type Split } from "@/lib/split";

// Registered at module load so the preloader, hero and menu can build timelines on "cero" in their own effects.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("cero", EASE);
  CustomEase.create("cero-blur", EASE_BLUR);
}

/* The reveal set (README "Motion system"): one small fixed set of moves, applied the same way everywhere.
   heading  on.energy's BlurReveal: each line's characters come out of a 10px blur, 0.03s apart, expo.out
            (the client asked for this move by name; it is used on section headings only)
   text     on.energy's CopyReveal: paragraphs fade in line by line, 0.15s apart, power3.out
   label    buttons and small links: fade and 12px rise
   card     on.energy's SlideUpReveal, batched: 60px rise and fade, 0.15s apart
   image    clip opens from the bottom edge; [data-parallax] adds ±6% drift while it crosses the screen
   lit      faers.tech's statement: words brighten from 18% to full as the paragraph crosses the screen (scrubbed)
   count    [data-count] figures run up from zero once
   All play once; inside [data-late] sections they run at 75% of the duration. */
export function usePageMotion() {
  useEffect(() => {
    const reduced = reducedMotion();
    const root = document.documentElement;

    /* Links never leave the page (standing rule for these private demos): hrefs stay real and verifiable,
       but a capture-phase guard cancels any click or middle-click on a link that doesn't start with "#". */
    const stayOnPage = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (link && !link.getAttribute("href")!.startsWith("#")) event.preventDefault();
    };
    document.addEventListener("click", stayOnPage, true);
    document.addEventListener("auxclick", stayOnPage, true);

    /* Smooth scroll: Lenis on lerp .12 (house setting: no lag at the bottom of the page), driven by the GSAP ticker
       so ScrollTrigger reads the same frame. on.energy runs Lenis too (html.lenis). */
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (root.classList.contains("is-loading")) lenis.stop();
    }
    const start = () => getLenis()?.start();
    document.addEventListener("intro:done", start);

    // In-page anchors go through Lenis and move focus to the target.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link) return;
      const hash = link.getAttribute("href")!;
      const target = hash === "#top" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#top" && !target) return;
      event.preventDefault();
      if (lenis) { lenis.start(); lenis.scrollTo(target ?? 0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) }); }
      else (target ?? document.body).scrollIntoView();
      target?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    /* Reveals. */
    const splits: Split[] = [];
    const scale = (el: Element) => (el.closest("[data-late]") ? timing.late : 1);
    // data-shown lifts the CSS start-state guards (globals.css) once GSAP has set its own start states.
    const mark = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", ""));
    const ctx = gsap.context(() => {
      if (reduced) { mark(); return; }
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]:not([data-hero] [data-reveal])`);

      all("label").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 12 });
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: timing.label * scale(el), ease: "cero", clearProps: "transform" }) });
      });

      all("heading").forEach((el) => {
        const split = splitText(el, { chars: true });
        splits.push(split);
        const chars = split.chars.flat();
        gsap.set(chars, { autoAlpha: 0, filter: `blur(${timing.blur}px)` });
        // Lines start together; inside each line the characters follow one another (on.energy's per-line split).
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => split.chars.forEach((line) =>
          gsap.to(line, { autoAlpha: 1, filter: "blur(0px)", duration: timing.heading * scale(el), ease: "cero-blur", stagger: timing.charStagger, clearProps: "filter" })) });
      });

      all("text").forEach((el) => {
        const split = splitText(el);
        splits.push(split);
        const lines = split.lines;
        gsap.set(split.words, { autoAlpha: 0 });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () =>
          lines.forEach((line, i) => gsap.to(line, { autoAlpha: 1, duration: timing.text * scale(el), ease: "cero", delay: i * timing.lineStagger * scale(el) })) });
      });

      const cards = all("card");
      // opacity, never visibility: hidden, so links and buttons in unrevealed cards stay in the keyboard tab order.
      gsap.set(cards, { opacity: 0, y: timing.rise });
      ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: timing.card * scale(batch[0]), ease: "cero", stagger: timing.cardStagger * scale(batch[0]), overwrite: true, clearProps: "transform" }) });

      all("image").forEach((el) => {
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: timing.image * scale(el), ease: "cero", clearProps: "clipPath" }) });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const media = el.querySelector("img, video"); if (!media) return;
        gsap.fromTo(media, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
      });

      // lit: faers.tech's "What is FAERS" statement, each word brightening as the paragraph crosses the screen.
      all("lit").forEach((el) => {
        const split = splitText(el);
        splits.push(split);
        gsap.fromTo(split.words, { opacity: .18 }, { opacity: 1, ease: "none", stagger: .1, scrollTrigger: { trigger: el, scrub: true, start: "top 85%", end: "bottom 55%" } });
      });

      // count: figures run up from zero to their value once, when they enter.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count!, to = Number(raw), places = (raw.split(".")[1] ?? "").length, n = { v: 0 };
        el.textContent = (0).toFixed(places);
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(n, { v: to, duration: 1.6 * scale(el), ease: "power3.out", onUpdate: () => { el.textContent = n.v.toFixed(places); } }) });
      });
      mark();
    });

    /* The header takes its colour from whatever is under it: [data-tone="dark"] areas flip it to white type. */
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = 40;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-tone='dark']:not(.menu)")).some((el) => {
        const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe && r.left <= 60 && r.right >= 60;
      });
      root.dataset.header = dark ? "dark" : "light";
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    document.addEventListener("hero:update", queue);
    update();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", stayOnPage, true);
      document.removeEventListener("auxclick", stayOnPage, true);
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", start);
      document.removeEventListener("hero:update", queue);
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      splits.forEach((split) => split.revert());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); setLenis(null);
    };
  }, []);
}

/* Traps focus inside an overlay, closes on Escape, pauses the page scroll and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, trigger?: HTMLElement | null) {
  const previous = trigger ?? (document.activeElement as HTMLElement);
  getLenis()?.stop();
  document.documentElement.classList.add("overlay-open");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']")).filter((el) => el.offsetParent !== null);
  focusable()[0]?.focus({ preventScroll: true });
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("overlay-open");
    getLenis()?.start();
    previous?.focus({ preventScroll: true });
  };
}

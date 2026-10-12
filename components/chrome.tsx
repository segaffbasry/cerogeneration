"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { castrumProduction, contactLink, copyright, footerGroups, nav, offices, socials } from "@/lib/site";

// Menu shortcuts to the homepage's own sections (scrolled through Lenis). The live menu's "Home" is this list's first.
const onPage = [
  { label: "Home", href: "#top" },
  { label: "About Cero", href: "#about" },
  { label: "Our expertise", href: "#expertise" },
  { label: "Across Europe", href: "#projects" },
  { label: "Case studies", href: "#case-studies" },
  { label: "Landowners and careers", href: "#work-with-us" },
  { label: "Latest news", href: "#news" },
  { label: "Contact", href: "#contact" },
];

// The header shows three of the live menu's links inline on wide screens; the rest sit in the menu.
const inline = [nav[0], nav[1], nav[6]];

/* Full-screen menu. In: an Ink panel drops from the top edge as a rounded sheet (Virya's 28px radius) and opens to
   the full screen, the Sun ring turns once in the corner, then the links rise one after another. One GSAP
   timeline; reverse() plays the way out. Focus is trapped, Esc closes, focus returns to the trigger. */
function Menu({ open, close, trigger }: { open: boolean; close: () => void; trigger: HTMLElement | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "cero" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0% round 0px 0px 28px 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: .75, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelector(".menu-swirl"), { rotation: -120, opacity: 0 }, { rotation: 0, opacity: 1, duration: 1.2, ease: "cero-blur" }, .15)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: { amount: .35 } }, .3);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, trigger);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close, trigger]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <span className="menu-swirl" aria-hidden="true" />
    <div className="menu-top wrap">
      <a href="#top" className="brand" onClick={close} aria-label="Cero Generation, back to the top"><Logo title="" /></a>
      <button className="menu-close" onClick={close}><span>Close</span><span className="menu-x" aria-hidden="true" /></button>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-page" aria-label="On this page">
        <p className="menu-label" data-menu-in>On this page</p>
        <ul>{onPage.map((l) => <li key={l.href} data-menu-in><a href={l.href} onClick={close}><span>{l.label}</span><Arrow /></a></li>)}</ul>
      </nav>
      <div className="menu-side">
        <nav aria-label="Cero Generation site">
          <p className="menu-label" data-menu-in>Cero Generation</p>
          <ul className="menu-site">{[...nav, contactLink].map((l) => <li key={l.href} data-menu-in><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>
        <div className="menu-foot" data-menu-in>
          <p>{offices.map((o) => o.city).join(" · ")}</p>
          <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Cero Generation on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
        </div>
      </div>
    </div>
  </div>;
}

/* Frameless header: no bar or box. Its colour follows what is underneath (motion.tsx sets html[data-header]);
   it slides away on the way down and returns on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Cero Generation, back to the top"><Logo title="" /></a>
        <div className="header-actions" data-hero-part>
          <ul className="header-links">{inline.map((l) => <li key={l.href}><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
          <Button href={contactLink.href} tone="sun" className="btn-sm header-cta" reveal={false}>Contact us</Button>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>
            <span>Menu</span><span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} />
  </>;
}

/* Footer: the live footer's three link columns (same labels and order), its description, the Castrum production
   note, LinkedIn and the copyright line. No scroll reveals here (house rule: they read as a jump at the bottom). */
function Footer() {
  return <footer className="site-footer" data-tone="dark">
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-about">
          <a href="#top" className="footer-logo" aria-label="Cero Generation, back to the top"><Logo title="" /></a>
          <p>We’re focused on developing and delivering utility-scale solar and battery energy storage system (BESS) projects that power the transition to a cleaner, more resilient energy system.</p>
          <a href={castrumProduction.href} className="footer-note u-link" {...linkProps(castrumProduction.href)}>{castrumProduction.text}</a>
        </div>
        {footerGroups.map((g) => <nav key={g.title} className="footer-col" aria-label={g.title}>
          <h2 className="footer-label">{g.title}</h2>
          <ul>{g.links.map((l) => <li key={l.href}><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>)}
      </div>
      <div className="footer-bar">
        <p>{copyright}</p>
        <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Cero Generation on ${s.name}`}><SocialIcon icon={s.icon} size={20} /></a></li>)}</ul>
      </div>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}

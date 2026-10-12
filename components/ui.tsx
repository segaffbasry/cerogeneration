import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links that leave the page open in a new tab with rel="noopener" (brief); motion.tsx keeps them from navigating at all.
export const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

export function Arrow({ className = "arrow" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
    <path d="M1 5h8M5.5 1.5 9 5 5.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
  </svg>;
}

/* Rounded button in Virya's c-button shape (virya-energy.com theme CSS: border-radius 18px, padding 17px 28px,
   .3s ease-out, hover/focus scale .97, a 9px arrow 8px after the label), with faers.tech's arrow chip: on hover the
   arrow slides out of its circle to the right while a twin slides in from the left (styles/ui.css .btn-icon).
   Tones: "sun" Sun on Ink type (the primary), "navy" Navy with white type, "light" outlined white for dark grounds,
   "ink" outlined Ink for light grounds. */
export function Button({ href, children, tone = "sun", className = "", reveal = true, onClick }: {
  href: string; children: ReactNode; tone?: "sun" | "navy" | "light" | "ink"; className?: string; reveal?: boolean; onClick?: () => void;
}) {
  return <a href={href} className={`btn btn-${tone} ${className}`} data-reveal={reveal ? "label" : undefined} onClick={onClick} {...linkProps(href)}>
    <span>{children}</span><span className="btn-icon" aria-hidden="true"><Arrow /><Arrow className="arrow arrow-next" /></span>
  </a>;
}

export function SocialIcon({ icon, size = 18 }: { icon: BrandIcon; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}

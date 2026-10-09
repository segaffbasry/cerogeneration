/* One easing family for the whole site. The CSS twins live in app/globals.css as --ease-* custom properties.

   Reveals come from on.energy (the reference the client named for "the appear animation on texts"), read from its
   Nuxt bundle (_nuxt/Dr6gt4sL.js and vbZKWyke.js, 2026-10-09):
     BlurReveal     chars of each line: { autoAlpha: 0, filter: "blur(10px)" } → visible, duration 1.6, ease "expo.out", stagger .03
     CopyReveal     lines: autoAlpha 0 → 1, duration 2.5, ease "power3.out", stagger .15
     SlideUpReveal  children: { autoAlpha: 0, y: 100 } → visible, duration 1.5, ease "power3.out", stagger .15
     FadeReveal     children: autoAlpha → 1, duration .6, ease "sine.in", stagger .08
   The hero's scrubbed film-to-collage timeline keeps virya-energy.com's own power1.out (blocks/hero.js).
   So the family is the "out" curves: expo.out for the blur, power3.out for everything that moves. */

// GSAP power3.out and expo.out as cubic-beziers (the standard equivalents), registered with CustomEase in motion.tsx.
export const EASE = "0.215,0.61,0.355,1"; // power3.out ("cero")
export const EASE_BLUR = "0.19,1,0.22,1"; // expo.out ("cero-blur")

export const timing = {
  label: 0.6, // FadeReveal .6
  heading: 1.6, // BlurReveal 1.6
  charStagger: 0.03, // BlurReveal
  blur: 10, // px, BlurReveal
  text: 1.4, // CopyReveal is 2.5s; shortened so a paragraph has settled by the time it is read
  lineStagger: 0.15, // CopyReveal
  card: 1.1, // SlideUpReveal is 1.5s with y 100; shortened with a 60px rise for the smaller cards here
  cardStagger: 0.15, // SlideUpReveal
  rise: 60,
  image: 1.2,
  late: 0.75, // multiplier for sections marked data-late
};

import Preloader from "@/components/Preloader";
import { About } from "@/components/home/About";
import { CaseStudies } from "@/components/home/CaseStudies";
import { Contact } from "@/components/home/Contact";
import { Expertise } from "@/components/home/Expertise";
import { Footprint } from "@/components/home/Footprint";
import { Hero } from "@/components/home/Hero";
import { News } from "@/components/home/News";

/* The homepage, in order (README "Page structure"): an Ink opening (preloader and film), then a steady white page
   with Mist bands; no scroll-driven recolouring (house rule). */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <About />
    <Expertise />
    <Footprint />
    <CaseStudies />
    <News />
    <Contact />
  </>;
}

/* Homepage copy and data. Everything is the live site's own wording (cerogeneration.com, read 2026-10-09):
   the homepage first, then /what-we-do, /projects, the five /project/* pages and the newsroom for the facts the
   homepage only names. House rule: no em or en dashes anywhere, so the two live sentences that use one are
   rewritten with a comma (noted where it happens). Images are local copies made by scripts/media.sh. */
import { LIVE } from "@/lib/site";

const M = "/media";

// Homepage hero: h1 and the paragraph under it.
export const hero = {
  title: ["Powering a net zero future", "for this and every generation."],
  film: { src: `${M}/hero.mp4`, poster: `${M}/hero-poster.jpg` }, // live: uploads/2025/07/Home-Page-Update.mp4
  cta: { label: "What we do", href: `${LIVE}/what-we-do/` },
  // Five photographs from the project pages and /what-we-do fan out round the film card (Virya's collage).
  collage: [
    { src: `${M}/collage-tracker.jpg`, w: 900, h: 600, alt: "" },
    { src: `${M}/collage-delfini.jpg`, w: 900, h: 506, alt: "" },
    { src: `${M}/collage-team.jpg`, w: 900, h: 600, alt: "" },
    { src: `${M}/collage-bess.jpg`, w: 900, h: 506, alt: "" },
    { src: `${M}/collage-pontinia.jpg`, w: 900, h: 506, alt: "" },
  ],
};

// Homepage: h3 + first paragraph; they rise in under the collage.
export const intro = {
  title: ["Cero Generation is quickly becoming", "one of Europe’s leading renewable energy producers."],
  body: "We’re focused on developing and delivering utility-scale solar and battery energy storage system (BESS) projects that power the transition to a cleaner, more resilient energy system.",
};

// Homepage: second and third paragraphs, the About Us reel and "What we do".
export const about = {
  statement: "We currently operate six projects, with another six under construction. We’re poised for substantial growth in the coming years, with a significant uplift in operational projects.",
  owner: "Cero Generation is a Macquarie Asset Management (MAM) portfolio company, operating on a stand-alone basis.",
  reel: { src: `${M}/reel.mp4`, poster: `${M}/reel-poster.jpg`, label: "Watch the Cero film" }, // live: uploads/2025/07/About-Us-Reel-3.mp4
  cta: { label: "What we do", href: `${LIVE}/what-we-do/` },
  // Figures restate the homepage copy and the reel's own captions ("teams working across 8 different European countries").
  figures: [
    { value: 6, label: "Projects in operation" },
    { value: 6, label: "Projects under construction" },
    { value: 8, label: "European countries with Cero teams" },
    { value: 6, label: "Offices, from London to Warsaw" },
  ],
};

// /what-we-do "Our expertise": the four stages with their own photographs, in the live order.
export const expertise = {
  title: ["Our", "expertise"],
  lede: "We identify, develop, build and operate solar energy and battery storage projects.",
  cta: { label: "Cero overview", href: `${LIVE}/what-we-do/` },
  steps: [
    { name: "Identify", img: `${M}/identify.jpg`, body: "Our expert team identifies potential sites, carries out feasibility analyses and undertakes rigorous gating process in order to focus on progressing projects with true potential." },
    { name: "Develop", img: `${M}/develop.jpg`, body: "We optimise the design of projects, secure permitting, identify funding partners, and have agreed PPAs with major organisations including Centrica, Heineken and Philips." },
    { name: "Construct", img: `${M}/construct.jpg`, body: "We work with tier one constructors to build high performance projects, while ensuring best in class safety performance and project governance." },
    { name: "Operate", img: `${M}/operate.jpg`, body: "We own and manage operating assets, work with partners to maintain and optimise their energy generation and actively collaborate with communities to ensure they continue to benefit." },
  ],
};

export type Project = {
  id: string; name: string; place: string; country: string; href: string; img: string;
  solar: number; bess?: number; status: "Operational" | "Financial close";
  summary: string; detail: string;
};

/* The live homepage's five case studies (same order), with the facts from each /project/ page, plus Bumble Bee from
   the newsroom (Feb 2026), which appears on the map only: it has no project page yet. */
export const projects: Project[] = [
  { id: "pontinia", name: "Pontinia", place: "Latina, Italy", country: "Italy", href: `${LIVE}/project/pontinia/`, img: `${M}/case-pontinia.jpg`, solar: 70, status: "Operational",
    summary: "Pontinia is a 70MWp agrivoltaic solar PV project in the Province of Latina in Lazio, Italy.",
    detail: "The 135 hectares project site will be used for both energy and agricultural production." },
  { id: "delfini", name: "Delfini", place: "Prosotsani Drama, Greece", country: "Greece", href: `${LIVE}/project/delfini/`, img: `${M}/case-delfini.jpg`, solar: 100, status: "Operational",
    summary: "Delfini is a 100MWp solar PV project constructed on mountainous terrain in Prosotsani Drama, Greece.",
    detail: "It is the first solar PV project in Greece to use a private Power Purchase Agreement (PPA)." },
  { id: "castrum", name: "Castrum", place: "Montalto di Castro, Italy", country: "Italy", href: `${LIVE}/project/castrum/`, img: `${M}/case-castrum.jpg`, solar: 48, status: "Operational",
    summary: "Castrum is a 48MWp agrivoltaics solar PV project in Montalto di Castro, Italy.",
    detail: "The project benefits from a subsidy-free Power Purchase Agreement (PPA) with Centrica." },
  { id: "bolotana", name: "Bolotana", place: "Sardinia, Italy", country: "Italy", href: `${LIVE}/project/bolotana/`, img: `${M}/case-bolotana.jpg`, solar: 15, status: "Operational",
    summary: "Bolotana A and B are two neighbouring solar PV projects located in Sardinia, Italy.",
    detail: "The solar projects can generate a combined 15MWp and sit across 21 hectares of repurposed industrial land in a disused industrial estate." },
  { id: "larks-green", name: "Larks Green", place: "South Gloucestershire, England", country: "England", href: `${LIVE}/project/larks-green/`, img: `${M}/case-larks-green.jpg`, solar: 70, bess: 49.5, status: "Operational",
    summary: "Larks Green is a 70MWp solar PV and 49.5MW Battery storage project situated across 106 hectares of land in Itchington, Southwest England.",
    detail: "It was the first solar PV project in the UK to feed electricity directly into the transmission network." },
];

export const bumbleBee: Project = {
  id: "bumble-bee", name: "Bumble Bee", place: "West Burton, near Doncaster, England", country: "England",
  href: `${LIVE}/cero-generation-reaches-financial-close-on-198-mw-bumble-bee-co-located-renewable-energy-project-at-west-burton/`,
  img: `${M}/news-bumble-bee.jpg`, solar: 78, bess: 120, status: "Financial close",
  summary: "A co-located utility scale solar PV and battery energy storage project, connecting to the West Burton substation near Doncaster in the UK.",
  detail: "The project will deliver 78 MWp of solar PV generation together with a 120 MW battery energy storage system (BESS).",
};

// /projects h1, split for the two-tone heading.
export const footprint = {
  title: ["We’re operating utility scale solar and battery energy storage projects", "across Europe."],
  cta: { label: "Our projects", href: `${LIVE}/projects/` },
};

// /what-we-do "Building powerful partnerships" and its three logos.
export const partners = {
  text: "We’re pioneering innovative financing models, including industry-first Power Purchase Agreements with major household names.",
  logos: [
    { name: "Centrica Energy", src: `${M}/partner-1.png` },
    { name: "Heineken", src: `${M}/partner-2.png` },
    { name: "Philips", src: `${M}/partner-3.png` },
  ],
};

// Homepage "Latest news": the same four posts, newest first (dates from each post's datePublished).
export const news = {
  title: ["Latest", "news"],
  all: { label: "More news stories", href: `${LIVE}/newsroom/` },
  posts: [
    { title: "Cero Generation reaches financial close on 198 MW Bumble Bee Co-Located Renewable Energy Project at West Burton", date: "2026-02-23", img: `${M}/news-bumble-bee.jpg`,
      href: `${LIVE}/cero-generation-reaches-financial-close-on-198-mw-bumble-bee-co-located-renewable-energy-project-at-west-burton/` },
    { title: "Cero Generation Reaches Financial Close on a ~£200m financing package for a portfolio of UK solar and BESS co-located assets", date: "2025-09-15", img: `${M}/news-financing.jpg`,
      href: `${LIVE}/cero-generation-reaches-financial-close-on-a-200m-financing-package-for-a-portfolio-of-uk-solar-and-bess-co-located-assets/` },
    { title: "Cero Generation’s 48 MWp Solar PV Project in Montalto di Castro, Italy Goes Live", date: "2025-06-20", img: `${M}/news-castrum.jpg`,
      href: `${LIVE}/cero-generations-48-mwp-solar-pv-project-in-montalto-di-castro-italy-goes-live/` },
    { title: "Cero Generation launches the first Transmission connected co-located solar and battery storage facility at Larks Green", date: "2024-11-11", img: `${M}/news-larks-green.jpg`,
      href: `${LIVE}/cero-generation-launches-the-first-transmission-connected-co-located-solar-and-battery-storage-facility-at-larks-green/` },
  ],
};

// Project pages' closing band, "Ready to discuss a project?", with the /contact page's own heading as its line.
export const contact = {
  title: "Ready to discuss a project?",
  body: "Get in touch with us, submit an enquiry or connect with one of our offices.",
  img: `${M}/contact.jpg`,
  primary: { label: "Contact us", href: `${LIVE}/contact/` },
  secondary: { label: "Landowners", href: `${LIVE}/landowners/` },
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

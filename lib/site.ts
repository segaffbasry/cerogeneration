/* Site structure from the live cerogeneration.com header menu, footer and /contact page (checked 2026-10-09).
   Only the homepage is rebuilt, so every link here goes to the real URL on the live site. Pages are checked against
   /page-sitemap.xml and /project-sitemap.xml, everything else (PDFs, posts, careers) for a 200, by `npm run links`. */
import type { BrandIcon } from "@/lib/brand-icons";

export type Link = { label: string; href: string };

export const LIVE = "https://cerogeneration.com";
const UP = `${LIVE}/wp-content/uploads`;

// The live full-screen menu (Elementor popup 234), in order. "Home" is this page, so it scrolls to the top.
export const nav: Link[] = [
  { label: "What we do", href: `${LIVE}/what-we-do/` },
  { label: "Projects", href: `${LIVE}/projects/` },
  { label: "Landowners", href: `${LIVE}/landowners/` },
  { label: "Corporate Governance", href: `${LIVE}/corporate-governance/` },
  { label: "Team", href: `${LIVE}/team/` },
  { label: "Careers", href: "https://cerogeneration-1674220216.teamtailor.com/" },
  { label: "Newsroom", href: `${LIVE}/newsroom/` },
  { label: "Videos", href: `${LIVE}/videos/` },
];

export const contactLink: Link = { label: "Contact", href: `${LIVE}/contact/` };

// The live footer's three columns, in order and with their own labels.
export const footerGroups: { title: string; links: Link[] }[] = [
  { title: "What we do", links: [
    { label: "Cero overview", href: `${LIVE}/what-we-do/` },
    { label: "Contact us", href: `${LIVE}/contact/` },
    { label: "Our projects", href: `${LIVE}/projects/` },
  ] },
  { title: "Our company", links: [
    { label: "Careers", href: "https://cerogeneration-1674220216.teamtailor.com/" },
    { label: "Newsroom", href: `${LIVE}/newsroom/` },
    { label: "Meet the team", href: `${LIVE}/team/` },
  ] },
  { title: "Useful links", links: [
    { label: "Important information", href: `${LIVE}/important-information/` },
    { label: "Cero Generation Code of Conduct", href: `${UP}/2026/04/Cero-Code-of-Conduct-A5-web.pdf` },
    { label: "Principles for Suppliers", href: `${UP}/2025/09/Cero-Principles-for-Suppliers-September-2025.pdf` },
    { label: "UK Tax Strategy", href: `${LIVE}/uk-tax-strategy/` },
    { label: "Modern Slavery Statement 2026", href: `${UP}/2026/09/Cero-Modern-Slavery-Statement-2026.pdf` },
    { label: "Modern Slavery Statement 2025", href: `${UP}/2025/09/Cero-Modern-Slavery-Statement-2025.pdf` },
    { label: "Modern Slavery Statement 2024", href: `${UP}/2024/09/Cero-Modern-Slavery-Statement-2024.pdf` },
    { label: "Modern Slavery Statement 2023", href: `${UP}/2023/10/Cero-Modern-Slavery-Statement-2023.pdf` },
    { label: "Privacy and cookies", href: `${LIVE}/privacy-and-cookies/` },
    { label: "Sitemap", href: `${LIVE}/sitemap/` },
  ] },
];

// Live footer: the Castrum production note next to its QR code (the QR image itself is replaced by the link).
export const castrumProduction = {
  text: "View SOLAR ITALY III, Castrum Project monthly production",
  href: `${UP}/2026/08/IT-CAST-Produzioni-QR-Code.pdf`,
};

export const socials: { name: string; href: string; icon: BrandIcon }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/cero-generation/", icon: "linkedin" },
];

// "Our locations" from /contact, in the live order. The Lyon address uses a dash on the live site; it becomes a comma.
export const offices = [
  { city: "London", lines: ["17th Floor, HYLO", "103-105 Bunhill Row", "London EC1Y 8LZ"] },
  { city: "Madrid", lines: ["3rd floor Génova 27", "28004, Madrid"] },
  { city: "Hamburg", lines: ["c/o Contora, Alter Wall 32", "20457 Hamburg, Germany"] },
  { city: "Warsaw", lines: ["Przeskok 2", "00-032 Warszawa"] },
  { city: "Milan", lines: ["21 Via San Marco", "Milan, MI, 20121"] },
  { city: "Lyon", lines: ["55 ter avenue René Cassin", "69009 Lyon"] },
];

export const copyright = "© 2026 Cero Generation Limited, All Rights Reserved.";

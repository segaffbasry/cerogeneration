# Cero Generation: homepage redesign (private prospect demo)

A one-page rebuild of [cerogeneration.com](https://www.cerogeneration.com/). It uses Cero's own vector logo (taken from their Code of Conduct PDF), brand films, photography, palette and copy, restaged on three references:

- [virya-energy.com](https://virya-energy.com/): look and layout, and the copied interaction (the hero). The client: "this is good, the hero header etc., almost everything".
- [faers.tech](https://faers.tech/): motion and scroll ideas (the lit statement, the arrow-chip buttons). Its loader is deliberately not used (the client doesn't like it).
- [on.energy](https://www.on.energy/): the text appear animation (the client: "I like the appear animation on texts").

**Scope: homepage only.** Every other link points at the real page on cerogeneration.com.

Stack: Next.js 16 (App Router, TypeScript), GSAP + ScrollTrigger + CustomEase, and Lenis. No UI kit, CSS framework or other animation library. Plain CSS in `app/globals.css` and `styles/*.css`.

```bash
npm install
npm run dev        # http://127.0.0.1:3041
npm run build      # static build of the single route
npm run typecheck
npm run media      # re-download photos and films from the live site and re-encode them (needs ffmpeg)
npm run fonts      # download Rethink Sans and subset it to woff2 (needs python3 + fontTools)
npm run logo       # re-extract the vector logo from the Code of Conduct PDF into lib/logo.ts (needs PyMuPDF)
npm run map        # rebuild the Europe dot map and pin positions (public/media/europe-dots.svg, lib/europe-map.ts)
npm run links      # check every outbound link against the live sitemaps
```

## Routes

| Route | What |
|---|---|
| `/` | The homepage. Statically generated. |
| `/icon.svg` | Favicon: Cero's Sun ring on Navy, from the same vectors (the live favicon is a PNG of the ring). |

`next build` generates `/`, `/_not-found` and `/icon.svg` (4 static pages including Next's internal one). There are no archive or detail pages.

## Recon (phase 1)

**Live homepage, every section:**

| # | Live section | Items |
|---|---|---|
| 1 | Hero: background film (meadow and solar panels), h1 "Powering a net zero future for this and every generation." | 1 film |
| 2 | About: h3 + 3 paragraphs, "What we do", About Us reel (with sound, poster) | 1 film + 1 CTA |
| 3 | "Case Studies": slider | 5 (Pontinia, Delfini, Castrum, Bolotana, Larks Green) |
| 4 | "Latest news": 4 posts + "Load More", "More news stories" | 4 posts |
| 5 | Footer: logo, description, Castrum production QR note, 3 link columns (What we do 3, Our company 3, Useful links 10), copyright, LinkedIn | |

Header: logo + a hamburger that opens a full-screen popup menu (Home, What we do, Projects, Landowners, Corporate Governance, Team, Careers, Newsroom, Videos, Contact). The only social account is LinkedIn.

**Inner pages used for facts:** `/what-we-do` (Our expertise: Identify / Develop / Construct / Operate with four photos; partner logos Centrica, Heineken, Philips), `/projects` (h1 and the five projects), the five `/project/*` pages (capacity, place, facts), `/contact` (six offices), and the newsroom (Bumble Bee, Feb 2026: 78 MWp solar + 120 MW BESS).

**Sitemaps:** `/sitemap_index.xml` → `page-sitemap.xml` (12 pages) and `project-sitemap.xml` (5 projects). There is no post sitemap, so posts are checked for a 200 instead.

**Brand:**
- **Logo.** The site only serves PNGs. The real vectors are on page 1 of the Code of Conduct PDF (`uploads/2026/04/Cero-Code-of-Conduct-A5-web.pdf`, Affinity Publisher): four letter paths (c, e, r, o) and two crescents that make the Sun ring, plus the same ring at cover size (used as the menu's background graphic). `scripts/logo.py` writes them to `lib/logo.ts` by name; `components/Logo.tsx` renders the letters in `currentColor` and the ring in Sun.
- **Films.** `Home-Page-Update.mp4` (35s, clover and wildflowers in front of panels; homepage hero) and `About-Us-Reel-3.mp4` (36s, captioned reel with sound). Re-encoded to 6.1MB (muted, 30fps, 1600px) and 5.9MB (with sound, 1280px).
- **Fonts.** Everything on the live site is Effra (Dalton Maag) from an Adobe Fonts kit (`use.typekit.net/szv6fyq.css`). That licence is tied to their domain, so this build uses **Rethink Sans** (SIL OFL), chosen side by side against Effra 500 (rendered from the kit) over Albert Sans, Hanken Grotesk, Instrument Sans, Manrope and Wix Madefor: closest in width, round bowls and the single-storey g. One family, as on the live site; display sizes use weight 500 like Effra's headings.
- **Palette** from the Elementor global colours in the live CSS (see below).

## Decisions

| Bracket | Decision |
|---|---|
| Palette | **Navy** `#1E2470` (`--e-global-color-accent`, the wordmark), **Teal** `#06878A` (`primary`), **Sun** `#FFCB3D` (`secondary`, the ring), with **Ink** `#141636` (`text`, Navy's deep shade) and the pale band **Mist** `#E6EBEF`. White is the page ground. Not yet confirmed by the client; every value is theirs. |
| Look reference | virya-energy.com |
| Motion reference | faers.tech (scroll/statement) and on.energy (text reveals), as the client named them |
| Copied interaction | Virya's hero: the film shrinks into a card among five photos (below) |
| Preloader | Every load (house rule: loaders must be noticed), about 2.3s, with a counter |
| Typography | Rethink Sans for UI and display (Effra substitute, above) |
| PostHog key | The standing Regen EU key (`lib/posthog.ts`), overridable with `NEXT_PUBLIC_POSTHOG_KEY` |
| Slug / domain | `cero` (proposed demo URL in the brief: cero.regendigital.co). Vercel is a separate step |

**Reference conflicts, resolved:**
- The brief allows per-character effects only in the preloader and hero; the client asked for on.energy's text animation, which is a per-character blur. It is used on **section headings only**; paragraphs use on.energy's calmer line fade.
- faers.tech pins a scroll-scrubbed film for many screens. House rule: only the hero may pin, so faers contributes the statement and the button, not its pinned film.
- Virya's section padding is 120 to 180px; the house spacing scale caps it at 88px.

## Review 1 (11 Oct 2026)

Client feedback on the first version, and what changed:

| Feedback | Change |
|---|---|
| "Clean up text colours, I don't want half blue and half green, in title and in the boxes" | Two-tone headings are gone: every heading is one colour (Navy on light, white on dark). The figure boxes, the case-study capacities in Teal and the Teal "Read more" links are gone too. Teal now only marks map pins and focus rings. The hero's second line keeps Sun on the film (the client singled the hero out as working). |
| "Not sure on all this white space we have" (About) | About rebuilt as two full columns: the statement, MAM line, button and a row of four figures on the left; on the right, a Pontinia photo seen through Cero's own ring. The reel moves under them as a wide 21:9 band, so no grid cell is left empty. |
| "Too much text here" (map) | The six-row site list and its labels are gone. The map sits on an inset Ink panel with the heading, two totals and the filters. The sites are now links on the map itself, and each opens a card with the project's photo. |
| "Overall it's nice, but I don't think it's standing out in comparison to theirs; the header and first scroll to image collage is nice, it's the rest of the page" | Hero and collage unchanged. Below them: the ring-masked photo; the expertise stages as expanding photo panels; case studies as tall photo cards with white type, the summary sliding up on hover; the map on a dark panel. Awwwards reference: Sunsure Energy (nominee, a solar IPP), which crops its photography into its logo shape. That idea became the Cero ring mask. |
| "Could we add something for landowners? Or maybe careers banner?" | Both, as a pair of photo banners (`Paths.tsx`). Landowners: the /landowners heading "A partner to power success.", its first line and its three steps. Careers: the Teamtailor careers site's "Working with us" line and Cero's three values, with "Job openings". Added to the menu as "Landowners and careers". |

Also fixed in this round: card and button reveals now animate opacity only, never `visibility: hidden`, so links inside cards that haven't revealed yet stay in the keyboard tab order.

## Page structure and pacing

Eight blocks, image-led at the top: an Ink opening (preloader and film), then a steady white page with Mist bands. Nothing recolours as you scroll. Spacing comes from one scale (`--section-y: clamp(56px, 6.2vw, 88px)`).

| # | Section | Component | Imagery |
|---|---|---|---|
| 1 | Hero: film shrinks into a card among five photos; the intro rises underneath | `Hero.tsx` | brand film + 5 photos |
| 2 | About: lit statement, four figures, a photo inside the Cero ring, the reel as a wide band | `About.tsx` | ring photo + About Us reel |
| 3 | Our expertise: four expanding photo panels | `Expertise.tsx` | 4 photos |
| 4 | Across Europe: dot map on an Ink panel, two totals, filters, photo cards on the pins | `Footprint.tsx` | map + 6 project photos |
| 5 | Case studies: tall photo cards + PPA partners | `CaseStudies.tsx` | 5 photos + 3 logos |
| 6 | Landowners and careers banners | `Paths.tsx` | 2 photos |
| 7 | Latest news | `News.tsx` | 4 post images |
| 8 | Contact: "Ready to discuss a project?" + six offices | `Contact.tsx` | aerial photo |
| 9 | Footer | `chrome.tsx` | |

**Page height** (production build, `document.documentElement.scrollHeight`):

| Width × height | Total | Viewport heights |
|---|---|---|
| 1440 × 900 | 8,370px (includes the 990px hero pin) | 9.3 |
| 768 × 1024 | 9,935px | 9.7 |
| 375 × 812 | 9,127px | 11.2 (single column; news becomes a compact list on phones) |

Round 1 measured 8.3 screens at 1440. Review 1 added the landowners and careers banners the client asked for and gave the reel its own band, which together add about one screen. The map lost its list (about 300px) to compensate.

## Content counts: live homepage vs this build

| Section | Live | Here | Note |
|---|---|---|---|
| Hero | film + h1 | same + "What we do" and "Our projects" buttons | The buttons mirror Virya's two-button hero. |
| About | h3, 3 paragraphs, reel, CTA | all of it | h3 + first paragraph rise under the collage; the other two are the lit statement and the line under it. |
| Figures | none | 4 | Restate the copy (6 operating, 6 under construction), the reel's caption (teams in 8 European countries) and `/contact` (6 offices). |
| Our expertise (from `/what-we-do`) | not on the homepage | 4 stages, 4 photos | Gives the homepage the "what we do" story the live one only links to. |
| Across Europe (from `/projects` + newsroom) | not on the homepage | 6 sites (map pins with photo cards), 6 offices, 2 totals | The signature data visual. Bumble Bee comes from the Feb 2026 release (no project page yet; it links to the release). The list of sites was dropped in review 1. |
| Case studies | 5 | 5 | Same projects and order. Since review 1 each card uses its project page's lead photo: the homepage's 2.4:1 slider strips don't fit portrait cards. |
| Landowners and careers (from `/landowners`, careers site) | not on the homepage | 2 banners | Added at the client's request (review 1). |
| PPA partners (from `/what-we-do`) | not on the homepage | line + 3 logos | |
| Latest news | 4 (+ Load More) | 4 | "More news stories" goes to `/newsroom/`. |
| Contact | not on the homepage (on project pages) | title, line, 2 CTAs, 6 offices | Kept out of the footer (house rule). |
| Footer | logo, description, QR note, 16 links, LinkedIn, copyright | same | The QR image becomes its own link ("View SOLAR ITALY III, Castrum Project monthly production"). |

Copy is verbatim except dashes (house rule): the page title "Cero Generation - Solar Energy Developer" becomes "Cero Generation | Solar Energy Developer", and the Lyon address's dash becomes a line break.

## Copied interaction: Virya's hero, film to collage

Source: `virya-energy.com/wp-content/themes/virya/assets/build/resources_js_blocks_hero_js.frontend.js` and the `.hero__*` rules in the theme CSS. Rebuilt value for value in `components/home/Hero.tsx` + `styles/hero.css` (comments in both list every number):

- The film and five photos share one grid cell; photos use Virya's widths (desktop 206/219/249/183/238px), aspect ratios, z-orders and radii.
- One pinned, scrubbed timeline (`power1.out`): headline fades first (position -0.6), the film shrinks to a 309×362, 28px-radius card, the photos fan out to Virya's offsets at 0.2 to 0.35, card and photos lift together at 0.4 while the intro rises in.
- Past 70% progress, mouse parallax wakes: per-photo speeds .08/.12/.10/.15/.11 (film .13), 10% interpolation per tick, rotation = speed × 150.
- Deliberate changes: the pin runs 110% of the viewport height (Virya: 3000px) so the page stays short, and the lift is capped at 17% of the viewport height.
- Side by side: Virya waits 2s and a `ready` class before it builds the pin and does not initialise under viewport emulation, so the comparison is value for value against its source. Same timeline code as the Voltwise demo, which used the same reference.

## The opening moment (preloader)

`components/Preloader.tsx`. Cero's mark is a ring made of two crescents chasing each other round a circle, so the build reads as a turbine spinning up:

| Time | Stage |
|---|---|
| 0.10 to 0.70s | c e r o rise into place one after another (power3.out) |
| 0.35 to 1.30s | the two crescents wind in round the ring's centre (svgOrigin), one a beat behind the other, and close into the ring (expo.out) |
| 0.10 to 1.50s | counter 0 to 100% beside "Powering a net zero future / for this and every generation." |
| +0.25s | hold |
| +0.60s | the logo glides into the header logo position (measured at exit time) while the Ink ground wipes up, uncovering the film under its Ink veil |

About 2.3s on a warm cache, never more than 3.2s (failsafe). It waits at most 0.6s more for the web font and the poster frame. Handover early in the exit: removes `is-loading`, sets `data-intro="done"`, dispatches `intro:done`; the hero headline, buttons, header and the film wait for it and Lenis stays stopped until then. Plays on every load (boot script in `app/layout.tsx`, before first paint), skipped with reduced motion, hidden by `<noscript>`. Stages were checked in headless screenshots at 0.3, 0.7, 0.85, 1.0, 1.2, 1.5, 1.9, 2.3 and 2.7s: no flash of the page or hero before it, no colour jump at handover (both are Ink). No progress bar: the client disliked faers.tech's charging bar.

## Motion system

Smooth scroll: Lenis (`lerp .12`), on the GSAP ticker, synced with ScrollTrigger; anchors go through it; the preloader and menu stop it. Easing: power3.out (`"cero"`) and expo.out (`"cero-blur"`), CSS twins `--ease` and `--ease-blur` (`lib/ease.ts`, values from on.energy's bundle).

| Move | Where | What | Source |
|---|---|---|---|
| heading | section headings | each line's characters come out of a 10px blur, 0.03s apart, 1.6s, expo.out | on.energy BlurReveal |
| text | paragraphs | lines fade in 0.15s apart, 1.4s, power3.out | on.energy CopyReveal (2.5s there) |
| lit | the About statement | words brighten from 18% as it crosses the screen (scrubbed) | faers.tech statement |
| label | buttons, chips | fade and 12px rise, 0.6s | on.energy FadeReveal |
| card | cards, figures, rows | batched 60px rise and fade, 0.15s apart, 1.1s | on.energy SlideUpReveal |
| image | photos | clip opens from the bottom edge; `[data-parallax]` adds ±6% drift | brief |
| count | figures | run up from zero once | |

All play once, from `components/motion.tsx`; inside `[data-late]` sections (news, contact) they run at 75%. The footer has no reveals (house rule: they read as a jump at the bottom).

**Header:** frameless, colour from what is underneath (`[data-tone="dark"]` areas turn it white), hides on scroll down, returns on scroll up. **Menu:** Ink sheet drops from the top as a rounded card and opens to full screen, the big ring (from the PDF cover) turns once, links rise; one GSAP timeline reversed on close; focus trap, Esc, focus back to the trigger. Menu items scroll to homepage sections or go to the live URLs.

**Buttons** (`components/ui.tsx`, `styles/ui.css`): Virya's c-button (18px radius, .3s ease-out, scale .97 on hover) with faers.tech's arrow chip (the arrow slides out of its circle while a twin slides in).

**Expertise panels:** hover, focus or click opens a panel (the name is a button with `aria-expanded`). The open one widens (flex-grow, .8s power3.out) and its text fades up. The closed strips turn their names upright. Arrow keys, Home and End move between panels. On phones the panels stack and the open one grows taller.

**Ring mask (About):** `public/media/swirl.svg` (the cover ring from the Code of Conduct) is a CSS mask over a photograph. While the section scrolls past, the ring turns from -12° to 12° (scrubbed) and the photo counter-turns so it stays upright.

**Across Europe:** `scripts/map.mjs` projects Natural Earth 1:50m (conic conformal) into a dot grid and places pins by town and office coordinates. The pins are real links laid over the map. Hovering or focusing one opens a card with the project's photo, place and capacity (it flips left near the right edge). Chips filter the map. Halo size follows capacity. Operational sites are Teal, Bumble Bee (financial close) Sun, offices white.

**Films:** the hero film is muted with a pause control, starts after handover and pauses off-screen; the poster is a local frame. The reel keeps its sound, so it starts only on "Watch the Cero film" and pauses when it leaves the screen.

## Accessibility and fallbacks

- Reduced motion: no preloader, no smooth scroll, no pin; everything visible in place (checked: 0 hidden reveal targets).
- No JS: the `js`/`is-loading` classes are never added, so nothing starts hidden; `<noscript>` hides the preloader.
- Split text keeps a visually hidden copy of the plain sentence for screen readers; the split spans are `aria-hidden`.
- Keyboard: skip link, visible Teal/Sun focus rings, menu focus trap, expertise panels and map pins reachable and operable (map cards open on focus). Checked with a scripted keyboard run.
- Contrast: body Ink on white; muted text 5.5:1; Sun buttons carry Ink type; white type on photos always sits on an Ink shade (stronger on phones, where the text block is taller). Teal carries no text.

## Private-demo settings

- `robots: noindex, nofollow` in the layout metadata; no sitemap or robots route.
- PostHog EU (`lib/posthog.ts`): pageview, pageleave, autocapture, session recording; surveys off; `site` registered; UTM params registered; `scroll_depth` at 25/50/75/100% (each once).
- Links never navigate (house rule): a capture-phase guard in `motion.tsx` cancels clicks on any link not starting with `#`. Hrefs stay real; external ones carry `target="_blank" rel="noopener"`.
- No visible Regen UI anywhere.

## Links

`npm run links`: 31 outbound links, 0 failures. One known exception: **"Modern Slavery Statement 2025"** (`uploads/2025/09/Cero-Modern-Slavery-Statement-2025.pdf`) returns 404 **on the live site itself**; it is kept so the footer matches theirs and reported as `KNWN`. Worth mentioning to the client.

## Where the images came from

All from cerogeneration.com uploads, via `scripts/media.sh` (natural colour, saturation 0.94, no tint):

| File | Source |
|---|---|
| `hero.mp4`, `hero-poster.jpg` | `2025/07/Home-Page-Update.mp4` (homepage hero) |
| `reel.mp4`, `reel-poster.jpg` | `2025/07/About-Us-Reel-3.mp4` (homepage About); poster is the frame at 2s |
| `collage-*.jpg` | `2025/09/2.jpg`, `ALEXPARKYNSMITH…-63-1.jpg` (what-we-do); `Delfini-Solar-Project.jpg`, `Pontinia-Solar-Project.jpg` (project pages); `Larks-Green-BESS.jpg` (news) |
| `identify/develop/construct/operate.jpg` | `2025/07/Image-1_1…4.jpg` (what-we-do) |
| `case-*.jpg` | each project page's lead photo: `Pontinia-Solar-Project.jpg`, `Delfini-Solar-Project.jpg`, `Castrum-1.png`, `Bolo-B-1-2-scaled.jpg`, `Larks-Green-Solar-Project.jpg` |
| `ring-photo.jpg` | `2024/04/Pontinia-Solar-Project-3.jpg` (project page) |
| `landowners.jpg` | `2024/04/Larks-Green-Solar-Project-2.jpg` (project page) |
| `careers.jpg` | the careers site gallery (Teamtailor CDN), Cero site team |
| `news-*.jpg` | the four homepage post images |
| `contact.jpg` | `2025/09/Cero-Generation.jpg` |
| `partner-1…3.png` | `2025/07/Logo-01…03.png` (what-we-do), printed Navy by CSS mask |
| `swirl.svg`, `lib/logo.ts`, `app/icon.svg` | Code of Conduct PDF, page 1 vectors |
| `europe-dots.svg` | generated (Natural Earth via world-atlas) |

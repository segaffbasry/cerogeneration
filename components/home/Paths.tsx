import Image from "next/image";
import { Button } from "@/components/ui";
import { paths } from "@/lib/content";

/* Landowners and careers (review 1: "could we add something for landowners? or maybe careers banner?").
   Two photo banners side by side, each the live page's own heading, first line and three steps or values:
   /landowners ("A partner to power success.", the three steps of how it works) and the Teamtailor careers site
   ("Working with us", Cero's three values). White type over the photograph on an Ink shade; the photo eases in
   on hover. The landowner photo is Larks Green from the air, the careers photo the site team from the careers
   gallery. */
export function Paths() {
  return <section className="section paths" id="work-with-us" tabIndex={-1} aria-label="Work with Cero">
    <div className="wrap paths-grid">
      {paths.map((p) => <article key={p.id} className="path" data-tone="dark" data-reveal="card" aria-labelledby={`path-${p.id}`}>
        <Image src={p.img} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
        <div className="path-body">
          <p className="path-label">{p.label}</p>
          <h2 className="h3" id={`path-${p.id}`}>{p.title}</h2>
          <p className="path-text">{p.body}</p>
          <ul className="path-points">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
          <Button href={p.cta.href} tone="sun" reveal={false}>{p.cta.label}</Button>
        </div>
      </article>)}
    </div>
  </section>;
}

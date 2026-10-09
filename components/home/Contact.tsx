import Image from "next/image";
import { Button } from "@/components/ui";
import { contact } from "@/lib/content";
import { offices } from "@/lib/site";

/* Contact: its own section, never part of the footer (house rule). The project pages' "Ready to discuss a
   project?" over Cero's aerial photograph, with the six offices from /contact. The photo drifts gently (parallax),
   with an Ink veil for contrast; the panel is inset with Virya's 28px radius so it never reads as a hard fill. */
export function Contact() {
  return <section className="section contact" id="contact" tabIndex={-1} aria-labelledby="contact-title" data-late>
    <div className="wrap">
      <div className="contact-panel" data-tone="dark">
        <div className="contact-photo" data-parallax aria-hidden="true"><Image src={contact.img} alt="" fill sizes="100vw" /></div>
        <div className="contact-inner">
          <div className="contact-copy">
            <h2 className="h2" id="contact-title" data-reveal="heading">{contact.title}</h2>
            <p className="lede" data-reveal="text">{contact.body}</p>
            <div className="contact-buttons" data-reveal="label">
              <Button href={contact.primary.href} tone="sun" reveal={false}>{contact.primary.label}</Button>
              <Button href={contact.secondary.href} tone="light" reveal={false}>{contact.secondary.label}</Button>
            </div>
          </div>
          <ul className="contact-offices" aria-label="Our locations">
            {offices.map((o) => <li key={o.city} data-reveal="card">
              <address><strong>{o.city}</strong>{o.lines.map((l) => <span key={l}>{l}</span>)}</address>
            </li>)}
          </ul>
        </div>
      </div>
    </div>
  </section>;
}

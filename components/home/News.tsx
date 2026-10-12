import Image from "next/image";
import { Arrow, Button, linkProps } from "@/components/ui";
import { formatDate, news } from "@/lib/content";

/* Latest news: the live homepage's four posts, newest first. Cards after Virya's latest-news block: photo, date,
   title; the photo eases in on hover. "More news stories" goes to the live /newsroom/. */
export function News() {
  return <section className="section news" id="news" tabIndex={-1} aria-labelledby="news-title" data-late>
    <div className="wrap">
      <div className="section-head">
        <h2 className="h2" id="news-title" data-reveal="heading">{news.title}</h2>
        <Button href={news.all.href} tone="ink">{news.all.label}</Button>
      </div>
      <ul className="news-grid">
        {news.posts.map((p) => <li key={p.href} data-reveal="card">
          <a href={p.href} className="post" {...linkProps(p.href)}>
            <div className="post-media media"><Image src={p.img} alt="" width={1000} height={667} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 320px" /></div>
            <p className="small"><time dateTime={p.date}>{formatDate(p.date)}</time></p>
            <h3 className="post-title">{p.title}</h3>
            <span className="post-more">Read more <Arrow /></span>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}

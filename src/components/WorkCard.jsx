import LinkChips from "./LinkChips";
import { prefersReducedMotion } from "../lib/media";

function Media({ media }) {
  if (media.video) {
    return (
      <video
        className="card-media"
        muted
        playsInline
        loop
        autoPlay={!prefersReducedMotion()}
        preload="metadata"
        poster={media.poster}
        aria-label={media.alt}
      >
        <source src={media.video.webm} type="video/webm" />
        <source src={media.video.mp4} type="video/mp4" />
      </video>
    );
  }
  return (
    <img
      className="card-media"
      src={media.image}
      alt={media.alt}
      loading="lazy"
    />
  );
}

export default function WorkCard({ title, impact, media, links }) {
  return (
    <article className="card">
      {media && <Media media={media} />}
      <h3 className="card-title">{title}</h3>
      <p className="card-impact">{impact}</p>
      <LinkChips links={links} />
    </article>
  );
}

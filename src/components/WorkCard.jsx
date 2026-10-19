import LinkChips from "./LinkChips";
import { useRef } from "react";
import { useViewportPlayback } from "../hooks/useViewportPlayback";

function VideoMedia({ media }) {
  const video = useRef(null);
  const box = useRef(null);
  const { playing, toggle } = useViewportPlayback([video], box);
  return (
    <div ref={box}>
      <video
        ref={video}
        className="card-media"
        muted
        playsInline
        loop
        preload="metadata"
        poster={media.poster}
        aria-label={media.alt}
      >
        <source src={media.video.webm} type="video/webm" />
        <source src={media.video.mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        className="play-btn card-play mono"
        onClick={toggle}
      >
        <span aria-hidden="true">{playing ? "❚❚ " : "▶ "}</span>
        {playing ? "pause video" : "play video"}
      </button>
    </div>
  );
}

function Media({ media }) {
  if (media.video) return <VideoMedia media={media} />;
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

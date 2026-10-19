import { useEffect, useRef } from "react";
import CopyEmail from "../components/CopyEmail";
import LinkChips from "../components/LinkChips";
import VideoPane from "../components/VideoPane";
import { useViewportPlayback } from "../hooks/useViewportPlayback";

export default function Hero({ profile, hero }) {
  const primary = useRef(null);
  const secondary = useRef(null);
  const box = useRef(null);
  const { playing, toggle } = useViewportPlayback([primary, secondary], box);

  useEffect(() => {
    const a = primary.current;
    const b = secondary.current;
    if (!a || !b) return;
    const sync = () => {
      if (Math.abs(a.currentTime - b.currentTime) > 0.15)
        b.currentTime = a.currentTime;
    };
    a.addEventListener("timeupdate", sync);
    return () => a.removeEventListener("timeupdate", sync);
  }, []);

  const { links } = profile;
  return (
    <header id="top" className="hero">
      <h1 className="hero-name">{profile.name}</h1>
      <p className="hero-tagline mono">{profile.tagline}</p>
      <p className="hero-bio">{profile.bio}</p>
      <p className="hero-highlight mono">
        <span aria-hidden="true">★ </span>
        <span>{profile.highlight.text}</span>{" "}
        <a href={profile.highlight.href}>{profile.highlight.label}</a>
      </p>
      <LinkChips
        className="hero-links"
        links={[
          { label: "resume.pdf", href: links.resume },
          { label: "linkedin", href: links.linkedin },
          { label: "scholar", href: links.scholar },
        ]}
      >
        <CopyEmail email={links.email} label="email" />
      </LinkChips>
      <div className="pipeline" ref={box}>
        <VideoPane ref={primary} {...hero.panes[0]} />
        <VideoPane ref={secondary} {...hero.panes[1]} />
      </div>
      <p className="pipeline-caption mono">
        {hero.caption} <span className="muted">· {hero.subject}</span>
      </p>
      <button type="button" className="play-btn mono" onClick={toggle}>
        <span aria-hidden="true">{playing ? "❚❚ " : "▶ "}</span>
        {playing ? "pause reconstruction" : "play reconstruction"}
      </button>
    </header>
  );
}

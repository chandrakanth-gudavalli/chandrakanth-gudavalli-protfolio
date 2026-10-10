import { useCallback, useEffect, useRef, useState } from "react";
import LinkChips from "../components/LinkChips";
import VideoPane from "../components/VideoPane";
import { prefersReducedMotion, safePlay } from "../lib/media";

export default function Hero({ profile, hero }) {
  const primary = useRef(null);
  const secondary = useRef(null);
  const box = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);

  const playAll = useCallback(async () => {
    const videos = [primary.current, secondary.current].filter(Boolean);
    const results = await Promise.all(videos.map(safePlay));
    setNeedsTap(!results.every(Boolean));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setNeedsTap(true);
      return;
    }
    if (typeof window.IntersectionObserver !== "function") {
      playAll();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playAll();
        else
          [primary.current, secondary.current].forEach((v) => v && v.pause());
      },
      { threshold: 0.25 },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [playAll]);

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
        <a
          href={profile.highlight.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {profile.highlight.label}
        </a>
      </p>
      <LinkChips
        className="hero-links"
        links={[
          { label: "resume.pdf", href: links.resume },
          { label: "linkedin", href: links.linkedin },
          { label: "scholar", href: links.scholar },
          { label: "email", href: links.email },
        ]}
      />
      <div className="pipeline" ref={box}>
        <VideoPane ref={primary} {...hero.panes[0]} />
        <VideoPane ref={secondary} {...hero.panes[1]} />
      </div>
      <p className="pipeline-caption mono">
        {hero.caption} <span className="muted">· {hero.subject}</span>
      </p>
      {needsTap && (
        <button type="button" className="play-btn mono" onClick={playAll}>
          ▶ play reconstruction
        </button>
      )}
    </header>
  );
}

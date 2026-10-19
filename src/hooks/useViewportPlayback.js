import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, safePlay } from "../lib/media";

// Plays the given videos while the container is >=25% visible, pauses them
// otherwise, and exposes a user toggle (WCAG 2.2.2). A user pause sticks:
// re-entering the viewport does not resume playback.
export function useViewportPlayback(videoRefs, containerRef) {
  const [playing, setPlaying] = useState(false);
  const refs = useRef(videoRefs);
  refs.current = videoRefs;
  const userPaused = useRef(false);
  const wanted = useRef(false);

  const videos = () => refs.current.map((r) => r.current).filter(Boolean);

  const play = useCallback(async () => {
    wanted.current = true;
    const results = await Promise.all(videos().map(safePlay));
    const ok = results.every(Boolean);
    if (!ok) wanted.current = false; // blocked: next toggle should try to play
    setPlaying(wanted.current && ok);
  }, []);

  const pause = useCallback(() => {
    wanted.current = false;
    videos().forEach((v) => v.pause());
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window.IntersectionObserver !== "function") {
      play();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) play();
        } else pause();
      },
      { threshold: 0.25 },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [play, pause, containerRef]);

  const toggle = useCallback(() => {
    if (wanted.current) {
      userPaused.current = true;
      pause();
    } else {
      userPaused.current = false;
      play();
    }
  }, [play, pause]);

  return { playing, toggle };
}

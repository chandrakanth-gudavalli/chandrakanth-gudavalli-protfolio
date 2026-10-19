export function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function safePlay(video) {
  try {
    const p = video.play();
    return p && typeof p.then === "function"
      ? p.then(
          () => true,
          // AbortError = our own pause() interrupted play(); that is not autoplay being blocked.
          (err) => err?.name === "AbortError",
        )
      : Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

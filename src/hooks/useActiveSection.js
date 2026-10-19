import { useEffect, useState } from "react";

export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",");
    // contact + footer are shorter than the IO band, so at the page bottom
    // the last section is active by definition.
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      )
        setActive(list[list.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let io;
    if (typeof window.IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (hit) setActive(hit.target.id);
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      list.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (io) io.disconnect();
    };
  }, [key]);

  return active;
}

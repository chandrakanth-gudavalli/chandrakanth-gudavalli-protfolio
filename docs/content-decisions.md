# Content decisions

Choices the owner has made that aren't obvious from the code. Newest first; add an entry when a decision like this comes up.

## 2026-10-18 — Wrivinder: arXiv preprint, not CVPR 2026

The paper "Wrivinder: Towards Spatial Intelligence for Geo-locating Ground Images onto Satellite Imagery" (arXiv 2602.14929) was previously listed as CVPR 2026. The owner is withdrawing it from CVPR and plans to submit to SIGGRAPH.

- **Do:** list it as "arXiv preprint · planned submission to SIGGRAPH", linking to the arXiv page. Keep it on the site and in the GitHub profile README — the owner explicitly did _not_ want it removed.
- **Don't:** mention "CVPR 2026" anywhere in site copy or the profile README.
- When it's accepted somewhere, update the venue in `src/content.js` (publication entry, work-card link label, Mayachitra experience bullet) and in the profile README.
- **Left as-is by the owner's choice:** `public/resume.pdf` still says "CVPR 2026" (replaced only when the owner exports a new resume), and the geolocalization card image `public/media/geoloc.jpg` is cropped from the paper's Figure 1.
- The historical docs under `docs/superpowers/` and a comment in `scripts/encode-media.sh` still say CVPR 2026; they aren't published, so they were left alone.

# chandrakanthgudavalli.com

Source for [www.chandrakanthgudavalli.com](https://www.chandrakanthgudavalli.com) — the portfolio of Chandrakanth Gudavalli, 3D computer vision engineer.

A single-page Vite + React 18 site. All copy, links and media paths live in `src/content.js`.

```bash
npm install
npm run dev       # local dev server
npm test          # tests
npm run deploy    # tests + build, then publish dist/ to chandrakanth-gudavalli.github.io (master)
```

See `CLAUDE.md` for architecture notes and `scripts/encode-media.sh` for how the videos in `public/media/` are produced.

Originally based on [masterPortfolio](https://github.com/ashutosh1919/masterPortfolio) by Ashutosh Hathidara (MIT, see `LICENSE`).

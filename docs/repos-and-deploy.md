# Repos and deploying

Three GitHub repos, all under `chandrakanth-gudavalli`:

| Repo                                                                          | Holds                                            | Shows up at                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `chandrakanth-gudavalli-protfolio` (this repo; note the "protfolio" spelling) | Vite + React source                              | —                                                                                       |
| `chandrakanth-gudavalli.github.io`, branch `master`                           | Built `dist/` only — never edit by hand          | https://www.chandrakanthgudavalli.com (GitHub Pages; custom domain from `public/CNAME`) |
| `chandrakanth-gudavalli`, branch `main`                                       | A single `README.md` — the GitHub profile README | Top of https://github.com/chandrakanth-gudavalli                                        |

### Fun projects (separate repos, same domain)

Each of these is its own repo with GitHub Pages on, so GitHub serves it under the custom domain at `/<repo-name>/`. They're linked from the site's "fun" section (`fun` in `src/content.js`). `npm run deploy` doesn't touch them, but if `public/` ever gained a folder with the same name it would shadow the project — `src/media.test.js` guards against that.

| Repo                  | Live at                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `uc_santa_barbara_3d` | https://www.chandrakanthgudavalli.com/uc_santa_barbara_3d/ — UCSB campus as 3D Gaussian Splatting models            |
| `matcher-rotation`    | https://www.chandrakanthgudavalli.com/matcher-rotation/ — ten point matchers vs. a drone image rotated through 360° |

Adding another: the owner creates the repo and turns on Pages; then add an entry to `fun` (path must be `/<repo-name>/`), update the count in `src/content.test.js`, and add it to the profile README.

Git auth is via SSH (`git@github.com:...`). The `gh` CLI is **not** installed on this machine; use plain `git` and the public REST API (`curl https://api.github.com/...`) for read-only checks.

## Deploying the site

`npm run deploy` publishes to the live site, so **ask the owner before running it**. It runs `predeploy` (`npm test && npm run build`) and then `gh-pages` pushes `dist/` to `master` of the `.github.io` repo.

Verify it went live (GitHub Pages usually takes under a minute):

```bash
npm run build | grep 'index-.*\.js'   # note the bundle hash
curl -s https://www.chandrakanthgudavalli.com/ | grep -o 'assets/index-[^"]*\.js'
curl -s https://www.chandrakanthgudavalli.com/assets/index-<hash>.js | grep -c '<text you changed>'
```

Deploying doesn't push the source branch — push `bellerophon` separately if the owner wants it on GitHub.

## Updating the GitHub profile README

It isn't in this repo. Clone it, edit, push:

```bash
git clone git@github.com:chandrakanth-gudavalli/chandrakanth-gudavalli.git
```

It mirrors the site's copy: tagline + bio, the WRIVA #1 highlight, links (website, Scholar, LinkedIn, email), the hero image (loaded from `https://www.chandrakanthgudavalli.com/media/hero-dense.jpg`), the four selected-work items, the fun projects and the three most recent publications. When the site's content changes in a way that touches those, update the README too — the owner expects them to stay consistent. Same no-phone-number rule applies.

The profile's "Website" field (GitHub Settings → Public profile) is the owner's to set; as of 2026-10-18 it was empty.

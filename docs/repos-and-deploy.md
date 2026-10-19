# Repos and deploying

Three GitHub repos, all under `chandrakanth-gudavalli`:

| Repo                                                                          | Holds                                            | Shows up at                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `chandrakanth-gudavalli-protfolio` (this repo; note the "protfolio" spelling) | Vite + React source                              | —                                                                                       |
| `chandrakanth-gudavalli.github.io`, branch `master`                           | Built `dist/` only — never edit by hand          | https://www.chandrakanthgudavalli.com (GitHub Pages; custom domain from `public/CNAME`) |
| `chandrakanth-gudavalli`, branch `main`                                       | A single `README.md` — the GitHub profile README | Top of https://github.com/chandrakanth-gudavalli                                        |

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

It mirrors the site's copy: tagline + bio, the WRIVA #1 highlight, links (website, Scholar, LinkedIn, email), the hero image (loaded from `https://www.chandrakanthgudavalli.com/media/hero-dense.jpg`), the four selected-work items and the three most recent publications. When the site's content changes in a way that touches those, update the README too — the owner expects them to stay consistent. Same no-phone-number rule applies.

The profile's "Website" field (GitHub Settings → Public profile) is the owner's to set; as of 2026-10-18 it was empty.

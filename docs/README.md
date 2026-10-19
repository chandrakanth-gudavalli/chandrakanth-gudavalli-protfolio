# Docs — start here

Onboarding notes for anyone (human or Claude session) picking up this repo. `CLAUDE.md` at the root has the commands, architecture and hard rules; these docs cover what that file doesn't.

| Doc                                          | Read it when                                                                                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [repos-and-deploy.md](repos-and-deploy.md)   | You need to know which GitHub repo holds what, or you're deploying / updating the GitHub profile README.                                        |
| [editing-content.md](editing-content.md)     | You're changing site copy, publications, work cards or media.                                                                                   |
| [content-decisions.md](content-decisions.md) | Before touching anything about a specific paper, the resume or a card image — records choices the owner made that aren't obvious from the code. |
| [superpowers/](superpowers/)                 | Historical: the Oct 2026 rebuild design spec and implementation plan. Useful for _why_ the site looks the way it does; not kept up to date.     |

## Quick orientation

- Live site: https://www.chandrakanthgudavalli.com
- Owner: Chandrakanth Gudavalli (3D computer vision; Mayachitra + UCSB Vision Research Lab).
- Day-to-day work happens on the `bellerophon` branch; `main` is the default branch for PRs.
- Almost every request is a content edit → `src/content.js`, then `npm test`, then (with the owner's OK) `npm run deploy`.
- Legacy files from the old masterPortfolio site are still tracked (`Dockerfile`, `docker-compose.yaml`, `git_data_fetcher.mjs`, `images/`, `notebooks/`, `CODE_OF_CONDUCT.md`, the root `Resume__*.pdf` and `_Chandrakanth Gudavalli_ - _Google Scholar_.html`). The current site doesn't use them; `build_old/`, `build_pre_jan8th/` and `assets/` are git-ignored local folders.

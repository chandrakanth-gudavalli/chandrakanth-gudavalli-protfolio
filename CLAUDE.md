# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages (builds first, then deploys to gh-pages branch)
npm run deploy

# Run tests
npm test

# Run a single test file
npm test -- --testPathPattern="App.test"
```

Prettier runs automatically on staged files via a `pre-commit` husky hook (JS/CSS/MD files use `prettier --write`; JSON files use `prettier-package-json --write`).

## Architecture

This is a **React 16** single-page portfolio site bootstrapped with Create React App, deployed to GitHub Pages via `gh-pages`.

### Routing

Uses `HashRouter` from `react-router-dom` (hash-based URLs for GitHub Pages compatibility). Routes are defined in `src/containers/Main.js`:
- `/` and `/home` → Home (Greeting + Skills)
- `/experience` → Experience accordion
- `/education` → Education (degrees, certifications, competitive sites)
- `/opensource` → Opensource (GitHub charts, pull requests, issues)
- `/contact` → Contact
- `/projects` → Projects/Publications
- `/splash` → Splash screen (only active when `settings.isSplash = true`)

### Content Configuration — Single Source of Truth

**All portfolio content lives in `src/portfolio.js`**. This is the primary file to edit when updating personal information, experience, skills, projects, education, or contact data. Each exported object maps 1-to-1 to a page section.

The `settings.isSplash` flag in `portfolio.js` controls whether the site shows a splash screen on load.

### Component Structure

```
src/
  App.js                  # Root: ThemeProvider + GlobalStyles + Main
  global.js               # styled-components GlobalStyles (theme-driven body bg/text)
  theme.js                # Theme objects (blueTheme, redTheme, etc.); chosenTheme export
  portfolio.js            # ALL content data (greeting, skills, experience, education, etc.)
  containers/             # Smart components that consume portfolio.js data
    Main.js               # Router
    greeting/             # Hero section
    skills/               # Skills section + SVG illustrations (DataScienceImg, FullStackImg, etc.)
    experienceAccordion/  # Experience page accordion
    education/            # Education page
    certifications/       # Certifications cards
    projects/             # Projects/publications
    contact/              # Contact page
    blogs/, talks/, podcast/, achievement/, organizations/
    opensourceCharts/     # GitHub PR/issue charts using Chart.js
    pullRequests/, issues/
  components/             # Dumb/presentational components
    header/, footer/
    degreeCard/, certificationCard/, achievementCard/
    publicationsCard/, blogCard/, talkCard/
    githubRepoCard/, pullRequestCard/, issueCard/
    softwareSkills/, competitiveSites/, socialMedia/
    button/, topButton/, Loader/, seoHeader/
  pages/                  # Page-level wrappers that compose containers + components
    home/, education/, experience/, projects/, opensource/, contact/, splash/, errors/
  shared/
    experience_data.json  # Legacy experience data (not currently used in routing)
```

### Theming

`src/theme.js` exports multiple named theme objects (`blueTheme`, `brownTheme`, `purpleTheme`, etc.) and `chosenTheme`. To switch the site theme, change the `chosenTheme` export at the bottom of `theme.js`. All components receive `theme` as a prop from `App.js` → `Main.js` → pages → containers/components.

### SVG Illustrations

Skill section illustrations are React components rendering inline SVGs, located in `src/containers/skills/` (e.g., `DataScienceImg.js`, `FullStackImg.js`, `SfmImage.js`). The `fileName` field in each `skills.data` entry in `portfolio.js` maps to which SVG component is rendered.

### GitHub Data (Opensource Page)

The opensource page fetches live GitHub data via Apollo Client (GraphQL). The relevant containers are `opensourceCharts/`, `pullRequests/`, and `issues/`.

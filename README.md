# Build and Deploy a 3D Developer Portfolio (React + Three.js)

Interactive portfolio based on [adrianhajdin/3D_portfolio](https://github.com/adrianhajdin/3D_portfolio), configured for **GitHub Pages**.

Live site: [https://gunjanportfolio.github.io](https://gunjanportfolio.github.io)

## Features

- 3D floating island scene (drag to rotate, stages with CTAs)
- Animated plane, bird, and sky
- Contact page with interactive fox ([Formcarry](https://formcarry.com))
- About (skills + experience timeline) and Projects pages
- Sakura ambient music toggle
- GitHub Pages deploy via GitHub Actions

## Quick start

```bash
npm install
npm run dev
```

Edit `src/config/site.js` for name, bio, LinkedIn, Formcarry endpoint, and email. Update `src/constants/index.js` for skills, experience, projects, and social links.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build + `404.html` for SPA on GitHub Pages |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests |
| `npm run test:coverage` | Coverage (target ≥ 80% on included files) |
| `npm run deploy` | Optional manual deploy with `gh-pages` |

## GitHub Pages

This project deploys to the user site repo [`gunjanportfolio/gunjanportfolio.github.io`](https://github.com/gunjanportfolio/gunjanportfolio.github.io) (base path `/`).

1. Push to `main` on that repository.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Site URL: `https://gunjanportfolio.github.io`

### Manual deploy

```bash
VITE_BASE_PATH=/ npm run deploy
```

## Contact form (Formcarry)

The contact form posts to [Formcarry](https://formcarry.com/s/BO_V3AU0Jro). Endpoint is configured in `src/config/site.js` as `FORMCARRY_ENDPOINT`.

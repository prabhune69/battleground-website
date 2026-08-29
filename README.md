# BattleGround Fitness Club — Website

The official website for **BattleGround Fitness Club**, a gym in Jogeshwari
East, Mumbai.

🔗 **Live:** https://www.battlegroundfitness.in

## Tech stack

- **Static HTML / CSS / JS** — no framework, no bundler, no build step.
- Hosted on **Cloudflare Pages**, deployed straight from the `main` branch.
- **Backend (when added):** Cloudflare Pages Functions under `functions/`,
  written in TypeScript. See [`functions/api/README.md`](functions/api/README.md).

## Folder layout

```
/
├── index.html            # Homepage
├── assets/
│   ├── css/styles.css     # Site styles
│   ├── js/main.js         # Site scripts (currently a placeholder)
│   └── images/logo.jpeg   # Logo
├── functions/
│   └── api/README.md      # How Pages Functions map to /api/* endpoints
├── robots.txt
├── sitemap.xml
├── .gitignore
└── README.md
```

## Preview locally

It's a plain static site — open `index.html` directly in a browser, or serve
the folder over HTTP so relative paths behave exactly like production:

```bash
# Python (bundled on macOS)
python3 -m http.server 8080
# then visit http://localhost:8080
```

Any static file server works (`npx serve`, VS Code Live Server, etc.). No
install or build is required.

## Deploy

Deployment is automatic. **Push to `main`** and Cloudflare Pages builds and
publishes the site:

```bash
git add .
git commit -m "Your change"
git push origin main
```

Cloudflare Pages settings: **build command** — none; **build output
directory** — `/` (the repo root is served as-is).

# CXI — Candidate Experience Intelligence (Demo)

A greenfield, demo-first build that **shows** NSS, VADER, and ABSA in action with a cinematic “Magic Mode” UI. It’s Netlify-perfect, iPhone/Safari-safe, and ships with serverless functions for streaming analysis, PDF export, and a Slack/Teams **dry-run** digest preview.

## What’s inside
- **Magic Mode UI**: matrix ambient background, type-on token stream, word-level polarity (green/red/amber), aspect meters, gauges.  
- **Deterministic build**: Node 22, `npm ci`, single `netlify.toml`, static publish to `dist/`.  
- **Functions**:
  - `healthz` — liveness probe  
  - `analyzer` — mock token emitter used by stream  
  - `stream-analysis` — SSE token stream (drives the animation)  
  - `export-pdf` — one-pager PDF of scores/aspects  
  - `digest` — Slack/Teams **dry-run** digest (returns preview payload; no webhooks needed)
- **CI**: Playwright smoke + **Netlify Dev** in CI so Functions are exercised (WebKit-friendly).

---

## Quick start (local)

```bash
# macOS with Homebrew (Node 22)
brew install node@22
echo 'export PATH="$(brew --prefix)/opt/node@22/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

# install & build
npm ci
npm run build

# run with Netlify Dev so functions work
npm i -D netlify-cli
npx netlify dev --port 8888 --dir dist --functions netlify/functions
```

Open http://localhost:8888

### Test endpoints

```bash
curl http://localhost:8888/.netlify/functions/healthz
curl -N http://localhost:8888/.netlify/functions/stream-analysis | head
```

---

## Scripts

```json
"clean": "rm -rf dist && mkdir -p dist/assets",
"build": "npm run clean && node scripts/build.mjs",
"test:smoke": "playwright test -g '@smoke'"
```

`scripts/build.mjs` bundles `src/demo/index.tsx` → `dist/assets/index.js`, copies `src/index.html`, `src/css/app.css`, and `_redirects`.

---

## Project structure

```
netlify.toml
_redirects
scripts/build.mjs
src/
  index.html
  css/app.css
  boot/guardrails.ts
  demo/CxiMagicDemo.tsx
  demo/index.tsx
netlify/functions/
  healthz.ts
  analyzer.ts
  stream-analysis.ts
  export-pdf.ts
  digest.ts
tests/smoke.spec.ts
```

---

## CI (GitHub Actions)

We run Netlify Dev in CI so Functions are available during smoke tests.

```yaml
name: CI
on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx netlify dev -c "npm run build" --port 8888 --dir dist --functions netlify/functions & echo $! > .netlify.pid
      - run: |
          for i in {1..30}; do
            curl -sf http://localhost:8888/.netlify/functions/healthz && break
            sleep 1
          done
      - run: BASE_URL=http://localhost:8888 npm run test:smoke
      - run: kill $(cat .netlify.pid) || true
```

---

## Netlify deploy

**Site config**
- Build command: `npm ci && npm run build`  
- Publish directory: `dist`  
- Functions directory: `netlify/functions`

**Domain cutover**
- In Netlify: either switch the existing site’s **Linked repository** to this repo, or attach your domain (e.g., `cxis.today`) to the new site and detach the old. No DNS edits needed inside Netlify.

---

## Demo buttons (no secrets required)

- **Export sample PDF** → generates a one-pager via `/.netlify/functions/export-pdf`.  
- **Send digest (Slack/Teams)** → calls `/.netlify/functions/digest?dry=1` and shows a **preview modal** (no webhooks needed).  
- **Send via Email** → opens a prefilled mail draft (mailto).

To enable real Slack/Teams later: set `SLACK_WEBHOOK_URL` / `TEAMS_WEBHOOK_URL` in Netlify.

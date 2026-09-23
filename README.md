# rostmi.uz

A map of the places our team has actually visited and rated. Click a pin to see our rating, photos, and the Instagram video from the visit. Locked to Tashkent, Uzbekistan.

Two separate sites, two separate deploys:
- **`web/`** — the public map. No auth. Meant to be found and indexed.
- **`admin/`** — the internal panel for adding/editing places. Login-gated, and blocked from search/AI crawlers (`robots.txt` disallow-all, `noindex` meta tags, `X-Robots-Tag` header).

Each app keeps its own copy of the Firebase/Firestore client and shared types under `src/lib/` — there's no shared package, so keep both copies in sync by hand when the data model changes.

Stack: Next.js (static export) × 2 + **MapLibre GL JS** + **OpenFreeMap** tiles (free, no API key, no usage limits — see [openfreemap.org](https://openfreemap.org)) + Firebase (Firestore + Auth + Hosting, two Hosting sites in one project).

## One-time setup

1. In the [Firebase console](https://console.firebase.google.com), create/open the `rostmiuz` project, then:
   - Add a **Web app** and copy its config values.
   - Enable **Firestore** (production mode).
   - Enable **Authentication → Email/Password**, then add an account for each teammate under Authentication → Users. These accounts log into the admin site.
2. Copy `.env.local.example` to `.env.local` inside **both** `web/` and `admin/`, and fill in the Firebase config values (identical in both — no map API key needed at all).
3. Run `firebase login`, then `firebase use --add` and pick the `rostmiuz` project.
4. Deploy the Firestore rules once: `firebase deploy --only firestore:rules`.

This repo already has two Firebase Hosting sites and targets set up: `rostmiuz` (public) and `rostmiuz-admin` (admin), mapped via `.firebaserc`.

## Local development

```bash
npm install       # installs both workspaces (web, admin) from the repo root
npm run dev        # runs both apps together: :3000 (web) and :3001 (admin)
npm run dev:web     # just the public map
npm run dev:admin   # just the admin panel
```

## Adding places

Sign in on the admin site with a teammate account, then "Add place": set name, description, your rating (0–10), click the mini-map (or use the locate-me button) to drop the pin, paste image URLs you've found/saved, and paste the Instagram post URL. Use "Preview" to see how it'll look before saving. It shows up on the public map immediately (Firestore has no separate publish step).

## Deploy

```bash
npm run deploy         # builds + deploys both sites
npm run deploy:web      # just the public map
npm run deploy:admin    # just the admin panel
```

To go live at `rostmi.uz` (public) and an admin subdomain (e.g. `admin.rostmi.uz`), add each as a custom domain under Hosting → the matching site in the Firebase console, and follow its DNS verification steps.

## Data model

Each place is split across two Firestore documents so the public map's initial load stays light (Firestore always returns whole documents — there's no way to fetch only some fields):
- `places/{id}` — pin fields only: name, lat, lng, rating, thumbnailUrl (mirrors the first photo). This is all `/` fetches for every place.
- `places/{id}/detail/full` — everything else: description, address, images, Instagram URL. Fetched once, only when a pin is actually selected.

## Repo layout

```
web/                public map app (own package.json, own Next.js app)
admin/              admin app (own package.json, own Next.js app)
firebase.json       hosting config for both sites + Firestore rules
firestore.rules     public read, auth-required write
```

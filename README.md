# OWPL CFS Website

Corporate website for **Overseas Warehousing Pvt. Ltd.**, operator of **CFS-OWPL** — North India's leading Container Freight Station.

## Tech Stack
- Node.js + Express (MVC)
- EJS templating with `express-ejs-layouts`
- Tailwind CSS (via CDN — see "Moving to a production Tailwind build" below)
- Vanilla JS (no jQuery)
- AOS for scroll animations, Lucide for icons
- EmailJS for the contact form (no backend mail server needed)
- Helmet, compression, rate limiting for security/performance

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev      # nodemon, auto-restart
# or
npm start
```

Visit http://localhost:3000

## Project Structure

```
owpl/
├── server.js              # App entry point
├── config/site.js         # Single source of truth for company info — edit here
├── controllers/           # Route handlers + per-page SEO meta
├── routes/pages.js        # Public site routes
├── routes/future.js       # Reserved routes for planned modules (tracking, portals, etc.)
├── middleware/security.js # Helmet CSP + rate limiting
├── data/                  # services.js, notices.json — swap for a DB later
├── views/
│   ├── layouts/main.ejs   # Shared HTML shell (SEO head, preloader, header, footer)
│   ├── partials/          # header, footer, preloader, breadcrumb
│   └── pages/             # One file per page
├── public/
│   ├── css/style.css      # Preloader animation + small utilities (Tailwind handles the rest)
│   ├── js/main.js         # Preloader, header scroll, mobile menu, counters, gallery, notice search
│   ├── js/contact.js      # EmailJS wiring + form validation/toast/success screen
│   ├── images/            # Placeholder images — replace with real photography
│   └── pdf/                # Placeholder tariff/notice PDFs — replace with real documents
├── future/                # Empty, reserved folders for tracking/customer/employee/admin modules
├── models/ database/ services/ utils/ logs/   # Reserved for when a real DB/ORM is added
```

## Before Going Live

1. **Replace placeholder content**
   - Swap every file in `public/images/` for real photography (warehouse, yard, containers, office).
   - Replace `public/pdf/owpl-tariff.pdf` and the notice PDFs in `data/notices.json` with real documents.
   - Fill in the real phone number in `config/site.js` (`phonePlaceholder`) and the Google Maps embed (search `Google Map Placeholder` in `views/pages/home.ejs` and `contact.ejs`).

2. **Wire up EmailJS**
   - Create a free account at emailjs.com, add a Service + Template.
   - Put your Public Key / Service ID / Template ID into `public/js/contact.js` (top of file).

3. **Moving to a production Tailwind build (recommended)**
   The site currently loads Tailwind from the CDN (`cdn.tailwindcss.com`) for fast iteration — this is *not* recommended for production (larger payload, no purging). Before launch:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   Then move the `tailwind.config` block out of `views/layouts/main.ejs` into `tailwind.config.js`, build a compiled `public/css/tailwind.css`, and drop the `<script src="https://cdn.tailwindcss.com">` tag.

4. **Update `.env`** with your real `SITE_URL`, and update `robots.txt` / `sitemap.xml` if the domain differs.

5. **Add a real CAPTCHA** (reCAPTCHA v3 or hCaptcha) in place of the placeholder checkbox on the contact form.

## Animations Added

- **Particle background (hero)** — tsParticles, loaded via CDN. I couldn't verify "Casberry" as a general-purpose embeddable library (what I found under that name is a standalone 3D visualization tool, not an npm/CDN package), so I substituted the standard, actively-maintained particle library that produces the same subtle floating-particle effect. Config lives in `public/js/main.js` under "tsParticles hero background" — tweak colors/count/speed there.
- **Container drop & stack (home page, below hero)** — replaces the old image grid. Four "containers" fall from above and stack on top of each other on scroll, built with GSAP + ScrollTrigger (`#container-stack` in `views/pages/home.ejs`, animation logic in `public/js/main.js`).
- **Trailer animation (Road Connectivity page)** — a truck icon drifts back and forth along the route line (`.trailer-icon` / `trailerDrive` keyframes in `public/css/style.css`).
- **Train animation (Rail Connectivity page)** — a bobbing train icon plus pulsing connector lines (`.train-icon`, `.rail-pulse`).
- **daisyUI** — added via CDN stylesheet, used for form controls/badges/buttons in the new admin panel (`input`, `select`, `btn`, `badge` classes). Works alongside the Tailwind CDN with no build step.
- **OriginUI** wasn't used directly — it's a React/shadcn snippet library that requires a React build pipeline, which this project doesn't use (EJS + vanilla JS). The admin panel and form styling were hand-built with Tailwind + daisyUI to achieve a comparable polished look.

## Notice Board Uploads (New: Admin Panel)

Notices can now be published without touching code:

1. Set `ADMIN_USER` and `ADMIN_PASSWORD` in `.env`.
2. Visit `http://localhost:3000/admin/notices` — your browser will prompt for the credentials (HTTP Basic Auth, no extra login page needed).
3. Fill in the form (title, date, category, description, optional PDF) and submit. The PDF is saved to `public/pdf/` and linked automatically; the notice is written to `data/notices.json` and appears immediately on the public `/notices` page and the home page preview — no restart needed.
4. Existing notices can be pinned/unpinned or deleted from the same screen.

This uses flat-file storage (`data/notices.json`) and simple Basic Auth — intentionally lightweight so it works out of the box. Before exposing this publicly on the internet, put it behind HTTPS (Basic Auth sends credentials base64-encoded, not encrypted) and consider swapping to a real database + session-based login if more than one person will manage notices.

### Storage lifecycle (what happens as PDFs pile up)

- **Deleting a notice now also deletes its PDF file** (locally, or from your S3 bucket if cloud storage is enabled) — no more orphaned files piling up on disk.
- **The admin list is paginated** (10 per page) so it stays fast and readable even with hundreds of notices.
- **`public/pdf/` and `public/uploads/` are gitignored** — uploaded files are runtime data, not source code, and should never bloat your git history. `.gitkeep` files keep the folders present in a fresh clone.
- Disk usage on the app itself is otherwise unaffected either way — PDFs are served as static files, never loaded into memory or processed by the app.

### Cloud storage for PDF uploads (required for Vercel/serverless)

`utils/storage.js` supports two backends:

- **Local disk** (default) — writes to `public/pdf/`. Fine for a normal server, a VPS, or localhost. **Will NOT work on Vercel or other serverless hosts** — their filesystem is read-only outside `/tmp`, and `/tmp` is wiped between invocations, so anything uploaded through the admin panel vanishes.
- **S3-compatible cloud storage** (opt-in) — set the `S3_*` variables in `.env` (see `.env.example`) and uploads go to a real bucket instead. Works with AWS S3, Cloudflare R2, Backblaze B2, or anything else S3-compatible. Run `npm install @aws-sdk/client-s3` once you enable this.

If you're deploying to Vercel, cloud storage isn't optional — configure it before relying on the upload form there.

**A note on "free" providers and credit cards:** Backblaze B2, Cloudflare R2, and Vercel Blob all require a payment method on file as an anti-abuse measure, even though usage within their free tier costs $0. If you'd rather avoid that, use **Supabase Storage** instead (below) — genuinely free, no card required, and it has an S3-compatible API so it works with the exact same code, no changes needed.

### Supabase Storage setup (step by step) — no credit card required

1. Create a free project at [supabase.com](https://supabase.com) (email signup only, no card).
2. In the project, go to **Storage** → **Create a new bucket**. Name it (e.g. `owpl-notices`) and toggle it **Public** — same reasoning as below: these are non-sensitive tariff/notice PDFs, and Public means direct links work without extra signing code.
3. Go to **Storage → Settings** (or **Project Settings → Storage**, depending on Supabase's current UI) and enable/find the **S3 Connection** section. Generate **S3 Access Keys** there — this gives you an Access Key ID and Secret Access Key.
4. Note your **Project Reference** (visible in the project URL, e.g. `abcdefghijk` in `https://abcdefghijk.supabase.co`) and your **Project Region** (Project Settings → General).
5. Fill in `.env`:
   ```
   S3_BUCKET=owpl-notices
   S3_REGION=<your project region, e.g. us-east-1>
   S3_ACCESS_KEY_ID=<from step 3>
   S3_SECRET_ACCESS_KEY=<from step 3>
   S3_ENDPOINT=https://<project-ref>.supabase.co/storage/v1/s3
   S3_PUBLIC_URL_BASE=https://<project-ref>.supabase.co/storage/v1/object/public/owpl-notices
   ```
   Unlike Backblaze, **`S3_PUBLIC_URL_BASE` must be set explicitly here** — Supabase's public file URLs don't follow the generic virtual-hosted-style pattern the code defaults to, so leaving it blank would produce broken links. Use the endpoint exactly as `https://<project-ref>.supabase.co/storage/v1/s3` — Supabase's own dashboard sometimes shows a `<project-ref>.storage.supabase.co` variant, but the plain form above is the one documented to work with generic S3 SDKs; if you copy the other variant and hit a TLS/SSL handshake error, switch to this one.
6. `npm install @aws-sdk/client-s3`
7. `npm run dev`, visit `/admin/notices`, publish a test notice with a PDF, and confirm the link opens correctly and points to your Supabase project's URL.
8. If deploying to Vercel, add the same `S3_*` variables in the Vercel project's environment variable settings.

**If you hit `write EPROTO ... SSL routines:ssl3_read_bytes:... SSL alert number 40` (handshake failure):** this means the S3 client tried "virtual-hosted-style" addressing (`bucket-name.your-endpoint`), which Supabase's S3 gateway doesn't support — there's no valid TLS certificate for that made-up hostname. `utils/storage.js` sets `forcePathStyle: true` specifically to prevent this; if you're still seeing it, double-check you're running the current version of that file and that `S3_ENDPOINT` doesn't already have a bucket name prepended to it.

### Backblaze B2 setup (step by step)

1. In the B2 console, go to **Buckets → Create a Bucket**.
   - Bucket name must be globally unique across all Backblaze accounts — something like `yourcompany-owpl-notices` rather than just `owpl-notices`.
   - Set **Files in Bucket** to **Public** — the notice/tariff PDFs aren't sensitive, and Public means the site can link straight to them (matches how the code already works). Private would require generating signed URLs on every request, which isn't built.
   - Leave Default Encryption and Object Lock off (not needed here).
2. After creation, open the bucket and note the **Endpoint** shown, e.g. `s3.us-west-004.backblazeb2.com`. The part between `s3.` and `.backblazeb2.com` (e.g. `us-west-004`) is your region.
3. Go to **Application Keys → Add a New Application Key**.
   - Name it something like `owpl-website`.
   - Under **Allow access to Bucket(s)**, restrict it to the bucket you just created (not "All").
   - Leave capabilities at the default (read + write + delete) — the admin panel's delete-on-remove feature needs delete access.
   - Click **Create New Key**. The `keyID` and `applicationKey` are shown **once** — copy them straight into your `.env` file, not anywhere else (don't paste the `applicationKey` into chat, a doc, or commit it to git).
4. Fill in `.env`:
   ```
   S3_BUCKET=yourcompany-owpl-notices
   S3_REGION=us-west-004
   S3_ACCESS_KEY_ID=<the keyID from step 3>
   S3_SECRET_ACCESS_KEY=<the applicationKey from step 3>
   S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
   ```
   (Leave `S3_PUBLIC_URL_BASE` blank — `utils/storage.js` derives the public URL from `S3_ENDPOINT` automatically.)
5. `npm install @aws-sdk/client-s3`
6. `npm run dev`, visit `/admin/notices`, and publish a test notice with a PDF. The banner at the top of the admin page should switch to "Cloud storage (S3) active," and the notice's "View attached PDF" link should point to your B2 bucket's URL and open the file in a new tab.
7. If deploying to Vercel, add the same `S3_*` variables in the Vercel project's environment variable settings (not `.env` — Vercel doesn't read that file).

## Deploying to Vercel

This is a plain Express app (`app.listen()`), not a Next.js project, so Vercel needs to be told explicitly how to run it — otherwise some routes may 404 or behave inconsistently even while others "work":

1. **`vercel.json`** (included) tells Vercel to treat `server.js` as a serverless function and route every request through it.
2. **`server.js`** now exports the app (`module.exports = app`) and only calls `app.listen()` when run directly — Vercel imports the export and calls it per-request itself; it never runs `app.listen()`.
3. **Set your environment variables** in the Vercel project settings (Settings → Environment Variables) — `.env` files aren't read on Vercel. At minimum: `ADMIN_USER`, `ADMIN_PASSWORD`, and the `S3_*` cloud storage variables (see above — required here, since local disk uploads won't persist).
4. Redeploy after adding `vercel.json` and the env vars — a deploy from before these existed won't pick them up retroactively.

If `/admin/notices` (or any route) still 404s after this, check the Vercel deployment's build/function logs — that will show whether the function is erroring out (e.g. a missing env var) rather than the route being unreachable.

## Adding Future Modules

The brief calls out a long list of future features (container tracking, customer/employee portals, invoice downloads, blog, careers, etc.). These are intentionally **not built yet** — building them now would mean guessing at requirements. Instead:

- `routes/future.js` reserves the URL space and currently renders a "coming soon" page for each.
- `future/{tracking,customer,employee,admin}/README.md` outlines the suggested next steps for each module.
- When you're ready to build one, add a real route/controller/model/view for it — the rest of the app (layout, header, footer, SEO setup) needs no changes.

## Notice Board & Tariff (content management)

Notices currently live in `data/notices.json` and services in `data/services.js` — flat files, not a database. This was a deliberate choice: it keeps the demo runnable with zero setup. When you're ready to let non-developers manage notices/tariffs, swap these for a database (e.g. `mongodb`/`postgres` in `database/`) and a small authenticated admin route in `future/admin/`.

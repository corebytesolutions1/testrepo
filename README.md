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

## Adding Future Modules

The brief calls out a long list of future features (container tracking, customer/employee portals, invoice downloads, blog, careers, etc.). These are intentionally **not built yet** — building them now would mean guessing at requirements. Instead:

- `routes/future.js` reserves the URL space and currently renders a "coming soon" page for each.
- `future/{tracking,customer,employee,admin}/README.md` outlines the suggested next steps for each module.
- When you're ready to build one, add a real route/controller/model/view for it — the rest of the app (layout, header, footer, SEO setup) needs no changes.

## Notice Board & Tariff (content management)

Notices currently live in `data/notices.json` and services in `data/services.js` — flat files, not a database. This was a deliberate choice: it keeps the demo runnable with zero setup. When you're ready to let non-developers manage notices/tariffs, swap these for a database (e.g. `mongodb`/`postgres` in `database/`) and a small authenticated admin route in `future/admin/`.

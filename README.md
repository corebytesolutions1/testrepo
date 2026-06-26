# CoreByte Solutions — Website

**Domain:** [corebytex.com](https://corebytex.com)

Premium website for CoreByte Solutions — web/software development + global trading.

---

## ⚡ Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
```

---

## 📧 EmailJS Setup (Contact Form)

The contact form uses [EmailJS](https://emailjs.com) — free up to 200 emails/month, no backend required.

### Step 1 — Create a free account
Go to → [https://emailjs.com](https://emailjs.com)

### Step 2 — Add an Email Service
Dashboard → **Email Services** → Add Service (Gmail, Outlook, etc.) → note the **Service ID** (`service_xxxxxxx`)

### Step 3 — Create an Email Template
Dashboard → **Email Templates** → Create Template

Paste this template body:
```
New enquiry from {{from_name}} ({{from_email}})
Phone: {{from_phone}}
Service: {{service}}

Message:
{{message}}
```
Set **Reply To** field to: `{{reply_to}}`
Note the **Template ID** (`template_xxxxxxx`)

### Step 4 — Get your Public Key
Dashboard → **Account** → **API Keys** → copy **Public Key**

### Step 5 — Paste into main.js
Open `public/js/main.js` and replace the three placeholders at the top:

```js
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← paste here
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← paste here
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← paste here
```

---

## 🗺 SEO Features

| Feature | File |
|---|---|
| Full meta tags (OG, Twitter, geo) | `public/index.html` |
| JSON-LD structured data (Org, WebSite, LocalBusiness) | `public/index.html` |
| XML Sitemap | `public/sitemap.xml` |
| Styled Sitemap (XSL) | `public/sitemap.xsl` |
| Robots.txt | `public/robots.txt` |
| PWA Manifest | `public/site.webmanifest` |

After deploying, submit `https://corebytex.com/sitemap.xml` to:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B — GitHub → Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Click **Deploy** (Vercel auto-detects Node.js)
4. Go to **Domains** → add `corebytex.com`

---

## 📁 Project Structure

```
corebyte-solutions/
├── server.js              # Express server
├── package.json
├── vercel.json            # Vercel config
├── .gitignore
├── README.md
└── public/
    ├── index.html         # Main page (full SEO, EmailJS form)
    ├── sitemap.xml        # XML sitemap
    ├── sitemap.xsl        # Styled sitemap viewer
    ├── robots.txt         # Crawler rules
    ├── site.webmanifest   # PWA manifest
    ├── css/
    │   └── style.css
    └── js/
        └── main.js        # Doodles + EmailJS + interactions
```

---

© 2025 CoreByte Solutions · corebytex.com

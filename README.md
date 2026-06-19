# Wahenoor Exports Limited — Official Website
**Domain:** welexports.com | **Stack:** Node.js + Express + EJS

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev      # with nodemon (auto-reload)
# or
npm start        # standard start

# 3. Visit http://localhost:3000
```

> **Note:** CSS/JS files are versioned with a cache-busting query string that updates on every server restart, so you'll always see the latest styles after running `npm start`/`npm run dev` again. If you ever still see old styling, do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) to clear the browser's cache.

---

## 📧 EmailJS Setup (Contact Form)

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create a **Service** (Gmail, Outlook, or SMTP)
3. Create an **Email Template** with these variables:
   - `{{from_name}}` — Sender's name
   - `{{company}}` — Company name
   - `{{reply_to}}` — Sender's email
   - `{{phone}}` — Phone number
   - `{{commodity}}` — Commodity type
   - `{{trade_type}}` — Buyer/Seller
   - `{{quantity}}` — Estimated quantity
   - `{{message}}` — Message body
4. Open `public/js/main.js` and replace:
   ```js
   emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');   // → Your Public Key
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', ...)  // → Your IDs
   ```

---

## 📜 Certificates — Viewing, Downloading & Adding New Ones

Four placeholder certificate PDFs are already wired up and downloadable from the live site:

- `public/certificates/certificate-of-incorporation.pdf`
- `public/certificates/waste-carrier-licence.pdf`
- `public/certificates/eori-registration.pdf`
- `public/certificates/vat-registration.pdf`

**⚠️ These are placeholders** — generated documents marking where each real certificate should go. Replace them with the company's actual scanned PDFs **using the exact same filenames**, and the "View / Download" buttons on the site will immediately serve the real documents — no code changes needed.

### To add a brand-new certificate

1. Drop the file (PDF or image) into `public/certificates/`
2. Open `views/index.ejs`, find the `#certificates` section, and copy an existing `.cert-card` block:

```html
<div class="cert-card">
  <div class="cert-icon"><i class="fas fa-certificate"></i></div>
  <div class="cert-body">
    <div class="cert-issuer">Issuing Body Name</div>
    <h3 class="cert-name">Certificate Title</h3>
    <p class="cert-desc">Description of what this certificate covers.</p>
    <div class="cert-footer">
      <div class="cert-tag">Category Label</div>
      <a href="/certificates/your-file.pdf" target="_blank" rel="noopener" class="cert-download" download>
        <i class="fas fa-download"></i> View / Download
      </a>
    </div>
  </div>
</div>
```

3. Update the `href` to match your filename in `public/certificates/`

---

## 🌐 Deployment — Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard if needed
```

`vercel.json` is included for proper routing.

---

## 🌐 Deployment — GitHub + VPS / Railway / Render

```bash
git init
git add .
git commit -m "Initial commit — Wahenoor Exports website"
git remote add origin https://github.com/YOUR_USERNAME/wahenoor-exports.git
git push -u origin main
```

Then connect your repo to Railway, Render, or your VPS with `npm start`.

---

## 📁 Project Structure

```
wahenoor/
├── server.js              # Express server, routing, SEO endpoints
├── package.json
├── vercel.json
├── views/
│   ├── index.ejs          # Main page
│   └── 404.ejs            # 404 page
└── public/
    ├── css/
    │   └── style.css      # All styles
    ├── js/
    │   └── main.js        # Canvas, animations, form, nav
    ├── images/            # Add logo.png, og-image.jpg, favicon.ico
    └── certificates/      # Add certificate PDF/image files here
```

---

## 🔧 Customisation Checklist

- [ ] Update WhatsApp number: search `447000000000` → replace with real number
- [ ] Update email: `info@welexports.com` → real email
- [ ] Add company registration number in footer
- [ ] Add real address details
- [ ] Replace `YOUR_EMAILJS_*` keys in `main.js`
- [ ] Add `logo.png` (512×512) to `public/images/`
- [ ] Add `og-image.jpg` (1200×630) for social sharing
- [ ] Add `favicon.ico` to `public/images/`
- [ ] Upload real certificates to `public/certificates/`
- [ ] Update Companies House number if desired

---

## ✅ Features Included

- **SEO**: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Sitemap**: `/sitemap.xml` (auto-generated)
- **Robots.txt**: `/robots.txt`
- **Contact Form**: EmailJS with full validation
- **WhatsApp Button**: Floating CTA with pulse animation
- **World Map Canvas**: Animated trade route visualisation
- **Dark Premium UI**: Navy/Gold/Silver palette, Playfair Display typography
- **Certificates Section**: Expandable, easy to add new certs
- **Responsive**: Mobile-first, tested across breakpoints
- **Performance**: Compression, Helmet security headers, static caching
- **Accessibility**: ARIA labels, keyboard focus, reduced-motion support
- **Back to Top**: Smooth scroll button
- **Ticker Bar**: Scrolling commodity types
- **Counter Animation**: Stats animate on scroll
- **Scroll Reveal**: AOS-style animations (custom, no library)

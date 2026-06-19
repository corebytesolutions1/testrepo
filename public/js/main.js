/* ============================================================
   WAHENOOR EXPORTS LIMITED — main.js
   ============================================================ */

// ---- Preloader ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// ---- EmailJS Init ----
// Replace with your actual EmailJS public key
if (typeof emailjs !== 'undefined') {
  emailjs.init('d3vcVEQLyUoc76_t9');
} else {
  console.warn('EmailJS failed to load — contact form will show a fallback error on submit.');
}

// ---- Navbar Scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Mobile Nav Toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- Back to Top ----
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}, { passive: true });
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => {
  revealObserver.observe(el);
});

// ---- World Map Canvas (Hero) ----
(function initWorldCanvas() {
  const canvas = document.getElementById('worldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Simplified dot-grid world map approximation
  // Key coordinate clusters representing landmasses
  const landDots = [];
  const W = () => canvas.width;
  const H = () => canvas.height;

  function generateDots() {
    landDots.length = 0;
    const w = W(), h = H();
    const spacing = Math.max(16, Math.floor(w / 80));
    // We create a simplified geographic point cloud
    const regions = [
      // UK / Europe
      { x: 0.49, y: 0.3, w: 0.07, h: 0.12 },
      { x: 0.5, y: 0.28, w: 0.1, h: 0.18 },
      // North America
      { x: 0.15, y: 0.2, w: 0.18, h: 0.22 },
      // South America
      { x: 0.24, y: 0.5, w: 0.1, h: 0.28 },
      // Africa
      { x: 0.5, y: 0.42, w: 0.09, h: 0.32 },
      // Middle East / Asia
      { x: 0.58, y: 0.28, w: 0.28, h: 0.22 },
      // South Asia
      { x: 0.64, y: 0.38, w: 0.08, h: 0.12 },
      // SE Asia / East Asia
      { x: 0.74, y: 0.32, w: 0.14, h: 0.2 },
      // Australia
      { x: 0.76, y: 0.62, w: 0.1, h: 0.12 },
      // Russia / N Asia
      { x: 0.56, y: 0.14, w: 0.32, h: 0.15 },
    ];

    for (const r of regions) {
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          const nx = x / w, ny = y / h;
          if (nx >= r.x && nx <= r.x + r.w && ny >= r.y && ny <= r.y + r.h) {
            if (Math.random() < 0.65) {
              landDots.push({ x, y, alpha: 0.15 + Math.random() * 0.25 });
            }
          }
        }
      }
    }
  }

  generateDots();
  window.addEventListener('resize', () => { generateDots(); }, { passive: true });

  // Trade route pulses: origin = UK (approx center of canvas)
  const routes = [
    { tx: 0.24, ty: 0.55 }, // South America
    { tx: 0.52, ty: 0.56 }, // Africa
    { tx: 0.62, ty: 0.4  }, // Middle East
    { tx: 0.67, ty: 0.44 }, // South Asia
    { tx: 0.78, ty: 0.35 }, // East Asia
    { tx: 0.17, ty: 0.32 }, // North America
    { tx: 0.78, ty: 0.66 }, // Australia
  ];

  const pulses = routes.map((r, i) => ({
    route: r,
    t: (i / routes.length),
    speed: 0.004 + Math.random() * 0.002,
    size: 0,
    maxSize: 6,
  }));

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);

    // Draw land dots
    for (const dot of landDots) {
      ctx.beginPath();
      ctx.arc(dot.x * (w / (w)), dot.y * (h / (h)), 1.5, 0, Math.PI * 2);
      // Recalculate positions based on current canvas size
      ctx.fillStyle = `rgba(245,194,66,${dot.alpha})`;
      ctx.fill();
    }

    // Origin: UK position
    const ox = w * 0.502;
    const oy = h * 0.305;

    // Draw trade routes
    for (const p of pulses) {
      const tx = w * p.route.tx;
      const ty = h * p.route.ty;

      // Route line
      const grad = ctx.createLinearGradient(ox, oy, tx, ty);
      grad.addColorStop(0, 'rgba(245,194,66,0.4)');
      grad.addColorStop(0.5, 'rgba(245,194,66,0.15)');
      grad.addColorStop(1, 'rgba(245,194,66,0.4)');
      ctx.beginPath();
      ctx.moveTo(ox, oy);

      // Bezier curve for arc effect
      const mx = (ox + tx) / 2;
      const my = Math.min(oy, ty) - Math.abs(tx - ox) * 0.25;
      ctx.quadraticCurveTo(mx, my, tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving pulse dot along route
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const px = bezierPoint(ox, mx, tx, p.t);
      const py = bezierPoint(oy, my, ty, p.t);

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,194,66,0.9)';
      ctx.fill();

      // Destination dot
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,194,66,0.5)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,194,66,1)';
      ctx.fill();
    }

    // Origin dot (UK) — glowing
    const now = Date.now() / 1000;
    const pulse = 0.5 + 0.5 * Math.sin(now * 2);
    ctx.beginPath();
    ctx.arc(ox, oy, 8 + pulse * 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,194,66,${0.05 + pulse * 0.08})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245,194,66,0.8)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#F5C242';
    ctx.fill();

    requestAnimationFrame(draw);
  }

  function bezierPoint(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  requestAnimationFrame(draw);
})();

// ---- Mini Map Canvas (Reach Section) ----
(function initMiniMap() {
  const canvas = document.getElementById('miniMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const cities = [
    { name: 'London', x: 0.48, y: 0.28, home: true },
    { name: 'Dubai', x: 0.62, y: 0.42 },
    { name: 'Mumbai', x: 0.66, y: 0.46 },
    { name: 'Shanghai', x: 0.78, y: 0.35 },
    { name: 'Lagos', x: 0.5, y: 0.54 },
    { name: 'New York', x: 0.21, y: 0.32 },
    { name: 'Rotterdam', x: 0.51, y: 0.27 },
    { name: 'Singapore', x: 0.74, y: 0.52 },
  ];

  let frame = 0;
  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(245,194,66,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const home = cities.find(c => c.home);
    const hx = home.x * w, hy = home.y * h;

    // Draw connections
    cities.filter(c => !c.home).forEach((city, i) => {
      const cx = city.x * w, cy = city.y * h;
      const t = ((frame / 80 + i / cities.length) % 1);

      // Line
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      const mx = (hx + cx) / 2, my = Math.min(hy, cy) - 30;
      ctx.quadraticCurveTo(mx, my, cx, cy);
      ctx.strokeStyle = 'rgba(245,194,66,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving dot
      const px = bezier2(hx, mx, cx, t);
      const py = bezier2(hy, my, cy, t);
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5C242';
      ctx.fill();

      // City dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,194,66,0.6)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5C242';
      ctx.fill();
    });

    // Home (London) dot
    const pulse = 0.5 + 0.5 * Math.sin(frame / 15);
    ctx.beginPath();
    ctx.arc(hx, hy, 6 + pulse * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,194,66,${0.06 + pulse * 0.06})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx, hy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F5C242';
    ctx.fill();

    frame++;
    requestAnimationFrame(draw);
  }

  function bezier2(p0, p1, p2, t) {
    return (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2;
  }

  draw();
})();

// ---- Contact Form (EmailJS) ----
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const formMessage = document.getElementById('formMessage');

  // Basic validation
  const required = ['from_name', 'reply_to', 'commodity', 'trade_type', 'message'];
  let valid = true;
  required.forEach(id => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      field.style.borderColor = 'rgba(239,68,68,0.5)';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) {
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    formMessage.textContent = 'Please fill in all required fields.';
    return;
  }

  // Email validation
  const emailField = document.getElementById('reply_to');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailField.value)) {
    emailField.style.borderColor = 'rgba(239,68,68,0.5)';
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    formMessage.textContent = 'Please enter a valid email address.';
    return;
  }

  // Loading state
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-flex';
  submitBtn.disabled = true;
  formMessage.style.display = 'none';

  // Gather form data
  const templateParams = {
    from_name:  document.getElementById('from_name').value,
    company:    document.getElementById('company').value || 'N/A',
    reply_to:   document.getElementById('reply_to').value,
    phone:      document.getElementById('phone').value || 'N/A',
    commodity:  document.getElementById('commodity').value,
    trade_type: document.getElementById('trade_type').value,
    quantity:   document.getElementById('quantity').value || 'N/A',
    message:    document.getElementById('message').value,
    to_name:    'Wahenoor Exports Team',
  };

  try {
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS not loaded');
    }
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
    await emailjs.send('service_45qi9mk', 'template_ihgl3bp', templateParams);

    formMessage.className = 'form-message success';
    formMessage.style.display = 'block';
    formMessage.innerHTML = '✓ Thank you! Your enquiry has been received. We will respond within 24 hours.';
    form.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    formMessage.innerHTML = `Unable to send your message. Please email us directly at <a href="mailto:info@welexports.com" style="color:var(--gold)">info@welexports.com</a>`;
  } finally {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
  }
});

// Clear field error styles on input
document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => {
    field.style.borderColor = '';
  });
});

// ---- Active Nav Link on Scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinkEls.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { passive: true });

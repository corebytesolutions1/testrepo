/* ============================================================
   CoreByte Solutions — main.js
   Doodle canvas · Custom cursor · Nav · Counters · Reveal
   EmailJS contact form with validation & spam protection
   ============================================================ */

(function () {
  'use strict';

  /* ── 0. EmailJS Configuration ──────────────────────────────
     Replace the three placeholders before going live:
       PUBLIC_KEY   → Account > API Keys > Public Key
       SERVICE_ID   → Email Services > Service ID (e.g. service_xxxxxx)
       TEMPLATE_ID  → Email Templates > Template ID (e.g. template_xxxxxx)
  ─────────────────────────────────────────────────────────── */
  const EMAILJS_PUBLIC_KEY  = '8t_obtLIkkufY4g-d';   // ← replace
  const EMAILJS_SERVICE_ID  = 'service_1t7yl56';   // ← replace
  const EMAILJS_TEMPLATE_ID = 'template_h6f2wbo';  // ← replace

  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ── 1. Doodle Cursor Canvas ───────────────────────────────*/
  const canvas = document.getElementById('doodle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const DOODLE_TYPES = ['star','heart','circle','triangle','squiggle','diamond'];
  const COLORS = ['#FF6B35','#00C9A7','#BB86FC','#FFD166','#06D6A0','#EF476F'];

  class Doodle {
    constructor(i) {
      this.x      = Math.random() * window.innerWidth;
      this.y      = Math.random() * window.innerHeight;
      this.size   = 10 + i * 2.2;
      this.color  = COLORS[i % COLORS.length];
      this.type   = DOODLE_TYPES[i % DOODLE_TYPES.length];
      this.speed  = 0.015 + i * 0.008;
      this.lag    = 2 + i * 1.6;
      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.07;
      this.alpha     = 0.5 + Math.random() * 0.35;
      this.wobble    = Math.random() * Math.PI * 2;
      this.wobbleSpd = 0.04 + Math.random() * 0.04;
      // fixed offset so doodles spread around cursor
      this.ox = (Math.random() - 0.5) * 80;
      this.oy = (Math.random() - 0.5) * 60;
    }

    update(mx, my) {
      const tx = mx + this.ox - this.lag * 5;
      const ty = my + this.oy - this.lag * 3;
      this.x  += (tx - this.x) * this.speed;
      this.y  += (ty - this.y) * this.speed;
      this.rotation  += this.rotSpeed;
      this.wobble    += this.wobbleSpd;
    }

    draw(c) {
      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.rotation);
      c.globalAlpha  = this.alpha * (0.82 + 0.18 * Math.sin(this.wobble));
      c.strokeStyle  = this.color;
      c.fillStyle    = this.color + '20';
      c.lineWidth    = 2;
      c.lineCap      = 'round';
      c.lineJoin     = 'round';
      const s = this.size;
      switch (this.type) {
        case 'star':     drawStar(c, s);     c.fill(); c.stroke(); break;
        case 'heart':    drawHeart(c, s);    c.fill(); c.stroke(); break;
        case 'circle':
          c.beginPath(); c.arc(0,0,s*.5,0,Math.PI*2);
          c.fill(); c.stroke(); break;
        case 'triangle':
          c.beginPath(); c.moveTo(0,-s*.6); c.lineTo(s*.55,s*.45); c.lineTo(-s*.55,s*.45); c.closePath();
          c.fill(); c.stroke(); break;
        case 'squiggle':
          c.beginPath(); c.moveTo(-s*.6,0);
          c.bezierCurveTo(-s*.3,-s*.5, s*.3,s*.5, s*.6,0);
          c.stroke(); break;
        case 'diamond':
          c.beginPath(); c.moveTo(0,-s*.6); c.lineTo(s*.4,0); c.lineTo(0,s*.6); c.lineTo(-s*.4,0); c.closePath();
          c.fill(); c.stroke(); break;
      }
      c.restore();
    }
  }

  function drawStar(c, s) {
    const spikes=5, or=s, ir=s*.42;
    let rot = -Math.PI/2;
    const step = Math.PI/spikes;
    c.beginPath(); c.moveTo(Math.cos(rot)*or, Math.sin(rot)*or);
    for(let i=0;i<spikes;i++){
      rot+=step; c.lineTo(Math.cos(rot)*ir, Math.sin(rot)*ir);
      rot+=step; c.lineTo(Math.cos(rot)*or, Math.sin(rot)*or);
    }
    c.closePath();
  }

  function drawHeart(c, s) {
    s *= 0.55;
    c.beginPath();
    c.moveTo(0, s*.3);
    c.bezierCurveTo(0,-s*.3, -s,-s*.3, -s,s*.2);
    c.bezierCurveTo(-s,s*.7,  0, s,    0,s*1.1);
    c.bezierCurveTo(0, s,     s, s*.7, s,s*.2);
    c.bezierCurveTo(s,-s*.3,  0,-s*.3, 0,s*.3);
    c.closePath();
  }

  const doodles = Array.from({length:8}, (_,i) => new Doodle(i));
  let mouseX = -300, mouseY = -300, mouseOnPage = false;

  document.addEventListener('mousemove', e => { mouseX=e.clientX; mouseY=e.clientY; mouseOnPage=true; }, {passive:true});
  document.addEventListener('mouseleave', () => { mouseOnPage=false; }, {passive:true});

  function animateDoodles() {
    ctx.clearRect(0,0,W,H);
    if (mouseOnPage) doodles.forEach(d => { d.update(mouseX,mouseY); d.draw(ctx); });
    requestAnimationFrame(animateDoodles);
  }
  animateDoodles();

  /* ── 2. Custom Cursor ──────────────────────────────────────*/
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let dotX=-100, dotY=-100, ringX=-100, ringY=-100;

  document.addEventListener('mousemove', e => { dotX=e.clientX; dotY=e.clientY; }, {passive:true});

  (function tickCursor(){
    cursorDot.style.left  = dotX+'px'; cursorDot.style.top  = dotY+'px';
    ringX += (dotX-ringX)*0.12; ringY += (dotY-ringY)*0.12;
    cursorRing.style.left = ringX+'px'; cursorRing.style.top = ringY+'px';
    requestAnimationFrame(tickCursor);
  })();

  document.querySelectorAll('a,button,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width='52px'; cursorRing.style.height='52px';
      cursorRing.style.borderColor='#FF6B35'; cursorDot.style.background='#00C9A7';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width='36px'; cursorRing.style.height='36px';
      cursorRing.style.borderColor='#00C9A7'; cursorDot.style.background='#FF6B35';
    });
  });

  /* ── 3. Navbar scroll ──────────────────────────────────────*/
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY>30), {passive:true});

  /* ── 4. Mobile hamburger ───────────────────────────────────*/
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    navbar.classList.remove('menu-open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    navbar.classList.add('menu-open');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
  // Close on resize back to desktop
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
  // Close on escape key
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ── 5. Smooth scroll ──────────────────────────────────────*/
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const t = document.querySelector(this.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* ── 6. Scroll reveal ──────────────────────────────────────*/
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry,i) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('visible'), i*90);
        revealObs.unobserve(entry.target);
      }
    });
  },{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 7. Active nav on scroll ───────────────────────────────*/
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors= document.querySelectorAll('.nav-link[href^="#"]');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY+100;
    sections.forEach(s => {
      if(sy >= s.offsetTop && sy < s.offsetTop+s.offsetHeight){
        navAnchors.forEach(a => a.classList.remove('active'));
        const m = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if(m) m.classList.add('active');
      }
    });
  },{passive:true});

  /* ── 9. Contact Form — EmailJS ─────────────────────────────
     EmailJS Template variables used:
       {{from_name}}   — sender's name
       {{from_email}}  — sender's email
       {{from_phone}}  — sender's phone (optional)
       {{service}}     — service interested in
       {{message}}     — message body
       {{reply_to}}    — same as from_email (for Reply-To header)
  ─────────────────────────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccess');
  const errorBox   = document.getElementById('formError');

  if (!form) return;

  // ── inline validation helpers ──
  function showErr(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
  }
  function validateField(input, errId, check) {
    const ok = check(input.value.trim());
    input.classList.toggle('invalid', !ok);
    showErr(errId, !ok);
    return ok;
  }

  const nameInput  = document.getElementById('cf-name');
  const emailInput = document.getElementById('cf-email');
  const msgInput   = document.getElementById('cf-message');

  nameInput.addEventListener('blur',  () => validateField(nameInput,  'err-name',  v => v.length >= 2));
  emailInput.addEventListener('blur', () => validateField(emailInput, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)));
  msgInput.addEventListener('blur',   () => validateField(msgInput,   'err-msg',   v => v.length >= 20));

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // ── honeypot check ──
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return; // silently reject bots

    // ── validate all required fields ──
    const nameOk  = validateField(nameInput,  'err-name',  v => v.length >= 2);
    const emailOk = validateField(emailInput, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const msgOk   = validateField(msgInput,   'err-msg',   v => v.length >= 20);
    if (!nameOk || !emailOk || !msgOk) {
      // scroll to first invalid field
      (form.querySelector('.invalid') || nameInput).scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }

    // ── loading state ──
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    successBox.style.display = 'none';
    errorBox.style.display   = 'none';

    const serviceEl = document.getElementById('cf-service');
    const phoneEl   = document.getElementById('cf-phone');

    const templateParams = {
      from_name  : nameInput.value.trim(),
      from_email : emailInput.value.trim(),
      from_phone : phoneEl ? phoneEl.value.trim() : '',
      service    : serviceEl ? serviceEl.value || 'Not specified' : 'Not specified',
      message    : msgInput.value.trim(),
      reply_to   : emailInput.value.trim(),
    };

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      form.reset();
      successBox.style.display = 'block';
      successBox.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(() => { successBox.style.display='none'; }, 7000);

    } catch (err) {
      console.error('[EmailJS error]', err);
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(() => { errorBox.style.display='none'; }, 8000);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

})();

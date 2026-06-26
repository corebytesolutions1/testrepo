/* ============================================================
   CoreByte Solutions — main.js
   ============================================================ */
(function () {
  'use strict';

  /* ── EmailJS config ── */
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  /* ── Touch detection ── */
  const IS_TOUCH = !window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── 1. Doodle canvas (desktop only) ── */
  const canvas = document.getElementById('doodle-canvas');
  const ctx    = canvas ? canvas.getContext('2d') : null;
  let W = window.innerWidth, H = window.innerHeight;

  if (!IS_TOUCH && canvas && ctx) {
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const TYPES  = ['star','heart','circle','triangle','squiggle','diamond'];
    const COLORS = ['#FF6B35','#00C9A7','#BB86FC','#FFD166','#06D6A0','#EF476F'];

    class Doodle {
      constructor(i) {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.size = 10 + i * 2.2; this.color = COLORS[i % COLORS.length];
        this.type = TYPES[i % TYPES.length]; this.speed = 0.015 + i * 0.008;
        this.rot = Math.random() * Math.PI * 2; this.rotSpd = (Math.random()-.5)*.07;
        this.alpha = 0.5 + Math.random()*.35; this.wob = Math.random()*Math.PI*2;
        this.wobSpd = 0.04 + Math.random()*.04;
        this.ox = (Math.random()-.5)*80; this.oy = (Math.random()-.5)*60;
      }
      update(mx,my) {
        this.x += (mx+this.ox - this.x)*this.speed;
        this.y += (my+this.oy - this.y)*this.speed;
        this.rot += this.rotSpd; this.wob += this.wobSpd;
      }
      draw(c) {
        c.save(); c.translate(this.x,this.y); c.rotate(this.rot);
        c.globalAlpha = this.alpha*(0.82+0.18*Math.sin(this.wob));
        c.strokeStyle = this.color; c.fillStyle = this.color+'20';
        c.lineWidth=2; c.lineCap='round'; c.lineJoin='round';
        const s=this.size;
        switch(this.type){
          case 'star':    drawStar(c,s);break;
          case 'heart':   drawHeart(c,s);break;
          case 'circle':  c.beginPath();c.arc(0,0,s*.5,0,Math.PI*2);c.fill();c.stroke();break;
          case 'triangle':c.beginPath();c.moveTo(0,-s*.6);c.lineTo(s*.55,s*.45);c.lineTo(-s*.55,s*.45);c.closePath();c.fill();c.stroke();break;
          case 'squiggle':c.beginPath();c.moveTo(-s*.6,0);c.bezierCurveTo(-s*.3,-s*.5,s*.3,s*.5,s*.6,0);c.stroke();break;
          case 'diamond': c.beginPath();c.moveTo(0,-s*.6);c.lineTo(s*.4,0);c.lineTo(0,s*.6);c.lineTo(-s*.4,0);c.closePath();c.fill();c.stroke();break;
        }
        c.restore();
      }
    }
    function drawStar(c,s){
      let r=-Math.PI/2,step=Math.PI/5;
      c.beginPath();c.moveTo(Math.cos(r)*s,Math.sin(r)*s);
      for(let i=0;i<5;i++){r+=step;c.lineTo(Math.cos(r)*s*.42,Math.sin(r)*s*.42);r+=step;c.lineTo(Math.cos(r)*s,Math.sin(r)*s);}
      c.closePath();
    }
    function drawHeart(c,s){
      s*=.55;c.beginPath();c.moveTo(0,s*.3);
      c.bezierCurveTo(0,-s*.3,-s,-s*.3,-s,s*.2);c.bezierCurveTo(-s,s*.7,0,s,0,s*1.1);
      c.bezierCurveTo(0,s,s,s*.7,s,s*.2);c.bezierCurveTo(s,-s*.3,0,-s*.3,0,s*.3);c.closePath();
    }

    const doodles = Array.from({length:8},(_,i)=>new Doodle(i));
    let mx=-300,my=-300,onPage=false;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;onPage=true;},{passive:true});
    document.addEventListener('mouseleave',()=>{onPage=false;},{passive:true});
    (function loop(){
      ctx.clearRect(0,0,W,H);
      if(onPage) doodles.forEach(d=>{d.update(mx,my);d.draw(ctx);});
      requestAnimationFrame(loop);
    })();

    /* Custom cursor */
    const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
    let dx=-100,dy=-100,rx=-100,ry=-100;
    document.addEventListener('mousemove',e=>{dx=e.clientX;dy=e.clientY;},{passive:true});
    (function cursorLoop(){
      if(dot){dot.style.left=dx+'px';dot.style.top=dy+'px';}
      rx+=(dx-rx)*.12;ry+=(dy-ry)*.12;
      if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
      requestAnimationFrame(cursorLoop);
    })();
    document.querySelectorAll('a,button,input,select,textarea').forEach(el=>{
      el.addEventListener('mouseenter',()=>{if(ring){ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='#FF6B35';}if(dot)dot.style.background='#00C9A7';});
      el.addEventListener('mouseleave',()=>{if(ring){ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='#00C9A7';}if(dot)dot.style.background='#FF6B35';});
    });
  }

  /* ── 2. Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── 3. Mobile menu (new separate panel) ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop   = document.getElementById('navBackdrop');
  let scrollY_saved = 0;

  function openMenu() {
    scrollY_saved = window.scrollY;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden','false');
    backdrop.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded','true');
    document.body.classList.add('nav-open');
    document.body.style.top = '-' + scrollY_saved + 'px';
    navbar.classList.add('has-bg');
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    backdrop.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded','false');
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY_saved);
    navbar.classList.remove('has-bg');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () =>
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
    );
    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(l =>
      l.addEventListener('click', closeMenu)
    );
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
  }

  /* ── 4. Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── 5. Scroll reveal ── */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 90);
        ro.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── 6. Active nav on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const desktopNav = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY + 120;
    sections.forEach(sec => {
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        desktopNav.forEach(a => a.classList.remove('active'));
        mobileNavLinks.forEach(a => a.classList.remove('active-link'));
        const dMatch = document.querySelector(`.desktop-nav .nav-link[href="#${sec.id}"]`);
        const mMatch = document.querySelector(`.mobile-nav-link[href="#${sec.id}"]`);
        if (dMatch) dMatch.classList.add('active');
        if (mMatch) mMatch.classList.add('active-link');
      }
    });
  }, { passive: true });

  /* ── 7. Contact form (EmailJS) ── */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successBox= document.getElementById('formSuccess');
  const errorBox  = document.getElementById('formError');

  if (form) {
    const nameEl  = document.getElementById('cf-name');
    const emailEl = document.getElementById('cf-email');
    const msgEl   = document.getElementById('cf-message');

    function showErr(id, show) {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? 'block' : 'none';
    }
    function validate(el, errId, fn) {
      const ok = fn(el.value.trim());
      el.classList.toggle('invalid', !ok);
      showErr(errId, !ok);
      return ok;
    }

    nameEl.addEventListener('blur',  () => validate(nameEl,  'err-name',  v => v.length >= 2));
    emailEl.addEventListener('blur', () => validate(emailEl, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)));
    msgEl.addEventListener('blur',   () => validate(msgEl,   'err-msg',   v => v.length >= 20));

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      const ok1 = validate(nameEl,  'err-name',  v => v.length >= 2);
      const ok2 = validate(emailEl, 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      const ok3 = validate(msgEl,   'err-msg',   v => v.length >= 20);
      if (!ok1 || !ok2 || !ok3) {
        (form.querySelector('.invalid') || nameEl).scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      successBox.style.display = 'none';
      errorBox.style.display   = 'none';

      const serviceEl = document.getElementById('cf-service');
      const phoneEl   = document.getElementById('cf-phone');

      try {
        if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name  : nameEl.value.trim(),
          from_email : emailEl.value.trim(),
          from_phone : phoneEl ? phoneEl.value.trim() : '',
          service    : serviceEl ? serviceEl.value || 'Not specified' : 'Not specified',
          message    : msgEl.value.trim(),
          reply_to   : emailEl.value.trim(),
        });
        form.reset();
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior:'smooth', block:'nearest' });
        setTimeout(() => { successBox.style.display = 'none'; }, 7000);
      } catch (err) {
        console.error('[EmailJS]', err);
        errorBox.style.display = 'block';
        setTimeout(() => { errorBox.style.display = 'none'; }, 8000);
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

})();

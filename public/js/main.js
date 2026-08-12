document.documentElement.classList.add("is-loading");

// ---------- Preloader ----------
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    if (preloader) preloader.classList.add("hide");
    document.documentElement.classList.remove("is-loading");
  }, 500);
});

// ---------- Lucide Icons ----------
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
});
window.addEventListener("load", () => {
  if (window.lucide) lucide.createIcons();
});

// ---------- AOS ----------
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60 });
});

// ---------- Sticky header color change on scroll ----------
const header = document.getElementById("site-header");
function handleHeaderScroll() {
  if (!header) return;
  if (window.scrollY > 40) {
    header.classList.add("scrolled", "bg-navy");
    header.classList.remove("bg-transparent");
  } else if (header.dataset.transparent !== "false") {
    header.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", handleHeaderScroll);
handleHeaderScroll();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// ---------- Stat counters ----------
const counters = document.querySelectorAll(".counter");
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target + "+";
          } else {
            el.textContent = current;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));
}

// ---------- Gallery filter + lightbox ----------
const filterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("bg-accent", "text-white"));
      filterBtns.forEach((b) => b.classList.add("bg-[#F5F7FA]", "text-navy"));
      btn.classList.add("bg-accent", "text-white");
      btn.classList.remove("bg-[#F5F7FA]", "text-navy");

      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const show = filter === "all" || item.dataset.category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
if (lightbox) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      lightboxImg.src = item.dataset.src;
      lightboxImg.alt = item.dataset.caption || "";
      lightboxCaption.textContent = item.dataset.caption || "";
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
    });
  });
  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
  };
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ---------- tsParticles hero background ----------
const particlesTarget = document.getElementById("hero-particles");
if (particlesTarget && window.tsParticles) {
  tsParticles.load({
    id: "hero-particles",
    options: {
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true, area: 900 } },
        color: { value: ["#E6631E", "#ffffff"] },
        opacity: { value: 0.25 },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          color: "#ffffff",
          opacity: 0.12,
          distance: 140
        },
        move: { enable: true, speed: 0.6, outModes: { default: "out" } }
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "grab" } },
        modes: { grab: { distance: 160, links: { opacity: 0.3 } } }
      },
      detectRetina: true
    }
  });
}

// ---------- Container drop/stack scroll animation (home page) ----------
const containerStack = document.getElementById("container-stack");
if (containerStack && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const boxes = containerStack.querySelectorAll(".container-drop");
  const boxHeight = 96; // container height + gap, keeps the stack aligned bottom-up
  const stackBase = containerStack.clientHeight - 96;

  boxes.forEach((box, i) => {
    const restY = stackBase - i * boxHeight;
    gsap.set(box, { y: -350, opacity: 0, rotate: -4 });

    ScrollTrigger.create({
      trigger: containerStack,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(box, {
          y: restY,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          delay: i * 0.18,
          ease: "bounce.out"
        });
      }
    });
  });
}

// ---------- Notice board search + filter ----------
const noticeSearch = document.getElementById("notice-search");
const noticeCategory = document.getElementById("notice-category");
const noticeCards = document.querySelectorAll(".notice-card");
const noResults = document.getElementById("no-results");

function filterNotices() {
  if (!noticeCards.length) return;
  const q = (noticeSearch?.value || "").toLowerCase().trim();
  const cat = noticeCategory?.value || "all";
  let visibleCount = 0;

  noticeCards.forEach((card) => {
    const matchesText = card.dataset.title.includes(q);
    const matchesCat = cat === "all" || card.dataset.category === cat;
    const show = matchesText && matchesCat;
    card.style.display = show ? "" : "none";
    if (show) visibleCount++;
  });

  if (noResults) noResults.classList.toggle("hidden", visibleCount !== 0);
}
noticeSearch?.addEventListener("input", filterNotices);
noticeCategory?.addEventListener("change", filterNotices);

// Smooth scroll helpers for CTA buttons that use data-scroll-target
function setupScrollButtons() {
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Sticky navbar state
function setupStickyNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const update = () => {
    if (window.scrollY > 16) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Mobile navigation toggle
function setupMobileNav() {
  const toggle = document.querySelector(".navbar__toggle");
  const wrapper = document.querySelector(".navbar__links-wrapper");
  const navLinks = document.querySelectorAll(".navbar__links a");
  if (!toggle || !wrapper) return;

  const closeMenu = () => {
    wrapper.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = wrapper.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 800) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
}

// Scroll reveal animations
function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window) || !elements.length) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Animated counters
function setupCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    const duration = 1200; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = String(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

// Portfolio filtering
function setupPortfolioFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      buttons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

// Testimonials slider
function setupTestimonialsSlider() {
  const slides = Array.from(document.querySelectorAll(".testimonial"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  if (!slides.length || !dots.length) return;

  let currentIndex = 0;
  let intervalId;

  const goTo = (index) => {
    currentIndex = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goTo(nextIndex);
  };

  const startAutoPlay = () => {
    if (intervalId) window.clearInterval(intervalId);
    intervalId = window.setInterval(next, 6500);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
      startAutoPlay();
    });
  });

  const slider = document.querySelector(".testimonials__slider");
  if (slider) {
    slider.addEventListener("mouseenter", () => {
      if (intervalId) window.clearInterval(intervalId);
    });
    slider.addEventListener("mouseleave", () => {
      startAutoPlay();
    });
  }

  goTo(0);
  startAutoPlay();
}

// Footer year
function setFooterYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  yearSpan.textContent = String(new Date().getFullYear());
}

function setupHeroTyping() {
  const span = document.querySelector("#hero-title .text-gradient");
  if (!span) return;

  const baseText = span.textContent || "";
  const anchor = "lasting trust";
  const idx = baseText.toLowerCase().indexOf(anchor);

  let prefix = "";
  if (idx >= 0) {
    prefix = baseText.slice(0, idx);
  } else {
    const lastSpace = baseText.lastIndexOf(" ");
    prefix = lastSpace >= 0 ? baseText.slice(0, lastSpace + 1) : "";
  }

  const phrases = [
    "lasting trust",
    "powerful brands",
    "digital growth",
    "future-ready solutions",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 90;
  const deleteSpeed = 45;
  const endPause = 1200;
  const betweenPause = 400;

  const tick = () => {
    const full = phrases[phraseIndex];
    if (!isDeleting) {
      charIndex = Math.min(charIndex + 1, full.length);
    } else {
      charIndex = Math.max(charIndex - 1, 0);
    }

    span.textContent = prefix + full.slice(0, charIndex);

    let timeout = isDeleting ? deleteSpeed : typeSpeed;
    if (!isDeleting && charIndex === full.length) {
      timeout = endPause;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      timeout = betweenPause;
    }
    window.setTimeout(tick, timeout);
  };

  span.textContent = prefix;
  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  setupScrollButtons();
  setupStickyNavbar();
  setupMobileNav();
  setupScrollReveal();
  setupCounters();
  setupPortfolioFilter();
  setupTestimonialsSlider();
  setFooterYear();
  setupHeroTyping();
});

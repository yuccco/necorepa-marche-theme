/* ネコリパマルシェ — main.js */

(function () {
  "use strict";

  /* -------- Nav: desktop slide-in on scroll -------- */
  const navDesktop = document.getElementById("nav-desktop");
  const HERO_PX = 760;
  const isHomePage = !!document.querySelector(".hero");

  function onScroll() {
    if (!navDesktop) return;
    if (isHomePage) {
      if (window.scrollY > HERO_PX) {
        navDesktop.classList.add("is-visible");
      } else {
        navDesktop.classList.remove("is-visible");
      }
    }

    /* Hero parallax zoom */
    const heroBg = document.querySelector(".hero-photo-bg");
    if (heroBg) {
      const t = Math.min(1, Math.max(0, window.scrollY / 805));
      const scale = 1 + t * 0.18;
      heroBg.style.transform = `scale(${scale})`;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- Nav: desktop dropdown -------- */
  document.querySelectorAll(".nav-item.has-dropdown").forEach(function (item) {
    var timer;
    item.addEventListener("mouseenter", function () {
      clearTimeout(timer);
      item.classList.add("is-open");
    });
    item.addEventListener("mouseleave", function () {
      timer = setTimeout(function () {
        item.classList.remove("is-open");
      }, 80);
    });
  });

  /* -------- Nav: mobile parent toggle -------- */
  document.querySelectorAll(".nav-mobile-parent").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const isOpen = btn.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen);
      const children = btn.nextElementSibling;
      if (children) children.classList.toggle("is-open", isOpen);
    });
  });

  /* -------- Nav: mobile hamburger -------- */
  const hamburger = document.querySelector(".hamburger");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (hamburger && navDropdown) {
    hamburger.addEventListener("click", function () {
      const isOpen = hamburger.classList.toggle("is-open");
      if (isOpen) {
        navDropdown.classList.add("is-open");
      } else {
        navDropdown.classList.remove("is-open");
      }
    });
    /* Close dropdown when a link is tapped */
    navDropdown.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("is-open");
        navDropdown.classList.remove("is-open");
      });
    });
  }

  /* -------- Shop carousel -------- */
  initCarousel("shop-carousel", "shop-prev", "shop-next");
  function initCarousel(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !prevBtn || !nextBtn) return;

    let index = 0;

    function getConfig() {
      const vw = window.innerWidth;
      const isMobile = vw < 640;
      const isTablet = vw >= 640 && vw < 1024;
      const isDesktop = vw >= 1024;
      const visible = isDesktop ? 3 : isTablet ? 2 : 1;
      const gap = isDesktop ? 36 : isTablet ? 36 : 20;
      const rowWidth = isDesktop ? 1200 : Math.min(vw, 1440) - (isMobile ? 48 : 80);
      const cardW = isDesktop ? 360 : Math.floor((rowWidth - gap * (visible - 1)) / visible);
      const step = cardW + gap;
      const maxIdx = Math.max(0, 6 - visible);
      return { visible, gap, cardW, step, maxIdx };
    }

    function applyCardWidths() {
      const { cardW } = getConfig();
      const scale = cardW / 360;
      track.querySelectorAll(".card-shop").forEach(function (card) {
        card.style.width = cardW + "px";
        const wrap = card.querySelector(".card-shop-img-wrap");
        if (wrap) {
          wrap.style.width  = cardW + "px";
          wrap.style.height = (240 * scale) + "px";
        }
        const inner = card.querySelector(".card-shop-img-inner");
        if (inner) {
          inner.style.transform = "";
          inner.style.transformOrigin = "";
        }
      });
    }

    function updateTrack() {
      const { step } = getConfig();
      track.style.transform = `translateX(${-index * step}px)`;
    }

    function updateButtons() {
      const { maxIdx } = getConfig();
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIdx;
    }

    prevBtn.addEventListener("click", function () {
      if (index > 0) { index--; updateTrack(); updateButtons(); }
    });
    nextBtn.addEventListener("click", function () {
      const { maxIdx } = getConfig();
      if (index < maxIdx) { index++; updateTrack(); updateButtons(); }
    });

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        applyCardWidths();
        updateTrack();
        updateButtons();
      }, 100);
    });

    applyCardWidths();
    updateTrack();
    updateButtons();
  }

  /* -------- Category filter tabs -------- */
  document.querySelectorAll(".btn-filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".btn-filter").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
    });
  });

  /* -------- チャリティ 猫ニョキアニメーション -------- */
  const charityCatWrap = document.querySelector(".charity-cat-wrap");
  if (charityCatWrap) {
    const charityCatObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        charityCatWrap.classList.add("is-visible");
        charityCatObserver.disconnect();
      }
    }, { threshold: 0.1 });
    charityCatObserver.observe(document.querySelector(".charity") || charityCatWrap);
  }

  /* -------- 新着アイテム 猫ドロップアニメーション -------- */
  const catEl = document.querySelector(".new-items-bg-text-cat");
  if (catEl) {
    catEl.addEventListener("animationend", function () {
      catEl.style.opacity = "1";
      catEl.style.transform = "translateY(0)";
    }, { once: true });
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        catEl.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(document.querySelector(".new-items") || catEl);
  }

  /* -------- Smooth scroll for CTA button -------- */
  document.querySelectorAll('a[href="#shop"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const el = document.getElementById("shop");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

})();

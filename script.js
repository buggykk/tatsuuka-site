// ==================== МОРОЗОВ ТАТУ — интерактив хедера/меню/hero ====================
(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navClose = document.querySelector("[data-nav-close]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const stylesToggle = document.querySelector("[data-nav-styles-toggle]");
  const stylesSub = document.querySelector("[data-nav-styles]");
  const body = document.body;

  if (!header || !nav || !menuToggle) return;

  function setStylesSubOpen(open) {
    if (!stylesToggle || !stylesSub) return;
    stylesSub.classList.toggle("is-open", open);
    stylesToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function openNav() {
    nav.classList.add("is-open");
    nav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("nav-open");
    // поверх открытого меню (белый фон) хедер всегда должен быть тёмным
    header.classList.add("is-scrolled");
  }

  function closeNav() {
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
    setStylesSubOpen(false);
    // возвращаем фактическое состояние хедера в зависимости от скролла
    updateHeaderState();
  }

  menuToggle.addEventListener("click", function () {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });

  if (navClose) {
    navClose.addEventListener("click", closeNav);
  }

  if (stylesToggle && stylesSub) {
    stylesToggle.addEventListener("click", function () {
      const willOpen = stylesToggle.getAttribute("aria-expanded") !== "true";
      setStylesSubOpen(willOpen);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
    }
  });

  // Смена фона хедера при скролле
  function updateHeaderState() {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  // ---------- HERO: слайдер видео/фото ----------
  // Слайд 0 (видео/гифка) не крутится сам — ждёт клик.
  // После ухода с него фото листаются каждые 5 с и возвращаются на 0, снова ожидая ввод.
  const heroSlides = document.querySelectorAll("[data-hero-slide]");
  const heroPrev = document.querySelector("[data-hero-prev]");
  const heroNext = document.querySelector("[data-hero-next]");
  const heroCount = document.querySelector("[data-hero-count]");
  const heroVideo = document.querySelector(".hero__video");
  const HERO_MAIN_INDEX = 0;
  const HERO_AUTO_MS = 5000;
  let heroIndex = HERO_MAIN_INDEX;
  let heroAutoEnabled = false;
  let heroAutoTimer = null;

  function clearHeroAuto() {
    if (heroAutoTimer !== null) {
      window.clearTimeout(heroAutoTimer);
      heroAutoTimer = null;
    }
  }

  function scheduleHeroAuto() {
    clearHeroAuto();
    if (!heroAutoEnabled || heroIndex === HERO_MAIN_INDEX) return;

    heroAutoTimer = window.setTimeout(function () {
      goToHeroSlide(heroIndex + 1, { fromAuto: true });
    }, HERO_AUTO_MS);
  }

  function updateHeroSlide() {
    heroSlides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === heroIndex);
    });

    if (heroCount) {
      const current = String(heroIndex + 1).padStart(2, "0");
      const total = String(heroSlides.length).padStart(2, "0");
      heroCount.textContent = current + " / " + total;
    }

    if (heroVideo) {
      const videoSlide = heroVideo.closest("[data-hero-slide]");
      const isVideoActive = videoSlide && videoSlide.classList.contains("is-active");
      if (isVideoActive) {
        heroVideo.play().catch(function () {});
      } else {
        heroVideo.pause();
      }
    }
  }

  function goToHeroSlide(nextIndex, options) {
    const fromAuto = options && options.fromAuto;
    const total = heroSlides.length;
    if (!total) return;

    heroIndex = ((nextIndex % total) + total) % total;

    if (heroIndex === HERO_MAIN_INDEX) {
      heroAutoEnabled = false;
      clearHeroAuto();
    } else if (!fromAuto) {
      // Любой ручной уход с гифки / листание фото включает автопрокрутку
      heroAutoEnabled = true;
    }

    updateHeroSlide();
    scheduleHeroAuto();
  }

  if (heroSlides.length) {
    if (heroPrev) {
      heroPrev.addEventListener("click", function () {
        goToHeroSlide(heroIndex - 1, { fromAuto: false });
      });
    }

    if (heroNext) {
      heroNext.addEventListener("click", function () {
        goToHeroSlide(heroIndex + 1, { fromAuto: false });
      });
    }

    updateHeroSlide();
  }
})();
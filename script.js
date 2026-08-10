// ==================== МОРОЗОВ ТАТУ — интерактив хедера/меню/hero ====================
(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navClose = document.querySelector("[data-nav-close]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const body = document.body;

  if (!header || !nav || !menuToggle) return;

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
    // возвращаем фактическое состояние хедера в зависимости от скролла
    updateHeaderState();
  }

  menuToggle.addEventListener("click", function () {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });

  if (navClose) {
    navClose.addEventListener("click", closeNav);
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
  const heroSlides = document.querySelectorAll("[data-hero-slide]");
  const heroNext = document.querySelector("[data-hero-next]");
  const heroCount = document.querySelector("[data-hero-count]");
  const heroVideo = document.querySelector(".hero__video");
  let heroIndex = 0;

  function updateHeroSlide() {
    heroSlides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === heroIndex);
    });

    if (heroCount) {
      const current = String(heroIndex + 1).padStart(2, "0");
      const total = String(heroSlides.length).padStart(2, "0");
      heroCount.textContent = current + " / " + total;
    }

    // ставим видео на паузу, когда его слайд не активен, и запускаем обратно
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

  if (heroNext && heroSlides.length) {
    heroNext.addEventListener("click", function () {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      updateHeroSlide();
    });
    updateHeroSlide();
  }
})();
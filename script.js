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

  const menuLabel = menuToggle.querySelector(".menu-btn__label");

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
    header.classList.add("is-scrolled");

    if (menuLabel) menuLabel.textContent = "Закрыть";
  }

  function closeNav() {
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
    setStylesSubOpen(false);
    updateHeaderState();

    if (menuLabel) menuLabel.textContent = "Меню";
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

  // ---------- HERO: Слайдер со стрелками-переключателями ----------
  const heroSlides = document.querySelectorAll("[data-hero-slide]");
  const heroPrevBtn = document.querySelector("[data-hero-prev]");
  const heroNextBtn = document.querySelector("[data-hero-next]");
  let heroIndex = 0;

  function updateHeroSlide() {
    heroSlides.forEach(function (slide, i) {
      const isActive = i === heroIndex;
      slide.classList.toggle("is-active", isActive);

      const video = slide.querySelector("video");
      if (video) {
        if (isActive) {
          video.currentTime = 0;
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      }
    });
  }

  function goToHeroSlide(nextIndex) {
    const total = heroSlides.length;
    if (!total) return;
    heroIndex = ((nextIndex % total) + total) % total;
    updateHeroSlide();
  }

  function pressFlash(btn) {
    btn.classList.remove("is-pressed");
    void btn.offsetWidth;
    btn.classList.add("is-pressed");
    setTimeout(function () {
      btn.classList.remove("is-pressed");
    }, 350);
  }

  if (heroSlides.length) {
    if (heroPrevBtn) {
      heroPrevBtn.addEventListener("click", function () {
        pressFlash(heroPrevBtn);
        goToHeroSlide(heroIndex - 1);
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener("click", function () {
        pressFlash(heroNextBtn);
        goToHeroSlide(heroIndex + 1);
      });
    }

    updateHeroSlide();
  }

  // ---------- STYLES: Интерактивная смена фото при ховере ----------
  const styleItems = document.querySelectorAll("[data-style-target]");
  const styleImages = document.querySelectorAll("[data-style-img]");

  if (styleItems.length && styleImages.length) {
    styleItems.forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        const targetId = item.getAttribute("data-style-target");

        styleItems.forEach(function (el) {
          el.classList.toggle("is-active", el === item);
        });

        styleImages.forEach(function (img) {
          const imgId = img.getAttribute("data-style-img");
          img.classList.toggle("is-active", imgId === targetId);
        });
      });
    });
  }
})();
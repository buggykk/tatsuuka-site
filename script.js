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

  // ---------- HERO: Слайдер с поддержкой табов и свайпов ----------
  const heroSlides = document.querySelectorAll("[data-hero-slide]");
  const heroTabs = document.querySelectorAll("[data-hero-goto]");
  const heroMedia = document.querySelector("[data-hero-media]");
  let heroIndex = 0;

  function updateHeroSlide() {
    // 1. Переключаем слайды и видео
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

    // 2. Синхронизируем подсветку кнопок снизу
    heroTabs.forEach(function (tab) {
      const targetIdx = Number(tab.getAttribute("data-hero-goto"));
      tab.classList.toggle("is-active", targetIdx === heroIndex);
    });
  }

  function goToHeroSlide(nextIndex) {
    const total = heroSlides.length;
    if (!total) return;
    heroIndex = ((nextIndex % total) + total) % total;
    updateHeroSlide();
  }

  if (heroSlides.length) {
    // Клики по табам
    heroTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const targetIdx = Number(tab.getAttribute("data-hero-goto"));

        // Запускаем быструю анимацию вспышки при нажатии
        tab.classList.remove("is-pressed");
        // Небольшой хак для перезапуска CSS-анимации, если кликают несколько раз
        void tab.offsetWidth; 
        tab.classList.add("is-pressed");

        // Удаляем класс анимации после её завершения
        setTimeout(function () {
          tab.classList.remove("is-pressed");
        }, 350);

        goToHeroSlide(targetIdx);
      });
    });

    // Свайпы пальцем для мобилок
    if (heroMedia) {
      let touchStartX = 0;
      let touchEndX = 0;

      heroMedia.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroMedia.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        // Свайп влево -> следующий слайд
        if (diff > 40) {
          goToHeroSlide(heroIndex + 1);
        }
        // Свайп вправо -> предыдущий слайд
        else if (diff < -40) {
          goToHeroSlide(heroIndex - 1);
        }
      }, { passive: true });
    }

    updateHeroSlide();
  }

})();
(() => {
  const menu = document.querySelector("[data-menu]");
  if (menu) {
    const toggle = menu.querySelector("[data-menu-toggle]");
    const panel = menu.querySelector("[data-menu-panel]");
    const submenu = menu.querySelector("[data-submenu]");
    const submenuToggle = menu.querySelector("[data-submenu-toggle]");
    const submenuPanel = menu.querySelector("[data-submenu-panel]");

    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      panel?.setAttribute("hidden", "");
      submenu?.classList.remove("is-open");
      submenuToggle?.setAttribute("aria-expanded", "false");
      submenuPanel?.setAttribute("hidden", "");
    };

    const openMenu = () => {
      menu.classList.add("is-open");
      toggle?.setAttribute("aria-expanded", "true");
      panel?.removeAttribute("hidden");
    };

    toggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    submenuToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = submenu?.classList.toggle("is-open");
      submenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        submenuPanel?.removeAttribute("hidden");
      } else {
        submenuPanel?.setAttribute("hidden", "");
      }
    });

    menu.querySelectorAll("[data-menu-close]").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const slides = [...carousel.querySelectorAll("[data-slide]")];
    const dotsRoot = carousel.querySelector("[data-dots]");
    const prevBtn = carousel.querySelector("[data-prev]");
    const nextBtn = carousel.querySelector("[data-next]");
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Слайд ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsRoot?.appendChild(dot);
    });

    const dots = [...(dotsRoot?.children || [])];

    const render = () => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    };

    const goTo = (next) => {
      index = (next + slides.length) % slides.length;
      render();
      restart();
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 6000);
    };

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    let touchX = 0;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    carousel.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].screenX - touchX;
        if (Math.abs(dx) < 40) return;
        goTo(dx < 0 ? index + 1 : index - 1);
      },
      { passive: true }
    );

    render();
    restart();
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();

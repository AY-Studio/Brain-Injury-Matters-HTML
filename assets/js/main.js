const hero = document.querySelector(".hero-swiper");

if (hero && typeof window.Swiper === "function") {
  const slides = [...hero.querySelectorAll(".swiper-slide")];
  const pagination = document.querySelector(".hero-pagination");
  let swiper;

  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hero-pagination__item";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", `Show ${slide.dataset.paginationTitle}`);
    button.innerHTML = `<span>${slide.dataset.paginationTitle}</span><i aria-hidden="true"><b></b></i>`;
    button.addEventListener("click", () => swiper.slideToLoop(index));
    pagination.append(button);
  });

  const items = [...pagination.querySelectorAll(".hero-pagination__item")];
  const setActive = (activeIndex) => {
    items.forEach((item, index) => {
      const active = index === activeIndex;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      if (!active) item.style.setProperty("--progress", "0");
    });
  };

  swiper = new window.Swiper(hero, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    loop: true,
    speed: 700,
    effect: "slide",
    grabCursor: true,
    watchOverflow: false,
    observer: true,
    observeParents: true,
    keyboard: { enabled: true },
    a11y: {
      enabled: true,
      slideLabelMessage: "{{index}} of {{slidesLength}}"
    },
    autoplay: { delay: 6500, disableOnInteraction: false },
    on: {
      init(instance) { setActive(instance.realIndex); },
      realIndexChange(instance) { setActive(instance.realIndex); },
      autoplayTimeLeft(instance, time, progress) {
        const current = items[instance.realIndex];
        if (current) current.style.setProperty("--progress", String(1 - progress));
      }
    }
  });
}

const megaTriggers = [...document.querySelectorAll(".mega-trigger")];

const closeMegaMenus = (except) => {
  megaTriggers.forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute("aria-expanded", "false");
    const menu = document.getElementById(trigger.getAttribute("aria-controls"));
    menu?.classList.remove("is-open");
    menu?.setAttribute("aria-hidden", "true");
  });
};

megaTriggers.forEach((trigger) => {
  const menu = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.addEventListener("click", () => {
    const open = trigger.getAttribute("aria-expanded") === "true";
    closeMegaMenus(trigger);
    trigger.setAttribute("aria-expanded", String(!open));
    menu?.classList.toggle("is-open", !open);
    menu?.setAttribute("aria-hidden", String(open));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".mega-nav-item")) closeMegaMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMegaMenus();
});

document.querySelector(".support-finder__form")?.addEventListener("submit", (event) => event.preventDefault());
document.querySelector(".newsletter__form")?.addEventListener("submit", (event) => event.preventDefault());

const initialiseStickyNavbar = () => {
  const siteHeader = document.querySelector(".site-header");
  const navbar = siteHeader?.querySelector(".navbar");

  if (!siteHeader || !navbar) return;

  let lastScrollPosition = Math.max(window.scrollY, 0);
  let navbarTop = 0;
  let scrollFrame;

  const updateNavbar = () => {
    const scrollPosition = Math.max(window.scrollY, 0);
    const isScrollingUp = scrollPosition < lastScrollPosition;
    const shouldStick = scrollPosition > navbarTop;
    const shouldHide = shouldStick && scrollPosition > 200 && !isScrollingUp;

    siteHeader.classList.toggle("has-sticky-navbar", shouldStick);
    navbar.classList.toggle("is-sticky", shouldStick);
    navbar.classList.toggle("is-hidden", shouldHide);

    lastScrollPosition = scrollPosition;
    scrollFrame = null;
  };

  const measureNavbar = () => {
    siteHeader.classList.remove("has-sticky-navbar");
    navbar.classList.remove("is-sticky", "is-hidden");
    navbarTop = navbar.getBoundingClientRect().top + window.scrollY;
    siteHeader.style.setProperty("--sticky-navbar-height", `${navbar.offsetHeight}px`);
    updateNavbar();
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateNavbar);
    },
    { passive: true }
  );
  window.addEventListener("resize", measureNavbar);

  measureNavbar();
};

initialiseStickyNavbar();

const testimonialVideoModal = document.querySelector("#testimonial-video-modal");
const testimonialVideoIframe = testimonialVideoModal?.querySelector(".video-modal__iframe");

if (testimonialVideoModal && testimonialVideoIframe) {
  testimonialVideoModal.addEventListener("show.bs.modal", () => {
    testimonialVideoIframe.src = testimonialVideoIframe.dataset.src;
  });

  testimonialVideoModal.addEventListener("hidden.bs.modal", () => {
    testimonialVideoIframe.removeAttribute("src");
  });
}

const initialiseScrollAnimations = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  if (window.SplitText) {
    window.gsap.registerPlugin(window.SplitText);

    const testimonialQuote = document.querySelector(".testimonial blockquote");

    if (testimonialQuote) {
      window.SplitText.create(testimonialQuote, {
        type: "words,lines",
        autoSplit: true,
        wordsClass: "testimonial__quote-word",
        linesClass: "testimonial__quote-line",
        onSplit(split) {
          return window.gsap.fromTo(
            split.words,
            {
              autoAlpha: 0
            },
            {
              autoAlpha: 1,
              duration: 2.5,
              ease: "power2.out",
              stagger: 0.045,
              scrollTrigger: {
                trigger: testimonialQuote,
                start: "top 85%",
                once: true
              }
            }
          );
        }
      });
    }
  }

  const animationGroups = document.querySelectorAll("main section, .site-footer");

  animationGroups.forEach((group) => {
    const headings = group.querySelectorAll("h1, h2, h3");

    if (!headings.length) return;

    window.gsap.fromTo(
      headings,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "opacity,visibility",
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          once: true
        }
      }
    );
  });

  const fadeElements = document.querySelectorAll(
    'main section img:not([alt=""]):not([aria-hidden="true"]), main section .event-card__date'
  );

  fadeElements.forEach((element) => {
    window.gsap.fromTo(
      element,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "opacity,visibility",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true
        }
      }
    );
  });

  const siteFooter = document.querySelector(".site-footer");

  if (siteFooter) {
    window.gsap.fromTo(
      siteFooter,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "opacity,visibility",
        scrollTrigger: {
          trigger: siteFooter,
          start: "top 90%",
          once: true
        }
      }
    );
  }

  const supportFinder = document.querySelector(".support-finder");
  const supportFinderWaves = supportFinder?.querySelectorAll(
    ".support-finder__wave--pink, .support-finder__wave--yellow"
  );

  if (supportFinder && supportFinderWaves?.length) {
    supportFinderWaves.forEach((wave) => {
      window.gsap.fromTo(
        wave,
        {
          autoAlpha: 0
        },
        {
          autoAlpha: 1,
          duration: 1.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wave,
            start: "top 90%",
            once: true
          }
        }
      );
    });
  }

  window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
};

initialiseScrollAnimations();

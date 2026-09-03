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

const partnerSwipers = [...document.querySelectorAll(".partner-swiper")];

if (partnerSwipers.length && typeof window.Swiper === "function") {
  partnerSwipers.forEach((partnerSwiper) => {
    new window.Swiper(partnerSwiper, {
      slidesPerView: 2,
      slidesPerGroup: 3,
      spaceBetween: 14,
      loop: true,
      speed: 700,
      grabCursor: true,
      watchOverflow: false,
      observer: true,
      observeParents: true,
      keyboard: { enabled: true },
      a11y: {
        enabled: true,
        slideLabelMessage: "{{index}} of {{slidesLength}}"
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      breakpoints: {
        576: { slidesPerView: 3.5 },
        768: { slidesPerView: 4.5 },
        992: { slidesPerView: 5.5 },
        1200: { slidesPerView: 8.5 }
      }
    });
  });
}

const insideViewSwipers = [...document.querySelectorAll(".inside-view__swiper")];

if (insideViewSwipers.length && typeof window.Swiper === "function") {
  insideViewSwipers.forEach((insideViewSwiper) => {
    const section = insideViewSwiper.closest(".inside-view");

    new window.Swiper(insideViewSwiper, {
      slidesPerView: 1.05,
      slidesPerGroup: 1,
      spaceBetween: 16,
      loop: true,
      speed: 700,
      grabCursor: true,
      observer: true,
      observeParents: true,
      keyboard: { enabled: true },
      navigation: {
        prevEl: section?.querySelector(".inside-view__button--prev"),
        nextEl: section?.querySelector(".inside-view__button--next")
      },
      pagination: {
        el: section?.querySelector(".inside-view__pagination"),
        clickable: true
      },
      a11y: {
        enabled: true,
        slideLabelMessage: "{{index}} of {{slidesLength}}"
      },
      breakpoints: {
        576: { slidesPerView: 1.08, spaceBetween: 24 },
        992: { slidesPerView: 1.07, spaceBetween: 32 }
      }
    });
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

const commonEffectsStacks = [...document.querySelectorAll(".common-effects__cards")];

const syncCommonEffectsStacks = () => {
  commonEffectsStacks.forEach((stack) => {
    const cards = [...stack.querySelectorAll(".common-effects-card")];
    const cardInners = cards.map((card) => card.querySelector(".common-effects-card__inner"));

    stack.style.removeProperty("--common-effects-card-height");
    stack.style.setProperty("--common-effects-card-count", cards.length);

    cards.forEach((card, index) => {
      card.style.setProperty("--common-effects-card-offset", `${20 + index * 20}px`);
    });

    const tallestCard = Math.ceil(Math.max(...cardInners.map((cardInner) => cardInner?.offsetHeight || 0)));

    if (tallestCard) {
      stack.style.setProperty("--common-effects-card-height", `${tallestCard}px`);
    }
  });
};

syncCommonEffectsStacks();

window.addEventListener(
  "load",
  () => {
    syncCommonEffectsStacks();
    window.ScrollTrigger?.refresh();
  },
  { once: true }
);

let commonEffectsResizeFrame;

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(commonEffectsResizeFrame);
  commonEffectsResizeFrame = window.requestAnimationFrame(() => {
    syncCommonEffectsStacks();
    window.ScrollTrigger?.refresh();
  });
});

const initialiseScrollAnimations = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const statsSection = document.querySelector(".section-stats");
  const statNumbers = statsSection?.querySelectorAll(".section-stats__number[data-countup-end]");
  const CountUp = window.countUp?.CountUp;

  if (statsSection && statNumbers?.length && typeof CountUp === "function") {
    const counters = [...statNumbers].map((number) => {
      const counter = new CountUp(number, Number(number.dataset.countupEnd), {
        startVal: 0,
        decimalPlaces: Number(number.dataset.countupDecimals || 0),
        duration: 2,
        useGrouping: false
      });

      if (counter.error) console.error(counter.error);

      return counter;
    });

    window.ScrollTrigger.create({
      trigger: statsSection,
      start: "top 80%",
      once: true,
      onEnter: () => {
        counters.forEach((counter, index) => {
          if (counter.error) return;
          window.gsap.delayedCall(index * 0.1, () => counter.start());
        });
      }
    });
  }

  const activitiesGrid = document.querySelector(".activities__grid");
  const activityCards = activitiesGrid?.querySelectorAll(".activity-card");

  if (activitiesGrid && activityCards?.length) {
    window.gsap.fromTo(
      activityCards,
      {
        autoAlpha: 0,
        y: 32
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: activitiesGrid,
          start: "top 85%",
          once: true
        }
      }
    );
  }

  commonEffectsStacks.forEach((stack) => {
    const cards = [...stack.querySelectorAll(".common-effects-card")];

    cards.slice(0, -1).forEach((card, index) => {
      const cardInner = card.querySelector(".common-effects-card__inner");
      const nextCard = cards[index + 1];
      const targetScale = 1 - (cards.length - 1 - index) * 0.1;
      const getStickyTop = () => Number.parseFloat(window.getComputedStyle(card).top) || 0;
      const getCardOffset = () =>
        Number.parseFloat(window.getComputedStyle(card).getPropertyValue("--common-effects-card-offset")) || 0;

      window.gsap.fromTo(
        cardInner,
        {
          filter: "brightness(1)",
          scale: 1
        },
        {
          filter: "brightness(0.6)",
          scale: targetScale,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: () => `top ${getStickyTop() + card.clientHeight}px`,
            end: () => `top ${getStickyTop() + getCardOffset()}px`,
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
    });
  });

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
        duration: 1,
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

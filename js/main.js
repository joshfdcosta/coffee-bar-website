/* The Coffee Bar — interactions */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Hero entrance ----------
  const hero = document.querySelector(".hero");
  if (hero) {
    let i = 0;
    hero.querySelectorAll(".hero__wordmark .line").forEach((line) => {
      const text = line.textContent;
      line.textContent = "";
      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.style.setProperty("--i", i++);
        // Keep the word gap from collapsing once each glyph is its own inline-block
        span.textContent = ch === " " ? " " : ch;
        line.appendChild(span);
      }
    });
  }

  // ---------- Announcement bar ----------
  // Height feeds back into --announce-h (and, through it, --topbar-h) so the
  // nav, hero padding, scroll-padding and the menu rail's sticky offset all
  // clear it automatically — nothing downstream hardcodes a pixel value.
  const announce = document.querySelector(".announce");
  if (announce) {
    const STORE_KEY = "cb-announce-dismissed";
    const id = announce.dataset.announceId || "default";
    const root = document.documentElement;

    const measure = () => {
      const h = announce.classList.contains("is-hidden") ? 0 : announce.offsetHeight;
      root.style.setProperty("--announce-h", `${h}px`);
    };

    if (localStorage.getItem(STORE_KEY) === id) {
      announce.classList.add("is-hidden");
    } else {
      let resizeTimer;
      window.addEventListener(
        "resize",
        () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(measure, 150);
        },
        { passive: true }
      );
    }
    measure();

    const closeBtn = announce.querySelector(".announce__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        announce.classList.add("is-hidden");
        measure();
        try {
          localStorage.setItem(STORE_KEY, id);
        } catch (e) {}
      });
    }
  }

  // ---------- Nav ----------
  const nav = document.querySelector(".nav");
  if (nav && !nav.classList.contains("nav--solid")) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      links.classList.toggle("is-open", open);
      nav?.classList.toggle("is-menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true")
    );
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ---------- Scroll reveals ----------
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- Matcha ambient wash ----------
  // Hovering a drink bleeds its own colour into the section behind it, so the
  // page takes on whatever you're looking at instead of staying one flat green.
  const matcha = document.querySelector(".matcha");
  if (matcha && !reduceMotion.matches) {
    const wash = matcha.querySelector(".matcha__wash");
    const drinks = matcha.querySelectorAll(".drink[data-wash]");
    drinks.forEach((drink) => {
      const paint = () => {
        const r = drink.getBoundingClientRect();
        const s = matcha.getBoundingClientRect();
        wash.style.setProperty("--wc", drink.dataset.wash);
        wash.style.setProperty("--wx", `${((r.left + r.width / 2 - s.left) / s.width) * 100}%`);
        matcha.classList.add("is-hovering");
      };
      const clear = () => matcha.classList.remove("is-hovering");
      drink.addEventListener("pointerenter", paint);
      drink.addEventListener("pointerleave", clear);
      drink.addEventListener("focusin", paint);
      drink.addEventListener("focusout", clear);
    });
  }

  // ---------- Menu category rail ----------
  // Highlights whichever group is currently in view and keeps that chip
  // scrolled into the visible part of the rail on narrow screens.
  const rail = document.querySelector(".menu-rail");
  if (rail) {
    const chips = [...rail.querySelectorAll("a")];
    const groups = chips
      .map((c) => document.querySelector(c.getAttribute("href")))
      .filter(Boolean);

    if (groups.length) {
      // Scrolls only the horizontal chip strip, never the page. chip.scrollIntoView()
      // walks every scrollable ancestor including the window — and since this rail
      // is position:sticky, browsers resolve that against its static (unstuck) flow
      // position, so it was yanking the whole page back up to where the rail sits
      // in normal flow instead of just sliding the strip sideways.
      const scrollChipIntoView = (chip) => {
        const track = chip.parentElement;
        const left = chip.offsetLeft;
        const right = left + chip.offsetWidth;
        const viewLeft = track.scrollLeft;
        const viewRight = viewLeft + track.clientWidth;
        if (left < viewLeft) track.scrollTo({ left: left - 16, behavior: "smooth" });
        else if (right > viewRight) track.scrollTo({ left: right - track.clientWidth + 16, behavior: "smooth" });
      };

      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const chip = chips.find((c) => c.getAttribute("href") === `#${entry.target.id}`);
            if (!chip || chip.classList.contains("is-active")) return;
            chips.forEach((c) => c.classList.remove("is-active"));
            chip.classList.add("is-active");
            scrollChipIntoView(chip);
          });
        },
        { rootMargin: "-25% 0px -65% 0px" }
      );
      groups.forEach((g) => spy.observe(g));
    }
  }
});

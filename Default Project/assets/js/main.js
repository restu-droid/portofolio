/* ============================================================
   Restu Rosenda — Portfolio
   Interaksi: loader, tema, navigasi, reveal, typewriter,
   progress bar, tilt, kursor, form, dan notifikasi.
   ============================================================ */

(() => {
  "use strict";

  const doc = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");

  const hideLoader = () => {
    body.classList.add("is-loaded");
    if (loader) {
      window.setTimeout(() => loader.setAttribute("aria-hidden", "true"), 700);
    }
  };

  window.addEventListener("load", () => window.setTimeout(hideLoader, 350), { once: true });
  // Pengaman: jangan biarkan loader menutup halaman jika aset lambat dimuat.
  window.setTimeout(hideLoader, 3200);

  /* ---------- Tema terang / gelap ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    doc.setAttribute("data-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "light" ? "#f8f5ef" : "#080b11");
    }
    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Ganti ke tema gelap" : "Ganti ke tema terang"
      );
    }
  };

  let savedTheme = "dark";
  try {
    const stored = localStorage.getItem("rr-theme");
    if (stored === "light" || stored === "dark") savedTheme = stored;
  } catch (error) {
    /* localStorage tidak tersedia — gunakan tema gelap */
  }
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("rr-theme", next);
    } catch (error) {
      /* abaikan */
    }
  });

  /* ---------- Header & tombol kembali ke atas ---------- */
  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 24);
    toTop?.classList.toggle("is-visible", y > 600);

    let current = sections[0];
    const offset = (header?.offsetHeight || 80) + 140;
    sections.forEach((section) => {
      if (y >= section.offsetTop - offset) current = section;
    });

    if (current) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${current.id}`
        );
      });
    }
  };

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        onScroll();
        scrollTicking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------- Menu mobile ---------- */
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    header?.classList.remove("is-open");
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Buka menu navigasi");
  };

  const toggleMenu = () => {
    const isOpen = nav?.classList.toggle("is-open");
    header?.classList.toggle("is-open", Boolean(isOpen));
    body.classList.toggle("menu-open", Boolean(isOpen));
    menuToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    menuToggle?.setAttribute(
      "aria-label",
      isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
    );
  };

  menuToggle?.addEventListener("click", toggleMenu);
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav?.classList.contains("is-open")) return;
    if (event.target.closest("#nav") || event.target.closest("#menuToggle")) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) closeMenu();
  });

  /* ---------- Reveal saat halaman digulir ---------- */
  document.querySelectorAll(".reveal").forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) element.style.setProperty("--delay", `${delay}ms`);
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Progress bar keahlian ---------- */
  const bars = Array.from(document.querySelectorAll(".skill-bar > span"));

  bars.forEach((bar) => {
    const level = bar.dataset.level || "0";
    bar.style.setProperty("--level", `${level}%`);
    if (prefersReduced) bar.style.width = `${level}%`;
  });

  if (!prefersReduced && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          window.setTimeout(() => {
            bar.style.width = `${bar.dataset.level || 0}%`;
          }, 180);
          barObserver.unobserve(bar);
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => barObserver.observe(bar));
  } else {
    bars.forEach((bar) => {
      bar.style.width = `${bar.dataset.level || 0}%`;
    });
  }

  /* ---------- Efek mengetik ---------- */
  const typeTarget = document.getElementById("typewriter");
  const roles = [
    "Pelajar Teknik Komputer Jaringan",
    "Calon Mahasiswa IT",
    "Pembelajar Teknologi",
    "Calon Network Engineer",
  ];

  if (typeTarget) {
    if (prefersReduced) {
      typeTarget.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex += 1;
          typeTarget.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            window.setTimeout(type, 2000);
            return;
          }
          window.setTimeout(type, 55 + Math.random() * 35);
        } else {
          charIndex -= 1;
          typeTarget.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            window.setTimeout(type, 420);
            return;
          }
          window.setTimeout(type, 28);
        }
      };

      window.setTimeout(type, 900);
    }
  }

  /* ---------- Tilt halus pada kartu portrait ---------- */
  const portrait = document.getElementById("portraitWrap");

  if (portrait && finePointer && !prefersReduced && window.innerWidth > 940) {
    let rafId = null;

    portrait.addEventListener("pointermove", (event) => {
      const rect = portrait.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        portrait.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(
          px * 6
        ).toFixed(2)}deg) scale(1.012)`;
      });
    });

    portrait.addEventListener("pointerleave", () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      portrait.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  /* ---------- Cahaya kursor ---------- */
  const glow = document.getElementById("cursorGlow");

  if (glow && finePointer && !prefersReduced) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 3;
    let glowRaf = null;

    body.classList.add("has-pointer");
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

    window.addEventListener(
      "pointermove",
      (event) => {
        glowX = event.clientX;
        glowY = event.clientY;

        if (glowRaf) return;
        glowRaf = window.requestAnimationFrame(() => {
          glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
          glowRaf = null;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Form kontak ---------- */
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4800);
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const email = form.dataset.email || "ceotutu28@gmail.com";
    const name = String(data.get("name") || "").trim();
    const sender = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const mailSubject = encodeURIComponent(`[Portofolio] ${subject}`);
    const mailBody = encodeURIComponent(
      `Halo Restu,\n\n${message}\n\n—\n${name}\n${sender}`
    );

    window.location.href = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`;
    showToast("Terima kasih! Aplikasi email kamu akan terbuka.");
    form.reset();
  });

  /* ---------- Tahun footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

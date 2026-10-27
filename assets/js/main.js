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

  /* ---------- Bahasa ID / EN ---------- */
  const langToggle = document.getElementById("langToggle");
  const translations = {
    id: {
      nav_home: "Beranda",
      nav_about: "Tentang",
      nav_skills: "Keahlian",
      nav_journey: "Perjalanan",
      nav_achievements: "Prestasi",
      nav_goals: "Tujuan",
      nav_contact: "Kontak",
      nav_chat: "Mari Ngobrol",
      hero_eyebrow: "Pelajar Teknik Komputer Jaringan",
      hero_role_prefix: "Seorang",
      hero_lead: "Pelajar kelas XII di SMK Alhadiid 1 Cileungsi yang percaya bahwa teknologi adalah masa depan — dan saya ingin menjadi bagian di dalamnya, bukan sekadar penonton.",
      hero_cta_about: "Kenali Saya",
      hero_cta_contact: "Hubungi Saya",
      hero_note: "Terbuka untuk belajar, kolaborasi, dan peluang baru.",
      hero_cv_download: "Unduh CV (PDF)",
      hero_cv_print: "Cetak CV",
      hero_stat_age: "Usia",
      hero_stat_age_unit: "Tahun",
      hero_stat_class: "Kelas",
      hero_stat_class_unit: "Sekarang",
      hero_stat_major: "Jurusan",
      hero_stat_major_unit: "Jaringan",
      hero_chip1_title: "TKJ",
      hero_chip1_sub: "SMK Alhadiid 1",
      hero_chip2_title: "Praktik Jaringan",
      hero_chip2_sub: "FO & Perangkat Jaringan",
      about_eyebrow: "Tentang Saya",
      about_title: "Seorang pelajar yang percaya pada masa depan teknologi.",
      about_lead: "Nama lengkap saya Restu Rosenda, biasa dipanggil Restu. Saat ini saya berusia 18 tahun dan menempuh kelas XII di SMK Alhadiid 1 Cileungsi dengan jurusan Teknik Komputer Jaringan (TKJ).",
      about_p1: "Saya memilih jurusan ini karena meyakini bahwa ke depan teknologi akan semakin berkembang, perusahaan-perusahaan teknologi akan semakin bermunculan, dan lapangan pekerjaan pun terbuka lebar untuk bidang-bidang seperti ini.",
      about_p2: "Namun bagi saya, memahami teknologi bukan hanya soal pekerjaan semata. Saya ingin benar-benar paham cara kerja teknologi dan tidak termasuk ke dalam persentase orang yang gaptek. Saya juga berniat melanjutkan kuliah di jurusan yang sejalur — seperti IT atau Sistem Informasi — agar pemahaman saya lebih dalam, terarah, dan punya bekal yang jelas.",
      about_sig_meta: "Pelajar TKJ · Kelas XII",
      about_quote: "Teknologi tidak akan pernah berhenti berkembang. Yang bisa saya lakukan adalah terus belajar agar tidak tertinggal.",
      about_quote_by: "— Restu Rosenda",
      about_fact_title: "Data Singkat",
      about_fact_name: "Nama Lengkap",
      about_fact_age: "Usia",
      about_fact_age_val: "18 Tahun",
      about_fact_school: "Sekolah",
      about_fact_major: "Jurusan",
      about_fact_major_val: "Teknik Komputer Jaringan",
      about_fact_class: "Kelas",
      about_fact_class_val: "XII (Dua Belas)",
      about_fact_status: "Status",
      about_fact_status_val: "Pelajar Aktif",
      about_why_title: "Kenapa Memilih TKJ?",
      about_why1_t: "Melihat Jauh ke Depan",
      about_why1_d: "Teknologi terus berkembang, perusahaan teknologi terus bermunculan, dan lapangan kerja di bidang ini terbuka lebar.",
      about_why2_t: "Melek Teknologi",
      about_why2_d: "Bukan hanya untuk bekerja, tetapi agar saya benar-benar paham teknologi dan tidak sekadar menjadi pengguna.",
      about_why3_t: "Bekal Menuju Kuliah",
      about_why3_d: "Menjadi fondasi awal sebelum melanjutkan studi di bidang IT, Sistem Informasi, atau jurusan sejalur lainnya.",
      skills_eyebrow: "Keahlian",
      skills_title: "Kompetensi yang sedang saya bangun.",
      skills_desc: "Bekal dari pembelajaran di sekolah, praktik, dan rasa ingin tahu yang tidak berhenti. Persentase di bawah adalah gambaran jujur mengenai tahap belajar saya saat ini.",
      skills_badge: "Learning by doing",
      skills_intro_t: "Dari kelas, laboratorium, praktik jaringan & PKL.",
      skills_intro_p: "Terbiasa belajar dengan praktik langsung: mulai dari perakitan PC, konfigurasi modem/router untuk akses internet, pengukuran redaman FTTH, konfigurasi server berbasis Linux (Debian/Ubuntu), hingga pekerjaan fiber optic seperti splicing dan pendokumentasian hasil kerja.",
      skills_note: "Sedang memperdalam: Linux Server, routing, dan troubleshooting jaringan.",
      journey_eyebrow: "Perjalanan",
      journey_title: "Belajar di sekolah, praktik, dan pengalaman PKL.",
      journey_desc: "Dokumentasi beberapa kegiatan yang saya lakukan: perakitan PC, setting konfigurasi modem/wifi untuk mendapatkan akses internet dari ISP (Pandawa Global Telematika), pengecekan redaman pada jaringan FTTH, konfigurasi server Linux (Debian/Ubuntu), serta pekerjaan fiber optic saat PKL seperti splicing dan dokumentasi lapangan.",
      ach_eyebrow: "Prestasi & Sertifikasi",
      ach_title: "Bukti pembelajaran yang telah diraih.",
      ach_desc: "Kumpulan sertifikat yang saya peroleh dari pelatihan dan pembelajaran untuk memperkuat kompetensi di bidang teknologi dan jaringan.",
      ach_badge: "Sertifikasi",
      ach_click: "Klik untuk memperbesar",
      ach_1_date: "Terbit: 29 Agustus 2026",
      ach_2_date: "Terbit: 14 Agustus 2026",
      ach_2_code: "Kode: 20260814009878",
      ach_3_date: "09 Mei 2026 – 09 Mei 2027",
      goals_eyebrow: "Tujuan",
      goals_title: "Ke mana saya ingin melangkah.",
      goals_1_t: "Pendidikan",
      goals_1_sub: "Kuliah IT / Sistem Informasi",
      goals_1_d: "Melanjutkan studi ke jenjang perkuliahan di bidang teknologi agar pemahaman saya lebih mendalam, terstruktur, dan siap menghadapi dunia profesional.",
      goals_2_t: "Kompetensi",
      goals_2_sub: "Sertifikasi & Praktik Nyata",
      goals_2_d: "Mengasah kemampuan jaringan dan perangkat keras, mengikuti pelatihan atau sertifikasi, serta memperbanyak praktik langsung.",
      goals_3_t: "Karier",
      goals_3_sub: "Profesional di Dunia Teknologi",
      goals_3_d: "Berkontribusi di perusahaan teknologi sebagai profesional IT — khususnya di bidang jaringan — dengan sikap kerja yang bertanggung jawab.",
      contact_eyebrow: "Kontak",
      contact_title: "Punya pertanyaan atau ingin berdiskusi?",
      contact_desc: "Saya terbuka untuk berdiskusi soal teknologi, jaringan, peluang belajar, atau sekadar bertukar pikiran. Silakan kirim pesan — saya akan berusaha membalas secepatnya.",
      contact_wa: "WhatsApp",
      contact_email: "Email",
      contact_ig: "Instagram",
      contact_loc: "Lokasi Sekolah",
      contact_loc_val: "SMK Alhadiid 1 Cileungsi — Bogor, Jawa Barat",
      contact_edu: "Pendidikan",
      contact_edu_val: "SMK Alhadiid 1 Cileungsi — TKJ",
      contact_form_name: "Nama",
      contact_form_email: "Email",
      contact_form_subject: "Subjek",
      contact_form_message: "Pesan",
      contact_form_btn: "Kirim Pesan",
      contact_form_hint: "Pesan akan dikirim melalui aplikasi email yang terpasang di perangkatmu.",
      footer_desc: "Pelajar TKJ yang percaya bahwa belajar hari ini adalah investasi untuk masa depan.",
      footer_copy: "Seluruh hak cipta dilindungi.",
      footer_made: "Dibuat dengan HTML, CSS & JavaScript."
    },
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_skills: "Skills",
      nav_journey: "Journey",
      nav_achievements: "Achievements",
      nav_goals: "Goals",
      nav_contact: "Contact",
      nav_chat: "Let's Talk",
      hero_eyebrow: "Computer & Network Engineering Student",
      hero_role_prefix: "A",
      hero_lead: "Class XII student at <strong>SMK Alhadiid 1 Cileungsi</strong> who believes technology is the future — and I want to be part of it, not just a spectator.",
      hero_cta_about: "About Me",
      hero_cta_contact: "Contact Me",
      hero_note: "Open to learning, collaboration, and new opportunities.",
      hero_cv_download: "Download CV (PDF)",
      hero_cv_print: "Print CV",
      hero_stat_age: "Age",
      hero_stat_age_unit: "Years Old",
      hero_stat_class: "Grade",
      hero_stat_class_unit: "Current",
      hero_stat_major: "Major",
      hero_stat_major_unit: "Networking",
      hero_chip1_title: "TKJ",
      hero_chip1_sub: "SMK Alhadiid 1",
      hero_chip2_title: "Network Practice",
      hero_chip2_sub: "Fiber Optic & Network Devices",
      about_eyebrow: "About Me",
      about_title: "A student who believes in the <em>future of technology</em>.",
      about_lead: "My full name is <strong>Restu Rosenda</strong>, but you can call me Restu. I'm <strong>18 years old</strong> and currently in <strong>Grade XII</strong> at SMK Alhadiid 1 Cileungsi majoring in <strong>Computer and Network Engineering (TKJ)</strong>.",
      about_p1: "I chose this major because I believe technology will continue to grow, tech companies will keep emerging, and career opportunities in this field will only expand.",
      about_p2: "For me, understanding technology isn't just about finding a job. I want to truly understand how it works and not just be a user. I also plan to continue my studies in a related field such as <strong>IT</strong> or <strong>Information Systems</strong> to build a stronger and more focused foundation.",
      about_sig_meta: "TKJ Student · Grade XII",
      about_quote: "Technology never stops evolving. The best thing I can do is keep learning so I don't fall behind.",
      about_quote_by: "— Restu Rosenda",
      about_fact_title: "Quick Info",
      about_fact_name: "Full Name",
      about_fact_age: "Age",
      about_fact_age_val: "18 Years Old",
      about_fact_school: "School",
      about_fact_major: "Major",
      about_fact_major_val: "Computer & Network Engineering",
      about_fact_class: "Grade",
      about_fact_class_val: "XII",
      about_fact_status: "Status",
      about_fact_status_val: "Active Student",
      about_why_title: "Why I Chose TKJ",
      about_why1_t: "Looking Ahead",
      about_why1_d: "Technology keeps evolving, companies keep growing, and opportunities in this field are wide open.",
      about_why2_t: "Tech-Savvy Mindset",
      about_why2_d: "Not just for work, but to truly understand technology instead of just using it.",
      about_why3_t: "Preparing for College",
      about_why3_d: "Building a solid foundation before pursuing a degree in IT, Information Systems, or a related field.",
      skills_eyebrow: "Skills",
      skills_title: "Competencies I'm <em>building</em>.",
      skills_desc: "Gained through school, hands-on practice, and curiosity. The percentages below are an honest view of my current learning progress.",
      skills_badge: "Learning by doing",
      skills_intro_t: "From class, lab, network practice & internship.",
      skills_intro_p: "Hands-on with PC assembly & troubleshooting, modem/router configuration, FTTH & optical power meter, Linux server (Debian/Ubuntu), fiber optic splicing, and technical documentation.",
      skills_note: "Currently focusing on: Linux Server, routing, and network troubleshooting.",
      journey_eyebrow: "Journey",
      journey_title: "Learning at school, practice, and <em>internship experience</em>.",
      journey_desc: "Documenting my activities: PC assembly, configuring modems/routers for ISP access (Pandawa Global Telematika), FTTH attenuation testing, Linux server configuration, and fiber optic work during internship.",
      ach_eyebrow: "Achievements & Certifications",
      ach_title: "Proof of <em>learning</em>.",
      ach_desc: "A collection of certificates I've earned through training and study to strengthen my skills in technology and networking.",
      ach_badge: "Certification",
      ach_click: "Click to enlarge",
      ach_1_date: "Issued: Aug 29, 2026",
      ach_2_date: "Issued: Aug 14, 2026",
      ach_2_code: "Code: 20260814009878",
      ach_3_date: "May 09, 2026 – May 09, 2027",
      goals_eyebrow: "Goals",
      goals_title: "Where I want to <em>go</em>.",
      goals_1_t: "Education",
      goals_1_sub: "Pursue IT / Information Systems",
      goals_1_d: "Continue to university in a tech-related major to deepen my knowledge and be ready for the professional world.",
      goals_2_t: "Competency",
      goals_2_sub: "Certifications & Real Practice",
      goals_2_d: "Keep sharpening networking and hardware skills through training, certifications, and hands-on practice.",
      goals_3_t: "Career",
      goals_3_sub: "IT Professional",
      goals_3_d: "Contribute to a tech company as an IT professional, especially in networking, with responsibility and dedication.",
      contact_eyebrow: "Contact",
      contact_title: "Have a question or want to <em>discuss</em> something?",
      contact_desc: "I'm open to discussing tech, networking, learning opportunities, or just exchanging ideas. Feel free to reach out — I'll get back to you as soon as I can.",
      contact_wa: "WhatsApp",
      contact_email: "Email",
      contact_ig: "Instagram",
      contact_loc: "School Location",
      contact_loc_val: "SMK Alhadiid 1 Cileungsi — Bogor, West Java",
      contact_edu: "Education",
      contact_edu_val: "SMK Alhadiid 1 Cileungsi — Computer & Network Engineering",
      contact_form_name: "Name",
      contact_form_email: "Email",
      contact_form_subject: "Subject",
      contact_form_placeholder_name: "Your name",
      contact_form_placeholder_email: "name@email.com",
      contact_form_placeholder_subject: "What's this about?",
      contact_form_placeholder_message: "Write your message here...",
      contact_form_message: "Message",
      contact_form_btn: "Send Message",
      contact_form_hint: "Your message will open in your default email app.",
      footer_desc: "A TKJ student who believes learning today is an investment for the future.",
      footer_copy: "All rights reserved.",
      footer_made: "Built with HTML, CSS & JavaScript."
    }
  };

  const applyLang = (lang) => {
    const dict = translations[lang] || translations.id;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (!key || !(key in dict)) return;
      const svg = el.querySelector("svg");
      el.textContent = dict[key];
      if (svg) el.prepend(svg);
    });
    if (langToggle) {
      langToggle.textContent = lang === "en" ? "ID" : "EN";
      langToggle.setAttribute("aria-label", lang === "en" ? "Switch to Indonesian" : "Switch to English");
    }
    document.documentElement.lang = lang === "en" ? "en" : "id";
    try { localStorage.setItem("rr-lang", lang); } catch (e) {}
  };

  let currentLang = "id";
  try {
    const storedLang = localStorage.getItem("rr-lang");
    if (storedLang === "en" || storedLang === "id") currentLang = storedLang;
  } catch (e) {}
  applyLang(currentLang);

  langToggle?.addEventListener("click", () => {
    currentLang = currentLang === "id" ? "en" : "id";
    applyLang(currentLang);
  });

  /* ---------- Download & Print CV ---------- */
  const downloadBtn = document.getElementById("downloadCvBtn");
  const printBtn = document.getElementById("printCvBtn");

  printBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    window.print();
  });

  downloadBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const element = document.documentElement;
    const opt = {
      margin: [10, 10, 12, 10],
      filename: "CV-Restu-Rosenda.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    };
    if (typeof html2pdf === "function") {
      html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  });

  /* ---------- Lightbox Sertifikat ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const certCards = Array.from(document.querySelectorAll(".achievement-card[data-lightbox]"));

  if (lightbox && certCards.length) {
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      const card = certCards[currentIndex];
      if (!card) return;
      const src = card.getAttribute("data-lightbox") || "";
      const caption = card.getAttribute("data-caption") || "";
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = card.querySelector("img")?.alt || "Preview sertifikat";
      }
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      if (lightboxImg) lightboxImg.src = "";
    };

    const showPrev = () => openLightbox((currentIndex - 1 + certCards.length) % certCards.length);
    const showNext = () => openLightbox((currentIndex + 1) % certCards.length);

    certCards.forEach((card, index) => {
      const handler = (e) => {
        e.preventDefault();
        openLightbox(index);
      };
      card.addEventListener("click", handler);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", showPrev);
    lightboxNext?.addEventListener("click", showNext);
    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });
  }

  /* ---------- Tahun footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

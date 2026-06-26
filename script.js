  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GLYPHS = "!<>-_\\/[]{}=+*?#01ABCDEFxyz";
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const target = el.dataset.text;
    if (reduce) { el.textContent = target; return; }
    let frame = 0;
    const lockEvery = 5;
    const totalFrames = target.length * lockEvery + 8;
    const run = () => {
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { out += " "; continue; }
        out += i < frame / lockEvery ? target[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      frame++;
      if (frame >= totalFrames) { el.textContent = target; return; }
      setTimeout(run, 38);
    };
    setTimeout(run, 250);
  });

  const nav = document.getElementById("nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  const root = document.documentElement;
  const btn = document.getElementById("toggle");

  // Dark is the default brand theme. Users can still toggle to light.
  const applyTheme = (mode) => {
    root.dataset.theme = mode;
    if (btn) btn.textContent = `[ ${mode} ]`;
  };
  applyTheme("dark");

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.querySelector(".nav-menu");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    // 点菜单项后收起
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
    // 点击菜单外部收起
    const closeMenu = () => {
      navMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("open")) return;
      if (navMenu.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!navMenu.classList.contains("open")) return;
      closeMenu();
    });
  }

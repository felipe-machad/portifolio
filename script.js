/* =========================================================
   Felipe Machado da Silva — Portfólio · interações
   Vanilla JS, sem dependências.
   ========================================================= */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const progress = document.querySelector(".scroll-progress");
  const yearEl = document.getElementById("year");

  /* Ano dinâmico no rodapé */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav: sombra ao rolar + barra de progresso */
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", y > 30);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = docH > 0 ? (y / docH) * 100 + "%" : "0%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  function setMenu(open) {
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", () =>
      setMenu(!mobileMenu.classList.contains("open"))
    );
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* Reveal on scroll (IntersectionObserver) */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Destaque do link de navegação ativo */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* (Portfólio é um showcase puro — sem formulário/contato.) */

  /* =======================================================
     Trajetória — timeline-gráfico interativa (padrão ARIA tabs)
     ======================================================= */
  const tlTabs = Array.prototype.slice.call(document.querySelectorAll(".tl-node"));
  const tlPanels = Array.prototype.slice.call(document.querySelectorAll(".tl-panel"));

  if (tlTabs.length && tlPanels.length === tlTabs.length) {
    const mqMobile = window.matchMedia("(max-width: 760px)");

    function selectMilestone(idx, setFocus) {
      idx = (idx + tlTabs.length) % tlTabs.length;

      tlTabs.forEach((tab, i) => {
        const active = i === idx;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      tlPanels.forEach((panel, i) => {
        const show = i === idx;
        panel.hidden = !show;
        panel.classList.toggle("is-active", show);
      });

      if (setFocus) {
        tlTabs[idx].focus();
        if (mqMobile.matches) {
          tlPanels[idx].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }

    tlTabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectMilestone(i, true));
      tab.addEventListener("keydown", (e) => {
        let handled = true;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown": selectMilestone(i + 1, true); break;
          case "ArrowLeft":
          case "ArrowUp": selectMilestone(i - 1, true); break;
          case "Home": selectMilestone(0, true); break;
          case "End": selectMilestone(tlTabs.length - 1, true); break;
          default: handled = false;
        }
        if (handled) e.preventDefault();
      });
    });

    selectMilestone(0, false);
  }

  /* =======================================================
     Cursor orgânico "vivo" — ponto macio com atraso elástico
     (respiração) e rastro verde que brota folhinhas (metáfora
     de crescimento contínuo). Apenas desktop/ponteiro fino;
     respeita prefers-reduced-motion.
     ======================================================= */
  (function cursorFx() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cursor-fx");
    const canvas = document.createElement("canvas");
    canvas.className = "cursor-fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: w / 2, y: h / 2, down: false };
    let lastX = mouse.x, lastY = mouse.y, dist = 0;
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("mousedown", () => (mouse.down = true));
    window.addEventListener("mouseup", () => (mouse.down = false));

    const head = { x: mouse.x, y: mouse.y, vx: 0, vy: 0 };
    const GREENS = [[39, 160, 101], [109, 214, 163], [30, 122, 77]];
    const leaves = [];

    let hovering = false;
    const sel = "a, button, .btn, .project, .card, .tl-node";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(sel)) hovering = true; }, { passive: true });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(sel)) hovering = false; }, { passive: true });

    function spawnLeaf(x, y) {
      leaves.push({
        x, y, a: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.05,
        drift: -(0.3 + Math.random() * 0.6), sway: (Math.random() - 0.5) * 0.5,
        life: 0, max: 55 + Math.random() * 45, scale: 0,
        hue: GREENS[Math.floor(Math.random() * GREENS.length)],
      });
    }

    function drawLeaf(x, y, ang, size, alpha, hue) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = `rgba(${hue[0]},${hue[1]},${hue[2]},${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.72, -size * 0.18, 0, size);
      ctx.quadraticCurveTo(-size * 0.72, -size * 0.18, 0, -size);
      ctx.fill();
      ctx.strokeStyle = `rgba(232,250,240,${alpha * 0.55})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0, -size * 0.85); ctx.lineTo(0, size * 0.85); ctx.stroke();
      ctx.restore();
    }

    let t = 0;
    function frame() {
      t++;
      ctx.clearRect(0, 0, w, h);

      const k = 0.16, damp = 0.78;
      head.vx = (head.vx + (mouse.x - head.x) * k) * damp;
      head.vy = (head.vy + (mouse.y - head.y) * k) * damp;
      head.x += head.vx; head.y += head.vy;

      const dx = mouse.x - lastX, dy = mouse.y - lastY;
      dist += Math.hypot(dx, dy); lastX = mouse.x; lastY = mouse.y;
      if (dist > 85) { dist = 0; spawnLeaf(head.x, head.y); }

      const breathe = 1 + Math.sin(t * 0.06) * 0.12;
      const speed = Math.min(1, Math.hypot(head.vx, head.vy) / 14);
      const baseR = (hovering ? 16 : 11) * breathe;
      const r = mouse.down ? baseR * 0.7 : baseR + speed * 6;

      const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 2.6);
      g.addColorStop(0, "rgba(39,160,101,0.30)");
      g.addColorStop(1, "rgba(39,160,101,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(head.x, head.y, r * 2.6, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(30,122,77,0.9)"; ctx.beginPath(); ctx.arc(head.x, head.y, r * 0.42, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(232,250,240,0.95)"; ctx.beginPath(); ctx.arc(head.x, head.y, r * 0.16, 0, 7); ctx.fill();

      for (let i = leaves.length - 1; i >= 0; i--) {
        const s = leaves[i]; s.life++;
        const p = s.life / s.max;
        s.scale = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7;
        s.y += s.drift; s.x += s.sway; s.a += s.vr;
        const sc = Math.max(0, s.scale);
        drawLeaf(s.x, s.y, s.a, 5 + 8 * sc, sc * 0.9, s.hue);
        if (s.life >= s.max) leaves.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }
    frame();

    /* Hover gentil/magnético em projetos e cards */
    document.querySelectorAll(".project, .card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.05}px, ${my * 0.07}px) scale(1.015)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  })();
})();

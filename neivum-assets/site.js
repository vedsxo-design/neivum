(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const copy = {
    ru: {
      skip: "Перейти к содержанию", navSystem: "System", navPulsar: "PULSAR", navArchitecture: "Architecture", navEarly: "Early Access", navCompany: "OrivantAI", openAppShort: "OPEN",
      openNeivum: "Открыть NEIVUM", publicSignal: "Первый публичный сигнал", heroStatement: "Первый сигнал развивающегося интеллекта.", explore: "Исследовать систему", scrollToEnter: "Прокрутите, чтобы войти в сигнал", stageSignal: "Состояние сигнала",
      originTitle: "Каждая большая система начинается с первого сигнала.", originBody: "NEIVUM создаётся поэтапно: от первых работающих моделей к более точной, глубокой и целостной интеллектуальной системе.",
      buildTitle: "Первая работающая точка.", buildBody: "Не финальная система и не обещание недоказанных возможностей. Это инженерная основа, которую можно испытывать, уточнять и развивать.",
      pulsarBody: "Первая точка пробуждения NEIVUM. Ясный и доступный уровень, с которого начинается развитие системы.", character: "Характер", clearDirected: "Ясный / направленный", stage: "Стадия", earlyDevelopment: "Раннее развитие", principle: "Принцип", verifiable: "Проверяемый прогресс",
      notBenchmark: "Концептуальная карта / не бенчмарк", capabilityTitle: "Одна система.\nЧетыре направления работы.", capabilityBody: "Текущая версия исследует практические сценарии взаимодействия без выдуманных метрик и заявлений о превосходстве.", textWork: "Текст", codeWork: "Программный код", informationWork: "Информация", toolsWork: "Цифровые инструменты", developmentDirection: "Направление развития",
      architectureTitle: "Развитие — не список обещаний.\nЭто единая инженерная последовательность.", sequence1Title: "Работающий сигнал", sequence1Body: "Стабильная основа для реальных испытаний.", sequence2Title: "Структура понимания", sequence2Body: "Уточнение контекста, поведения и качества.", sequence3Title: "Связь инструментов", sequence3Body: "Объединение знаний и действий в общей логике.", sequence4Title: "Целостное действие", sequence4Body: "Последовательная работа внутри контекста.", noDates: "Концептуальное направление / без обещаний дат",
      accessTitle: "Первые пользователи не наблюдают историю.\nОни помогают ей начаться.", accessBody: "Тесты, идеи и обратная связь помогают находить слабые места, выбирать приоритеты и формировать направление NEIVUM.", interest: "Интерес", testing: "Тестирование платформы", development: "Разработка и код", research: "Исследования и знания", feedback: "Обратная связь", requestAccess: "Запросить ранний доступ", formDisclosure: "Локальная демонстрация: данные не отправляются на сервер.", invalidEmail: "Укажите корректный email.", requestSaved: "Первый сигнал принят. Запрос сохранён локально.",
      finalTitle: "Предел возможностей искусственного интеллекта ещё не определён.", finalBody: "Но каждый новый рубеж начинается с первого шага — и с тех, кто готов сделать его раньше остальных. Путь NEIVUM только начинается.", transmitSignal: "Передать первый сигнал", backTop: "Вернуться к началу ↑"
    },
    en: {
      skip: "Skip to content", navSystem: "System", navPulsar: "PULSAR", navArchitecture: "Architecture", navEarly: "Early Access", navCompany: "OrivantAI", openAppShort: "OPEN",
      openNeivum: "Open NEIVUM", publicSignal: "First public signal", heroStatement: "The first signal of an evolving intelligence.", explore: "Explore the system", scrollToEnter: "Scroll to enter the signal", stageSignal: "Signal state",
      originTitle: "Every significant system begins with a first signal.", originBody: "NEIVUM is built in stages: from the first working models toward a more precise, deeper and more coherent intelligence system.",
      buildTitle: "The first working point.", buildBody: "Not a finished system and not a promise of unverified capabilities. It is an engineering foundation that can be tested, refined and developed.",
      pulsarBody: "The first point of NEIVUM awakening. A clear and accessible level from which the system begins to develop.", character: "Character", clearDirected: "Clear / directed", stage: "Stage", earlyDevelopment: "Early development", principle: "Principle", verifiable: "Verifiable progress",
      notBenchmark: "Concept map / not a benchmark", capabilityTitle: "One system.\nFour directions of work.", capabilityBody: "The current version explores practical interaction without fabricated metrics or claims of superiority.", textWork: "Text", codeWork: "Software code", informationWork: "Information", toolsWork: "Digital tools", developmentDirection: "Development direction",
      architectureTitle: "Development is not a list of promises.\nIt is one engineering sequence.", sequence1Title: "Working signal", sequence1Body: "A stable foundation for real testing.", sequence2Title: "Structure of understanding", sequence2Body: "Refining context, behavior and quality.", sequence3Title: "Connected tools", sequence3Body: "Uniting knowledge and action in a shared logic.", sequence4Title: "Coherent action", sequence4Body: "Consistent work inside context.", noDates: "Conceptual direction / no timeline promises",
      accessTitle: "Early users do not watch history.\nThey help it begin.", accessBody: "Tests, ideas and feedback help expose weak points, choose priorities and shape the direction of NEIVUM.", interest: "Interest", testing: "Platform testing", development: "Development and code", research: "Research and knowledge", feedback: "Product feedback", requestAccess: "Request early access", formDisclosure: "Local demonstration: data is not sent to a server.", invalidEmail: "Enter a valid email address.", requestSaved: "First signal received. Request saved locally.",
      finalTitle: "The limits of artificial intelligence have not yet been defined.", finalBody: "But every new frontier begins with a first step—and with those ready to take it before everyone else. The path of NEIVUM is only beginning.", transmitSignal: "Transmit the first signal", backTop: "Return to origin ↑"
    }
  };

  let language = "ru";
  const t = (key) => copy[language][key] || key;

  function setLanguage(next) {
    language = next in copy ? next : "ru";
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
    $$("[data-i18n]").forEach((element) => {
      const value = copy[language][element.dataset.i18n];
      if (!value) return;
      const lines = value.split("\n");
      element.replaceChildren();
      lines.forEach((line, index) => {
        if (index) element.append(document.createElement("br"));
        element.append(document.createTextNode(line));
      });
    });
    $("#language-toggle").textContent = language === "ru" ? "EN" : "RU";
    $("#language-toggle").setAttribute("aria-label", language === "ru" ? "Switch to English" : "Переключить на русский");
    window.NEIVUM?.storage.set("neivum.language", language);
  }

  function setupNavigation() {
    const header = $("#site-header");
    const menu = $("#mobile-menu");
    const toggle = $("#menu-toggle");
    const close = () => {
      menu.classList.remove("is-open");
      menu.inert = true;
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", language === "ru" ? "Открыть меню" : "Open menu");
      document.body.classList.remove("menu-open");
    };
    const open = () => {
      menu.classList.add("is-open");
      menu.inert = false;
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", language === "ru" ? "Закрыть меню" : "Close menu");
      document.body.classList.add("menu-open");
    };
    toggle.addEventListener("click", () => menu.classList.contains("is-open") ? close() : open());
    $$("#mobile-menu a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
    const update = () => header.classList.toggle("is-scrolled", scrollY > 18);
    update();
    addEventListener("scroll", update, { passive: true });
  }

  class PulsarField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!this.ctx) return;
      this.profile = window.NEIVUM_DEVICE?.profile || {};
      this.width = 1;
      this.height = 1;
      this.dpr = 1;
      this.progress = 0;
      this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      this.last = 0;
      this.time = 0;
      this.running = !document.hidden;
      this.lowPower = this.profile.quality === "safe";
      this.mobile = this.profile.device === "phone" || this.profile.device === "tablet";
      this.interval = 1000 / (this.profile.fps || (this.mobile ? 30 : 60));
      const nodeCount = this.lowPower ? 18 : this.mobile ? 30 : 54;
      this.nodes = Array.from({ length: nodeCount }, (_, i) => ({
        angle: i * 2.399963,
        radius: .12 + ((i * 37) % 100) / 155,
        speed: .025 + (i % 9) * .005,
        phase: (i % 13) / 13 * Math.PI * 2,
        size: .45 + (i % 4) * .22
      }));
      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.onPointer = this.onPointer.bind(this);
      this.resize();
      addEventListener("resize", this.resize, { passive: true });
      if (this.profile.hover !== false) addEventListener("pointermove", this.onPointer, { passive: true });
      addEventListener("neivum:device", (event) => {
        this.profile = event.detail || this.profile;
        this.lowPower = this.profile.quality === "safe";
        this.mobile = this.profile.device === "phone" || this.profile.device === "tablet";
        this.interval = 1000 / (this.profile.fps || (this.mobile ? 30 : 60));
        this.resize();
      });
      document.addEventListener("visibilitychange", () => {
        this.running = !document.hidden;
        if (this.running && !reduceMotion.matches) requestAnimationFrame(this.frame);
      });
      if (reduceMotion.matches) this.render(0, true);
      else requestAnimationFrame(this.frame);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.dpr = Math.min(devicePixelRatio || 1, this.profile.dprCap || (this.lowPower ? 1 : 1.55));
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (reduceMotion.matches) this.render(0, true);
    }

    onPointer(event) {
      if (this.profile.coarse || this.lowPower) return;
      this.pointer.tx = event.clientX / innerWidth - .5;
      this.pointer.ty = event.clientY / innerHeight - .5;
    }

    setProgress(value) { this.progress = Math.min(1, Math.max(0, value)); }

    filament(cx, cy, index, unit) {
      const ctx = this.ctx;
      const phase = index / 18 * Math.PI * 2;
      const reach = unit * (.14 + this.progress * .28 + (index % 4) * .012);
      const curl = .68 + this.progress * .23;
      ctx.beginPath();
      for (let point = 0; point <= 46; point += 1) {
        const p = point / 46;
        const angle = phase + Math.sin(p * Math.PI) * curl + this.time * .012 * (index % 2 ? 1 : -1);
        const r = unit * .055 + reach * p;
        const wave = Math.sin(p * 17 + phase * 3 + this.time * .45) * unit * .0035 * p;
        const x = cx + Math.cos(angle) * (r + wave);
        const y = cy + Math.sin(angle) * (r + wave) * (.58 + this.progress * .17);
        if (!point) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(191, 203, 247, ${.025 + this.progress * .055})`;
      ctx.lineWidth = .55;
      ctx.stroke();
    }

    contour(cx, cy, unit, ring) {
      const ctx = this.ctx;
      const points = this.lowPower ? 90 : 150;
      const base = unit * (.075 + ring * .037 + this.progress * ring * .006);
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const a = i / points * Math.PI * 2;
        const fracture = Math.sin(a * 3 + ring * .8 + this.time * .22) * unit * (.003 + ring * .0007);
        const asymmetry = 1 + Math.sin(a - .8) * .06 * this.progress;
        const r = (base + fracture) * asymmetry;
        const x = cx + Math.cos(a + ring * .09) * r * (1 + this.progress * .16);
        const y = cy + Math.sin(a + ring * .09) * r * (.56 + this.progress * .12);
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(207, 215, 247, ${.19 - ring * .018 + this.progress * .012})`;
      ctx.lineWidth = ring < 2 ? 1.15 : .62;
      if (ring > 6) ctx.setLineDash([1.2, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    render(timestamp, still = false) {
      const ctx = this.ctx;
      if (!ctx) return;
      if (!still) this.time = timestamp * .001;
      this.pointer.x += (this.pointer.tx - this.pointer.x) * .035;
      this.pointer.y += (this.pointer.ty - this.pointer.y) * .035;
      const mobile = this.mobile || this.width < 760;
      const unit = Math.min(this.width, this.height);
      const cx = this.width * (mobile ? .66 : .715) + this.pointer.x * unit * .035;
      const cy = this.height * (mobile ? .57 : .5) + this.pointer.y * unit * .026;
      const pulse = still ? .45 : .5 + Math.sin(this.time * 1.34) * .5;
      ctx.clearRect(0, 0, this.width, this.height);

      const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * .43);
      field.addColorStop(0, `rgba(164,177,236,${.11 + this.progress * .03})`);
      field.addColorStop(.25, "rgba(92,106,168,.055)");
      field.addColorStop(1, "rgba(3,4,5,0)");
      ctx.fillStyle = field;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const ringCount = Math.round((this.lowPower ? 3 : 4) + this.progress * (this.lowPower ? 4 : this.mobile ? 5 : 7));
      for (let i = 0; i < ringCount; i += 1) this.contour(cx, cy, unit, i);
      const filamentCount = Math.round(this.progress * (this.lowPower ? 7 : this.mobile ? 11 : 18));
      for (let i = 0; i < filamentCount; i += 1) this.filament(cx, cy, i, unit);

      const lineY = cy + Math.sin(this.time * .72) * unit * .006;
      const scan = ctx.createLinearGradient(cx - unit * .52, lineY, cx + unit * .52, lineY);
      scan.addColorStop(0, "rgba(214,222,252,0)");
      scan.addColorStop(.42, `rgba(214,222,252,${.08 + this.progress * .09})`);
      scan.addColorStop(.495, "rgba(243,246,255,.72)");
      scan.addColorStop(.505, "rgba(243,246,255,.72)");
      scan.addColorStop(.58, `rgba(214,222,252,${.08 + this.progress * .09})`);
      scan.addColorStop(1, "rgba(214,222,252,0)");
      ctx.beginPath(); ctx.moveTo(cx - unit * .52, lineY); ctx.lineTo(cx + unit * .52, lineY); ctx.strokeStyle = scan; ctx.lineWidth = .7; ctx.stroke();

      this.nodes.slice(0, Math.round(12 + this.progress * this.nodes.length)).forEach((node) => {
        const a = node.angle + this.time * node.speed;
        const radius = node.radius * unit * (.48 + this.progress * .62) + Math.sin(this.time * .5 + node.phase) * unit * .006;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius * (.61 + this.progress * .09);
        ctx.beginPath(); ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,219,250,${.12 + this.progress * .18})`; ctx.fill();
      });

      const core = ctx.createRadialGradient(cx - unit * .008, cy - unit * .008, 0, cx, cy, unit * .055);
      core.addColorStop(0, "rgba(255,255,255,.98)");
      core.addColorStop(.08, "rgba(207,216,255,.88)");
      core.addColorStop(.3, "rgba(93,108,170,.48)");
      core.addColorStop(1, "rgba(20,24,36,0)");
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(cx, cy, unit * (.051 + pulse * .0025), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    frame(timestamp) {
      if (!this.running || reduceMotion.matches) return;
      if (timestamp - this.last >= this.interval) {
        this.last = timestamp;
        this.render(timestamp);
      }
      requestAnimationFrame(this.frame);
    }
  }

  function setupStory(field) {
    const narrative = $(".signal-narrative");
    const beats = $$(".story-beat");
    const label = $("#phase-label");
    const index = $("#phase-index");
    const updateProgress = () => {
      const viewportHeight = window.visualViewport?.height || innerHeight;
      const rect = narrative.getBoundingClientRect();
      const travel = Math.max(1, narrative.offsetHeight - viewportHeight);
      field?.setProgress(Math.min(1, Math.max(0, -rect.top / travel)));
      let closest = beats[0];
      let distance = Infinity;
      beats.forEach((beat) => {
        const beatRect = beat.getBoundingClientRect();
        const current = Math.abs(beatRect.top + beatRect.height / 2 - viewportHeight / 2);
        if (current < distance) { distance = current; closest = beat; }
      });
      beats.forEach((beat) => beat.classList.toggle("is-active", beat === closest));
      label.textContent = closest.dataset.label;
      index.textContent = String(beats.indexOf(closest)).padStart(2, "0");
    };
    updateProgress();
    addEventListener("scroll", updateProgress, { passive: true });
    addEventListener("resize", updateProgress, { passive: true });
    addEventListener("neivum:viewport", updateProgress, { passive: true });
  }

  function setupSectionReveal() {
    const sections = $$(".capability-surface, .architecture, .early-access, .orivant-finale");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12%", threshold: .08 });
    sections.forEach((section) => observer.observe(section));
  }

  function setupForm() {
    const form = $("#early-access-form");
    const email = $("#access-email");
    const status = $("#form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        status.style.color = "var(--danger)";
        status.textContent = t("invalidEmail");
        email.focus();
        return;
      }
      const request = { email: value, focus: $("#access-focus").value, build: "NEIVUM 0.1", signal: "PULSAR" };
      try { localStorage.setItem("neivum.earlyAccessDemo", JSON.stringify(request)); } catch (_) { /* local demo can continue */ }
      status.style.color = "var(--green)";
      status.textContent = t("requestSaved");
      form.reset();
      window.NEIVUM?.sound.play("activate", .55);
    });
  }

  function init() {
    language = window.NEIVUM?.storage.get("neivum.language", "ru") || "ru";
    setupNavigation();
    $("#language-toggle").addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
    setLanguage(language);
    const canvas = $("#pulsar-canvas");
    const field = canvas ? new PulsarField(canvas) : null;
    setupStory(field);
    setupSectionReveal();
    setupForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

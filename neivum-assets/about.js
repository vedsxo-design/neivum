(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const copy = {
    ru: {
      skip: "Перейти к содержанию", navSystem: "System", navPulsar: "PULSAR", navArchitecture: "Architecture", navEarly: "Early Access", navCompany: "About OrivantAI", openShort: "OPEN", openNeivum: "Открыть NEIVUM",
      heroLead: "Мы создаём NEIVUM поэтапно — от первого работающего сигнала к более точной и целостной интеллектуальной системе.", enterStory: "Войти в историю происхождения",
      originTitle: "Каждая большая система начинается с первого сигнала.", originBody: "OrivantAI начинается не с обещания завершённого интеллекта, а с инженерно проверяемой первой версии. NEIVUM 0.1 — открытая точка отсчёта.",
      neivumTitle: "Сначала — работающий сигнал. Затем — система.", neivumBody: "NEIVUM создаётся итеративно: реальные сценарии, наблюдение за слабостями, уточнение архитектуры и следующий проверяемый шаг. Платформа не скрывает раннюю стадию — она делает её частью продукта.",
      pulsarBody: "Название отсылает к нейтронной звезде: сверхплотное ядро, наклонённая магнитная ось и два луча, которые становятся наблюдаемым импульсом при вращении. Для NEIVUM это метафора первого устойчивого интеллектуального сигнала.",
      filmIntro: "Фильм фиксирует первую публичную точку NEIVUM: не финал системы, а момент, когда её первый сигнал становится видимым.", filmReady: "Видео загрузится с YouTube только после нажатия.", filmLoading: "Устанавливается защищённое соединение с YouTube…", filmLoaded: "Launch Film загружен. Атмосфера NEIVUM приглушена.", closeFilm: "Закрыть фильм", restoreAtmosphere: "Вернуть атмосферу NEIVUM", openYoutube: "Открыть трейлер на YouTube ↗",
      principlesTitle: "Дисциплина важнее громкости обещаний.", principle1: "Проверяемый прогресс", principle1Body: "Каждая версия должна быть реальной основой для испытаний, а не заявлением о будущем.", principle2: "Целостная архитектура", principle2Body: "Текст, код, информация и инструменты развиваются как направления одной системы.", principle3: "Инженерная честность", principle3Body: "NEIVUM 0.1 не выдаёт раннюю стадию за завершённый интеллект.", principle4: "Реальные сценарии", principle4Body: "Развитие определяется наблюдаемым применением и качественной обратной связью.",
      participantsTitle: "Первые пользователи помогают системе увидеть собственные границы.", participantsBody: "Их тесты обнаруживают слабые места, обратная связь влияет на приоритеты, а реальные задачи формируют направление следующего инженерного шага.", joinAccess: "Присоединиться к раннему доступу",
      finalTitle: "Путь NEIVUM только начинается.", finalBody: "NEIVUM 0.1 — первый публичный сигнал OrivantAI. Следующая часть истории формируется внутри системы.", officialSite: "Официальный сайт ↗", backTop: "Вернуться к началу ↑"
    },
    en: {
      skip: "Skip to content", navSystem: "System", navPulsar: "PULSAR", navArchitecture: "Architecture", navEarly: "Early Access", navCompany: "About OrivantAI", openShort: "OPEN", openNeivum: "Open NEIVUM",
      heroLead: "We are building NEIVUM in stages—from its first working signal toward a more precise and coherent intelligence system.", enterStory: "Enter the origin story",
      originTitle: "Every significant system begins with a first signal.", originBody: "OrivantAI begins not with a promise of finished intelligence, but with an engineering-verifiable first release. NEIVUM 0.1 is an open point of origin.",
      neivumTitle: "First, a working signal. Then, a system.", neivumBody: "NEIVUM is built iteratively: real scenarios, observed weaknesses, architectural refinement and the next verifiable step. The platform does not conceal its early stage—it makes it part of the product.",
      pulsarBody: "The name refers to a neutron star: an ultra-dense core, an oblique magnetic axis and two beams that become an observed pulse as the star rotates. For NEIVUM, it is the metaphor for its first stable intelligence signal.",
      filmIntro: "The film records NEIVUM's first public point: not the end of a system, but the moment its first signal becomes visible.", filmReady: "YouTube will load only after you press play.", filmLoading: "Establishing a privacy-enhanced YouTube connection…", filmLoaded: "Launch Film loaded. The NEIVUM atmosphere has been muted.", closeFilm: "Close film", restoreAtmosphere: "Restore NEIVUM atmosphere", openYoutube: "Open trailer on YouTube ↗",
      principlesTitle: "Discipline matters more than the volume of promises.", principle1: "Verifiable progress", principle1Body: "Each release must be a real basis for testing, not a claim about the future.", principle2: "Coherent architecture", principle2Body: "Text, code, information and tools evolve as directions of one system.", principle3: "Engineering honesty", principle3Body: "NEIVUM 0.1 does not present an early release as completed intelligence.", principle4: "Real scenarios", principle4Body: "Development is shaped by observed use and high-quality feedback.",
      participantsTitle: "Early users help the system see its own boundaries.", participantsBody: "Their tests expose weak points, feedback affects priorities, and real work shapes the direction of the next engineering step.", joinAccess: "Join early access",
      finalTitle: "The path of NEIVUM is only beginning.", finalBody: "NEIVUM 0.1 is OrivantAI's first public signal. The next part of the story is formed inside the system.", officialSite: "Official website ↗", backTop: "Return to origin ↑"
    }
  };

  let language = "ru";
  const t = (key) => copy[language]?.[key] || key;

  function setLanguage(next) {
    language = next in copy ? next : "ru";
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
    $$('[data-i18n]').forEach((element) => {
      const value = copy[language][element.dataset.i18n];
      if (value) element.textContent = value;
    });
    const toggle = $("#language-toggle");
    toggle.textContent = language === "ru" ? "EN" : "RU";
    toggle.setAttribute("aria-label", language === "ru" ? "Switch to English" : "Переключить на русский");
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
    toggle.addEventListener("click", () => {
      const opening = !menu.classList.contains("is-open");
      if (opening) {
        menu.classList.add("is-open");
        menu.inert = false;
        menu.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", language === "ru" ? "Закрыть меню" : "Close menu");
        document.body.classList.add("menu-open");
      } else close();
    });
    $$("#mobile-menu a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
    const update = () => header.classList.toggle("is-scrolled", scrollY > 18);
    update();
    addEventListener("scroll", update, { passive: true });
  }

  class AboutFallbackPulsar {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      this.profile = window.NEIVUM_DEVICE?.profile || {};
      this.progress = .82;
      this.time = 0;
      this.last = 0;
      this.running = !document.hidden;
      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.resize();
      addEventListener("resize", this.resize, { passive: true });
      document.addEventListener("visibilitychange", () => {
        this.running = !document.hidden;
        if (this.running && !reduceMotion.matches) requestAnimationFrame(this.frame);
      });
      if (reduceMotion.matches) this.draw(0, true); else requestAnimationFrame(this.frame);
    }

    setProgress(value) { this.progress = Math.min(1, Math.max(0, Number(value) || 0)); }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      const dpr = Math.min(devicePixelRatio || 1, this.profile.dprCap || 1);
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion.matches) this.draw(0, true);
    }

    draw(timestamp, still = false) {
      if (!this.ctx) return;
      if (!still) this.time = timestamp * .001;
      const ctx = this.ctx;
      const unit = Math.min(this.width, this.height);
      const compact = this.width < 760;
      const cx = this.width * (compact ? .64 : .715);
      const cy = this.height * (compact ? .47 : .48);
      const radius = unit * (compact ? .052 : .058);
      const axis = -.62 + Math.sin(this.time * .24) * (still ? 0 : .34);
      const pulse = still ? .7 : .55 + Math.pow(.5 + .5 * Math.cos(this.time * .72), 7) * .45;
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * .32);
      halo.addColorStop(0, "rgba(151,166,224,.18)");
      halo.addColorStop(.27, "rgba(91,107,172,.07)");
      halo.addColorStop(1, "rgba(3,4,5,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(axis + Math.PI / 2);
      for (let i = 0; i < 7; i += 1) {
        const reach = unit * (.12 + i * .045);
        ctx.beginPath();
        ctx.moveTo(0, -radius * .72);
        ctx.bezierCurveTo(reach * .56, -reach * .46, reach, reach * .07, 0, radius * .72);
        ctx.bezierCurveTo(-reach, reach * .07, -reach * .56, -reach * .46, 0, -radius * .72);
        ctx.strokeStyle = `rgba(187,199,239,${.12 - i * .012})`;
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(axis);
      [-1, 1].forEach((direction) => {
        const reach = unit * .58;
        const gradient = ctx.createLinearGradient(radius * direction, 0, reach * direction, 0);
        gradient.addColorStop(0, `rgba(230,236,255,${.3 * pulse})`);
        gradient.addColorStop(.34, `rgba(143,160,220,${.14 * pulse})`);
        gradient.addColorStop(1, "rgba(105,123,190,0)");
        ctx.beginPath();
        ctx.moveTo(radius * .8 * direction, -unit * .005);
        ctx.lineTo(reach * direction, -unit * .035);
        ctx.lineTo(reach * direction, unit * .035);
        ctx.lineTo(radius * .8 * direction, unit * .005);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      ctx.restore();

      const core = ctx.createRadialGradient(cx - radius * .34, cy - radius * .3, 0, cx, cy, radius);
      core.addColorStop(0, "rgba(255,255,255,.99)");
      core.addColorStop(.22, "rgba(226,232,252,.98)");
      core.addColorStop(.64, "rgba(119,133,181,.92)");
      core.addColorStop(1, "rgba(40,47,67,.74)");
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(226,233,255,${.34 + pulse * .18})`;
      ctx.lineWidth = .8;
      ctx.stroke();
      ctx.restore();
    }

    frame(timestamp) {
      if (!this.running || reduceMotion.matches) return;
      if (timestamp - this.last > 1000 / (this.profile.fps || 24)) {
        this.last = timestamp;
        this.draw(timestamp);
      }
      requestAnimationFrame(this.frame);
    }
  }

  function setupPulsar() {
    const canvas = $("#about-pulsar-canvas");
    const Renderer = window.NEIVUM_PULSAR?.Renderer;
    const renderer = canvas ? (Renderer ? new Renderer(canvas, AboutFallbackPulsar) : new AboutFallbackPulsar(canvas)) : null;
    renderer?.setProgress(.82);
  }

  function setupReveal() {
    const sections = $$(".reveal");
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
    }, { rootMargin: "0px 0px -10%", threshold: .07 });
    sections.forEach((section) => observer.observe(section));
  }

  function setupFilm() {
    const shell = $("#film-shell");
    const viewport = $("#film-viewport");
    const initialPoster = $("[data-film-player]", viewport).cloneNode(true);
    const status = $("#film-status");
    const close = $("#film-close");
    const restore = $("#restore-atmosphere");
    let frame = null;
    let timer = 0;
    let atmosphereWasAudible = false;

    const bindPoster = (button) => {
      button.setAttribute("aria-label", language === "ru" ? "Воспроизвести официальный Launch Film NEIVUM 0.1" : "Play the official NEIVUM 0.1 Launch Film");
      button.addEventListener("click", () => {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        shell.classList.add("is-activating");
        status.dataset.i18n = "filmLoading";
        status.textContent = t("filmLoading");
        atmosphereWasAudible = window.NEIVUM?.sound.duckForMedia?.() || false;
        restore.hidden = true;
        window.NEIVUM?.sound.play("open", .42);

        timer = window.setTimeout(() => {
          frame = document.createElement("iframe");
          frame.title = "NEIVUM 0.1 — The First Signal — Official Launch Film";
          frame.src = "https://www.youtube-nocookie.com/embed/l2cALhZG3f8?autoplay=1&rel=0&modestbranding=1";
          frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          frame.referrerPolicy = "strict-origin-when-cross-origin";
          frame.allowFullscreen = true;
          shell.classList.remove("is-activating");
          shell.classList.add("is-loading");
          viewport.replaceChildren(frame);
          close.hidden = false;
          frame.addEventListener("load", () => {
            shell.classList.remove("is-loading");
            status.dataset.i18n = "filmLoaded";
            status.textContent = t("filmLoaded");
          }, { once: true });
        }, reduceMotion.matches ? 20 : 430);
      }, { once: true });
    };

    const resetPoster = () => {
      clearTimeout(timer);
      frame?.remove();
      frame = null;
      shell.classList.remove("is-loading", "is-activating");
      const poster = initialPoster.cloneNode(true);
      viewport.replaceChildren(poster);
      bindPoster(poster);
      close.hidden = true;
      atmosphereWasAudible = window.NEIVUM?.sound.releaseMedia?.() || atmosphereWasAudible;
      restore.hidden = !atmosphereWasAudible;
      status.dataset.i18n = "filmReady";
      status.textContent = t("filmReady");
    };

    bindPoster($("[data-film-player]", viewport));
    close.addEventListener("click", resetPoster);
    restore.addEventListener("click", () => {
      if (window.NEIVUM?.sound.restoreAfterMedia?.()) {
        atmosphereWasAudible = false;
        restore.hidden = true;
      }
    });
  }

  function init() {
    language = window.NEIVUM?.storage.get("neivum.language", "ru") || "ru";
    setupNavigation();
    setupPulsar();
    setupReveal();
    setupFilm();
    $("#language-toggle").addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
    setLanguage(language);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

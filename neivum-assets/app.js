(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const THREADS_KEY = "neivum.threads.v1";
  const ACTIVE_KEY = "neivum.activeThread";
  const API_CONFIG = Object.freeze({ endpoint: null, mode: "demo" });

  const translations = {
    ru: {
      skip: "Перейти к диалогу", newConversation: "Новый диалог", localHistory: "Локальная история", emptyHistory: "История появится после первого сигнала.", settings: "Настройки", backSite: "Официальный сайт",
      welcomeTitle: "Какой сигнал вы хотите передать?", welcomeBody: "Начните новый диалог или выберите направление. Сейчас открыт прозрачный демонстрационный режим без подключения к реальной AI-модели.", promptText: "Работа с текстом", promptCode: "Программный код", promptAnalysis: "Анализ информации", promptIdea: "Исследование идеи", promptTextNote: "Структура, ясность, редактура", promptCodeNote: "Логика, ошибки, объяснение", promptAnalysisNote: "Факты, связи, выводы", promptIdeaNote: "Гипотезы, риски, проверка", messagePlaceholder: "Передайте сигнал…", demoDisclosure: "Подготовленные локальные ответы. Реальная модель и внешний API не подключены.",
      soundscape: "Музыкальная атмосфера", soundscapeNote: "Оригинальный 96-секундный трек NEIVUM", volume: "Громкость", volumeNote: "Музыка и интерфейсные сигналы", language: "Язык интерфейса", deviceMode: "Режим устройства", deviceNote: "Проверяется до запуска визуальных эффектов", privacyNote: "Диалоги хранятся только в localStorage этого браузера. Они не отправляются OrivantAI или сторонним сервисам.",
      promptTextValue: "Помоги улучшить и структурировать текст.", promptCodeValue: "Помоги разобрать программный код и логику решения.", promptAnalysisValue: "Помоги проанализировать информацию и выделить главное.", promptIdeaValue: "Давай исследуем идею и проверим её слабые места.",
      you: "Вы", assistant: "NEIVUM / PULSAR", untitled: "Новый сигнал", deleteThread: "Удалить диалог", openThread: "Открыть диалог", sending: "Обработка сигнала",
      demoText: "Сигнал принят. В демонстрационном режиме я могу показать структуру ответа: определить цель текста, убрать повторы, выстроить аргументы и подготовить ясную финальную версию. Реальная модель NEIVUM здесь пока не подключена.",
      demoCode: "Сигнал принят. Для разбора кода я бы последовательно проверил входные данные, состояние программы, поток управления, граничные случаи и сложность решения. Сейчас это подготовленный ответ интерфейса, а не результат работы подключённой модели.",
      demoAnalysis: "Сигнал принят. Анализ можно разделить на факты, предположения, противоречия, недостающие данные и практический вывод. В текущей сборке отображается локальный демонстрационный ответ без передачи данных на сервер.",
      demoIdea: "Сигнал принят. Идею полезно проверить через цель, исходные допущения, механизм работы, возможные опровержения и минимальный эксперимент. Это демонстрация будущего сценария взаимодействия NEIVUM.",
      demoGeneric: "Сигнал принят. Сейчас NEIVUM работает в прозрачном интерфейсном демо: сообщение сохранено только в локальной истории, а ответ выбран из подготовленных сценариев. Архитектура готова к будущему подключению проверенного API.",
      historyRestored: "Локальный диалог восстановлен"
    },
    en: {
      skip: "Skip to conversation", newConversation: "New conversation", localHistory: "Local history", emptyHistory: "History will appear after the first signal.", settings: "Settings", backSite: "Official website",
      welcomeTitle: "What signal would you like to transmit?", welcomeBody: "Start a new conversation or choose a direction. This is a transparent interface demonstration with no live AI model connected.", promptText: "Work with text", promptCode: "Software code", promptAnalysis: "Analyze information", promptIdea: "Explore an idea", promptTextNote: "Structure, clarity, editing", promptCodeNote: "Logic, errors, explanation", promptAnalysisNote: "Facts, relations, conclusions", promptIdeaNote: "Hypotheses, risks, validation", messagePlaceholder: "Transmit a signal…", demoDisclosure: "Prepared local responses. No live model or external API is connected.",
      soundscape: "Musical atmosphere", soundscapeNote: "Original 96-second NEIVUM score", volume: "Volume", volumeNote: "Music and interface signals", language: "Interface language", deviceMode: "Device mode", deviceNote: "Checked before visual effects start", privacyNote: "Conversations are stored only in this browser's localStorage. They are not sent to OrivantAI or third-party services.",
      promptTextValue: "Help me improve and structure a piece of text.", promptCodeValue: "Help me examine software code and the solution logic.", promptAnalysisValue: "Help me analyze information and identify what matters.", promptIdeaValue: "Let's explore an idea and test its weak points.",
      you: "You", assistant: "NEIVUM / PULSAR", untitled: "New signal", deleteThread: "Delete conversation", openThread: "Open conversation", sending: "Processing signal",
      demoText: "Signal received. In demonstration mode I can show the response structure: identify the text's goal, remove repetition, organize the argument and prepare a clear final version. No live NEIVUM model is connected here yet.",
      demoCode: "Signal received. To examine code, I would check inputs, program state, control flow, edge cases and solution complexity in sequence. This is a prepared interface response, not output from a connected model.",
      demoAnalysis: "Signal received. Analysis can be separated into facts, assumptions, contradictions, missing information and a practical conclusion. This build displays a local demonstration response without sending data to a server.",
      demoIdea: "Signal received. An idea can be tested through its goal, assumptions, working mechanism, possible falsification and a minimal experiment. This demonstrates a future NEIVUM interaction scenario.",
      demoGeneric: "Signal received. NEIVUM currently runs as a transparent interface demo: your message is saved only in local history and the answer is selected from prepared scenarios. The architecture is ready for a future verified API connection.",
      historyRestored: "Local conversation restored"
    }
  };

  let language = "ru";
  let threads = [];
  let activeId = null;
  let requestToken = 0;
  let sending = false;
  const t = (key) => translations[language][key] || key;

  class CompactSignal {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas?.getContext("2d", { alpha: true, desynchronized: true });
      if (!this.ctx) return;
      this.profile = window.NEIVUM_DEVICE?.profile || {};
      this.running = !document.hidden;
      this.last = 0;
      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.resize();
      addEventListener("resize", this.resize, { passive: true });
      addEventListener("neivum:device", (event) => { this.profile = event.detail || this.profile; this.resize(); });
      document.addEventListener("visibilitychange", () => {
        this.running = !document.hidden;
        if (this.running && !reduceMotion.matches) requestAnimationFrame(this.frame);
      });
      if (reduceMotion.matches) this.draw(0, true); else requestAnimationFrame(this.frame);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      const cap = this.profile.quality === "safe" ? 1 : Math.min(1.5, this.profile.dprCap || 1.5);
      this.dpr = Math.min(devicePixelRatio || 1, cap);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (reduceMotion.matches) this.draw(0, true);
    }

    draw(timestamp, still = false) {
      const ctx = this.ctx;
      const time = still ? 0 : timestamp * .001;
      const width = this.width;
      const height = this.height;
      const cx = width * .5;
      const cy = height * .5;
      const unit = Math.min(width, height);
      const safe = this.profile.quality === "safe";
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * .62);
      halo.addColorStop(0, "rgba(166,180,238,.11)");
      halo.addColorStop(.4, "rgba(94,108,171,.045)");
      halo.addColorStop(1, "rgba(4,6,8,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      const radius = unit * .075;
      const axis = -.56 + Math.sin(time * .28) * (still ? 0 : .32);
      const pulse = still ? .72 : .5 + Math.pow(.5 + .5 * Math.cos(time * .84), 8) * .5;
      const lines = safe ? 4 : 7;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(axis + Math.PI / 2);
      for (let i = 0; i < lines; i += 1) {
        const reach = unit * (.16 + i * .06);
        ctx.beginPath();
        ctx.moveTo(0, -radius * .72);
        ctx.bezierCurveTo(reach * .55, -reach * .44, reach, reach * .06, 0, radius * .72);
        ctx.bezierCurveTo(-reach, reach * .06, -reach * .55, -reach * .44, 0, -radius * .72);
        ctx.strokeStyle = `rgba(194,205,243,${.15 - i * .016})`;
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(axis);
      [-1, 1].forEach((direction) => {
        const reach = width * .52;
        const beam = ctx.createLinearGradient(radius * direction, 0, reach * direction, 0);
        beam.addColorStop(0, `rgba(234,239,255,${.26 * pulse})`);
        beam.addColorStop(.32, `rgba(148,166,225,${.13 * pulse})`);
        beam.addColorStop(1, "rgba(103,123,193,0)");
        ctx.beginPath();
        ctx.moveTo(radius * .75 * direction, -unit * .006);
        ctx.lineTo(reach * direction, -unit * .04);
        ctx.lineTo(reach * direction, unit * .04);
        ctx.lineTo(radius * .75 * direction, unit * .006);
        ctx.closePath();
        ctx.fillStyle = beam;
        ctx.fill();
      });
      ctx.restore();

      const core = ctx.createRadialGradient(cx - radius * .35, cy - radius * .3, 0, cx, cy, radius);
      core.addColorStop(0, "rgba(255,255,255,.99)");
      core.addColorStop(.24, "rgba(225,232,253,.98)");
      core.addColorStop(.64, "rgba(119,134,183,.94)");
      core.addColorStop(1, "rgba(37,44,63,.82)");
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(229,235,255,${.34 + pulse * .17})`;
      ctx.lineWidth = .75;
      ctx.stroke();
      ctx.restore();
    }

    frame(timestamp) {
      if (!this.running || reduceMotion.matches) return;
      const fps = this.profile.fps || (this.profile.device === "phone" ? 30 : 60);
      if (timestamp - this.last >= 1000 / fps) { this.last = timestamp; this.draw(timestamp); }
      requestAnimationFrame(this.frame);
    }
  }

  class DemoProvider {
    async send(message) {
      await new Promise((resolve) => setTimeout(resolve, reduceMotion.matches ? 40 : 620));
      const normalized = message.toLowerCase();
      if (/текст|text|редакт|структур/.test(normalized)) return t("demoText");
      if (/код|code|program|программ|алгоритм|function|class/.test(normalized)) return t("demoCode");
      if (/анализ|analys|информац|данн|fact/.test(normalized)) return t("demoAnalysis");
      if (/иде|idea|гипотез|hypothes|исслед/.test(normalized)) return t("demoIdea");
      return t("demoGeneric");
    }
  }

  class NeivumApiProvider {
    constructor(endpoint) { this.endpoint = endpoint; }
    async send(message, history, signal) {
      if (!this.endpoint) throw new Error("NEIVUM API endpoint is not configured");
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, signal, version: "0.1" })
      });
      if (!response.ok) throw new Error(`NEIVUM API error: ${response.status}`);
      const payload = await response.json();
      return payload.message;
    }
  }

  const provider = API_CONFIG.endpoint ? new NeivumApiProvider(API_CONFIG.endpoint) : new DemoProvider();

  function loadThreads() {
    try {
      const parsed = JSON.parse(localStorage.getItem(THREADS_KEY) || "[]");
      threads = Array.isArray(parsed) ? parsed.filter((thread) => thread && Array.isArray(thread.messages)) : [];
      activeId = localStorage.getItem(ACTIVE_KEY);
      if (!threads.some((thread) => thread.id === activeId)) activeId = null;
    } catch (_) {
      threads = [];
      activeId = null;
    }
  }

  function saveThreads() {
    try {
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads.slice(0, 40)));
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId); else localStorage.removeItem(ACTIVE_KEY);
    } catch (_) { /* local history is optional */ }
  }

  function activeThread() { return threads.find((thread) => thread.id === activeId) || null; }
  function makeId() { return `nvm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function titleFrom(text) { return text.trim().replace(/\s+/g, " ").slice(0, 52) || t("untitled"); }

  function formatTime(value) {
    try { return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
    catch (_) { return ""; }
  }

  function formatDate(value) {
    try { return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", { day: "2-digit", month: "short" }).format(new Date(value)); }
    catch (_) { return ""; }
  }

  function setLanguage(next) {
    language = next in translations ? next : "ru";
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
    $$('[data-i18n]').forEach((element) => {
      const value = translations[language][element.dataset.i18n];
      if (value) element.textContent = value;
    });
    $$('[data-i18n-placeholder]').forEach((element) => {
      const value = translations[language][element.dataset.i18nPlaceholder];
      if (value) element.placeholder = value;
    });
    $("#app-language").textContent = language === "ru" ? "EN" : "RU";
    $("#settings-language").textContent = language === "ru" ? "EN" : "RU";
    window.NEIVUM?.storage.set("neivum.language", language);
    renderThreads();
    renderConversation();
  }

  function renderThreads() {
    const list = $("#thread-list");
    list.replaceChildren();
    const ordered = [...threads].sort((a,b) => b.updatedAt - a.updatedAt);
    ordered.forEach((thread) => {
      const item = document.createElement("li");
      item.className = `thread-item${thread.id === activeId ? " is-active" : ""}`;
      const select = document.createElement("button");
      select.type = "button";
      select.className = "thread-select";
      select.dataset.threadId = thread.id;
      select.setAttribute("aria-label", `${t("openThread")}: ${thread.title}`);
      const title = document.createElement("span");
      title.textContent = thread.title;
      const date = document.createElement("time");
      date.dateTime = new Date(thread.updatedAt).toISOString();
      date.textContent = formatDate(thread.updatedAt);
      select.append(title, date);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "thread-delete";
      remove.dataset.deleteThread = thread.id;
      remove.setAttribute("aria-label", `${t("deleteThread")}: ${thread.title}`);
      remove.textContent = "×";
      item.append(select, remove);
      list.append(item);
    });
    $("#empty-history").hidden = ordered.length > 0;
  }

  function createMessageElement(message, typing = false) {
    const article = document.createElement("article");
    article.className = `message ${message.role}`;
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = message.role === "user" ? "U" : "N";
    const content = document.createElement("div");
    content.className = "message-content";
    const author = document.createElement("strong");
    author.className = "message-author";
    author.textContent = message.role === "user" ? t("you") : t("assistant");
    content.append(author);
    if (typing) {
      const indicator = document.createElement("span");
      indicator.className = "typing";
      indicator.setAttribute("aria-label", t("sending"));
      indicator.innerHTML = "<i></i><i></i><i></i>";
      content.append(indicator);
    } else {
      const body = document.createElement("span");
      body.textContent = message.content;
      const time = document.createElement("time");
      time.className = "message-time";
      time.dateTime = new Date(message.time).toISOString();
      time.textContent = formatTime(message.time);
      content.append(body, time);
    }
    article.append(avatar, content);
    return article;
  }

  function renderConversation() {
    const thread = activeThread();
    const welcome = $("#welcome-view");
    const view = $("#conversation-view");
    const stream = $("#conversation-stream");
    if (!thread || thread.messages.length === 0) {
      welcome.hidden = false;
      view.hidden = true;
      stream.replaceChildren();
      return;
    }
    welcome.hidden = true;
    view.hidden = false;
    stream.replaceChildren(...thread.messages.map((message) => createMessageElement(message)));
    requestAnimationFrame(() => { view.scrollTop = view.scrollHeight; });
  }

  function newConversation() {
    requestToken += 1;
    sending = false;
    activeId = null;
    saveThreads();
    renderThreads();
    renderConversation();
    closeSidebar();
    if (window.NEIVUM_DEVICE?.profile?.device === "desktop") $("#message-input").focus();
  }

  function selectThread(id) {
    if (!threads.some((thread) => thread.id === id)) return;
    requestToken += 1;
    sending = false;
    activeId = id;
    saveThreads();
    renderThreads();
    renderConversation();
    closeSidebar();
  }

  function deleteThread(id) {
    threads = threads.filter((thread) => thread.id !== id);
    if (activeId === id) activeId = null;
    saveThreads();
    renderThreads();
    renderConversation();
  }

  async function sendMessage(text) {
    const clean = text.trim();
    if (!clean || sending) return;
    let thread = activeThread();
    if (!thread) {
      thread = { id: makeId(), title: titleFrom(clean), createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
      threads.push(thread);
      activeId = thread.id;
    }
    thread.messages.push({ role: "user", content: clean, time: Date.now() });
    thread.updatedAt = Date.now();
    saveThreads();
    renderThreads();
    renderConversation();
    window.NEIVUM?.sound.play("send", .72);
    sending = true;
    $(".send-message").disabled = true;
    const view = $("#conversation-view");
    const stream = $("#conversation-stream");
    const typing = createMessageElement({ role: "assistant" }, true);
    stream.append(typing);
    view.scrollTop = view.scrollHeight;
    const token = ++requestToken;
    try {
      const response = await provider.send(clean, thread.messages, "PULSAR");
      if (token !== requestToken || activeId !== thread.id) return;
      thread.messages.push({ role: "assistant", content: response, time: Date.now() });
      thread.updatedAt = Date.now();
      saveThreads();
      renderThreads();
      renderConversation();
      window.NEIVUM?.sound.play("receive", .62);
    } catch (_) {
      if (token === requestToken) {
        thread.messages.push({ role: "assistant", content: t("demoGeneric"), time: Date.now() });
        saveThreads();
        renderConversation();
      }
    } finally {
      if (token === requestToken) {
        sending = false;
        $(".send-message").disabled = false;
      }
    }
  }

  function setupComposer() {
    const form = $("#composer");
    const input = $("#message-input");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value;
      input.value = "";
      input.style.height = "auto";
      sendMessage(value);
    });
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
    const keepLatestVisible = () => {
      const view = $("#conversation-view");
      if (!view.hidden) requestAnimationFrame(() => { view.scrollTop = view.scrollHeight; });
    };
    input.addEventListener("focus", () => setTimeout(keepLatestVisible, 80));
    addEventListener("neivum:viewport", (event) => {
      if (event.detail?.keyboardOpen) keepLatestVisible();
    });
    $("#starter-prompts").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-prompt]");
      if (!button) return;
      const key = `prompt${button.dataset.prompt[0].toUpperCase()}${button.dataset.prompt.slice(1)}Value`;
      sendMessage(t(key));
    });
  }

  function setupThreads() {
    $("#new-thread").addEventListener("click", newConversation);
    $("#thread-list").addEventListener("click", (event) => {
      const remove = event.target.closest("[data-delete-thread]");
      if (remove) { deleteThread(remove.dataset.deleteThread); return; }
      const select = event.target.closest("[data-thread-id]");
      if (select) selectThread(select.dataset.threadId);
    });
  }

  const sidebarMedia = matchMedia("(max-width: 900px)");
  function openSidebar() {
    if (!sidebarMedia.matches) return;
    $("#app-sidebar").classList.add("is-open");
    $("#app-sidebar").inert = false;
    $("#sidebar-scrim").classList.add("is-open");
    $("#sidebar-toggle").setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    if (!sidebarMedia.matches) return;
    $("#app-sidebar").classList.remove("is-open");
    $("#app-sidebar").inert = true;
    $("#sidebar-scrim").classList.remove("is-open");
    $("#sidebar-toggle").setAttribute("aria-expanded", "false");
  }
  function syncSidebar() {
    if (sidebarMedia.matches) closeSidebar();
    else {
      $("#app-sidebar").inert = false;
      $("#app-sidebar").classList.remove("is-open");
      $("#sidebar-scrim").classList.remove("is-open");
    }
  }

  function setupPanels() {
    $("#sidebar-toggle").addEventListener("click", openSidebar);
    $("#sidebar-close").addEventListener("click", closeSidebar);
    $("#sidebar-scrim").addEventListener("click", closeSidebar);
    sidebarMedia.addEventListener?.("change", syncSidebar);
    syncSidebar();

    const panel = $("#settings-panel");
    const open = () => {
      panel.classList.add("is-open");
      panel.inert = false;
      panel.setAttribute("aria-hidden", "false");
      $("#settings-close").focus();
    };
    const close = () => {
      panel.classList.remove("is-open");
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");
    };
    $("#settings-open").addEventListener("click", open);
    $("#top-settings").addEventListener("click", open);
    $("#settings-close").addEventListener("click", close);
    $("#settings-scrim").addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { close(); closeSidebar(); }
    });
  }

  function init() {
    language = window.NEIVUM?.storage.get("neivum.language", "ru") || "ru";
    const signalCanvas = $("#app-signal-canvas");
    if (signalCanvas) new CompactSignal(signalCanvas);
    loadThreads();
    setupThreads();
    setupComposer();
    setupPanels();
    $("#app-language").addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
    $("#settings-language").addEventListener("click", () => setLanguage(language === "ru" ? "en" : "ru"));
    setLanguage(language);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();

(() => {
  "use strict";

  const scriptUrl = document.currentScript?.src || location.href;
  const asset = (path) => new URL(path, scriptUrl).href;
  const storage = {
    get(key, fallback = null) { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, String(value)); } catch (_) { /* persistence is optional */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (_) { /* persistence is optional */ } }
  };

  class SoundSystem {
    constructor() {
      this.enabled = storage.get("neivum.sound", "off") === "on";
      this.volume = Math.min(1, Math.max(0, Number(storage.get("neivum.volume", ".34")) || .34));
      this.ambient = new Audio(asset("audio/neivum-ambient.ogg"));
      this.ambient.loop = true;
      this.ambient.preload = "none";
      this.ambient.volume = 0;
      this.ambient.setAttribute("aria-hidden", "true");
      this.effects = {
        activate: asset("audio/pulsar-activate.ogg"),
        open: asset("audio/interface-open.ogg"),
        send: asset("audio/message-send.ogg"),
        receive: asset("audio/message-receive.ogg")
      };
      this.fadeFrame = 0;
      this.pendingResume = this.enabled;
      this.mediaWasAudible = false;
      this.mediaActive = false;
      this.restoreTime();
      this.bindControls();
      this.bindLifecycle();
      this.paint();
      if (this.enabled) queueMicrotask(() => this.start(false));
    }

    restoreTime() {
      const saved = Number(storage.get("neivum.audioTime", "0"));
      if (Number.isFinite(saved) && saved > 0) {
        const apply = () => {
          if (this.ambient.duration) this.ambient.currentTime = saved % this.ambient.duration;
        };
        this.ambient.addEventListener("loadedmetadata", apply, { once: true });
      }
    }

    bindControls() {
      document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.addEventListener("click", () => this.toggle());
      });
      document.querySelectorAll("[data-sound-volume]").forEach((input) => {
        input.value = String(Math.round(this.volume * 100));
        input.addEventListener("input", () => this.setVolume(Number(input.value) / 100));
      });
    }

    bindLifecycle() {
      const resume = () => {
        if (this.pendingResume && this.enabled) this.start(false);
      };
      document.addEventListener("pointerdown", resume, { passive: true });
      document.addEventListener("keydown", resume, { passive: true });
      window.addEventListener("pagehide", () => this.rememberTime());
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.rememberTime();
      });
      this.ambient.addEventListener("timeupdate", () => {
        if (Math.floor(this.ambient.currentTime) % 8 === 0) this.rememberTime();
      });
    }

    rememberTime() {
      if (Number.isFinite(this.ambient.currentTime)) storage.set("neivum.audioTime", this.ambient.currentTime.toFixed(2));
    }

    fadeTo(target, duration = 700, pauseAfter = false) {
      cancelAnimationFrame(this.fadeFrame);
      const from = this.ambient.volume;
      const start = performance.now();
      const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.ambient.volume = from + (target - from) * eased;
        if (progress < 1) this.fadeFrame = requestAnimationFrame(frame);
        else if (pauseAfter) this.ambient.pause();
      };
      this.fadeFrame = requestAnimationFrame(frame);
    }

    async start(withActivation = true) {
      if (this.mediaActive) {
        this.pendingResume = this.enabled;
        this.paint();
        return;
      }
      this.ambient.preload = "auto";
      try {
        await this.ambient.play();
        this.pendingResume = false;
        this.fadeTo(this.volume, 1200);
        if (withActivation) this.play("activate", .72);
      } catch (_) {
        this.pendingResume = true;
      }
      this.paint();
    }

    stop() {
      this.pendingResume = false;
      this.rememberTime();
      this.fadeTo(0, 650, true);
      this.paint();
    }

    setEnabled(value) {
      this.enabled = Boolean(value);
      storage.set("neivum.sound", this.enabled ? "on" : "off");
      if (this.enabled) this.start(true); else this.stop();
      this.paint();
    }

    toggle() { this.setEnabled(!this.enabled); }

    setVolume(value) {
      this.volume = Math.min(1, Math.max(0, value));
      storage.set("neivum.volume", this.volume.toFixed(2));
      if (!this.ambient.paused) this.fadeTo(this.volume, 120);
      document.querySelectorAll("[data-sound-volume]").forEach((input) => { input.value = String(Math.round(this.volume * 100)); });
    }

    play(name, scale = 1) {
      if (!this.enabled || !this.effects[name]) return;
      const sound = new Audio(this.effects[name]);
      sound.preload = "auto";
      sound.volume = Math.min(1, this.volume * scale);
      sound.play().catch(() => {});
    }

    duckForMedia() {
      this.mediaActive = true;
      this.mediaWasAudible = this.enabled && !this.ambient.paused && this.ambient.volume > .01;
      if (this.mediaWasAudible) {
        this.rememberTime();
        this.fadeTo(0, 620, true);
      }
      return this.mediaWasAudible;
    }

    releaseMedia() {
      this.mediaActive = false;
      return this.enabled && (this.mediaWasAudible || this.pendingResume);
    }

    restoreAfterMedia() {
      const shouldRestore = this.enabled && (this.mediaWasAudible || this.pendingResume);
      this.mediaActive = false;
      if (!shouldRestore) return false;
      this.mediaWasAudible = false;
      this.start(false);
      return true;
    }

    paint() {
      document.documentElement.dataset.sound = this.enabled ? "on" : "off";
      document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(this.enabled));
        button.setAttribute("aria-label", this.enabled ? "Выключить звук / Disable sound" : "Включить звук / Enable sound");
        const state = button.querySelector("[data-sound-state]");
        if (state) state.textContent = this.enabled ? "SOUND ON" : "SOUND OFF";
      });
    }
  }

  function bindPageTransitions(sound) {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-open-app], [data-transition-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
        event.preventDefault();
        const target = link.href;
        const transition = document.querySelector("[data-page-transition]");
        const label = transition?.querySelector("span");
        if (label && link.dataset.transitionLabel) label.textContent = link.dataset.transitionLabel;
        sound.play("activate", .8);
        if (reduceMotion) {
          sound.rememberTime();
          location.href = target;
          return;
        }
        document.body.classList.add("is-transitioning");
        transition?.classList.add("is-active");
        if (!sound.ambient.paused) sound.fadeTo(0, 760);
        window.setTimeout(() => {
          sound.rememberTime();
          location.href = target;
        }, 820);
      });
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    const serviceWorkerUrl = new URL("../sw.js", scriptUrl);
    addEventListener("load", () => navigator.serviceWorker.register(serviceWorkerUrl).catch(() => {}), { once: true });
  }

  function boot() {
    const sound = new SoundSystem();
    bindPageTransitions(sound);
    registerServiceWorker();
    window.NEIVUM = { sound, storage, asset, device: window.NEIVUM_DEVICE || null };
    window.dispatchEvent(new CustomEvent("neivum:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();

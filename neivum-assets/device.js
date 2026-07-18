(() => {
  "use strict";

  const root = document.documentElement;
  const media = (query) => {
    try { return matchMedia(query).matches; } catch (_) { return false; }
  };

  let current = null;
  let viewportFrame = 0;

  function supportsCanvas() {
    try { return Boolean(document.createElement("canvas").getContext("2d")); }
    catch (_) { return false; }
  }

  function classify() {
    const width = Math.max(320, window.innerWidth || root.clientWidth || 320);
    const height = Math.max(320, window.innerHeight || root.clientHeight || 320);
    const coarse = media("(pointer: coarse)");
    const hover = media("(hover: hover) and (pointer: fine)");
    const reducedMotion = media("(prefers-reduced-motion: reduce)");
    const reducedTransparency = media("(prefers-reduced-transparency: reduce)");
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = /(^|-)2g$/.test(connection?.effectiveType || "");
    const cores = Number(navigator.hardwareConcurrency) || 0;
    const memory = Number(navigator.deviceMemory) || 0;
    const canvas = supportsCanvas();
    const device = width <= 760 && (coarse || !hover) ? "phone" : width <= 1180 && coarse ? "tablet" : "desktop";
    const constrainedHardware = (cores > 0 && cores <= 4) || (memory > 0 && memory <= 4);
    const safeMode = reducedMotion || saveData || slowNetwork || !canvas || constrainedHardware;
    const quality = safeMode ? "safe" : device === "desktop" ? "full" : "mobile";
    const dprCap = quality === "safe" ? 1 : quality === "mobile" ? 1.25 : 1.55;
    const fps = quality === "safe" ? 24 : quality === "mobile" ? 30 : 60;

    return Object.freeze({
      device, quality, width, height, coarse, hover, reducedMotion,
      reducedTransparency, saveData, slowNetwork, cores, memory, canvas, dprCap, fps
    });
  }

  function readout(profile) {
    return `DEVICE CHECK / ${profile.device.toUpperCase()} · ${profile.quality.toUpperCase()}`;
  }

  function paintReadouts() {
    if (!current) return;
    document.querySelectorAll("[data-device-state]").forEach((element) => {
      element.textContent = readout(current);
      element.dataset.mode = current.quality;
    });
  }

  function applyProfile() {
    current = classify();
    root.dataset.device = current.device;
    root.dataset.quality = current.quality;
    root.dataset.pointer = current.coarse ? "coarse" : "fine";
    root.dataset.canvas = current.canvas ? "available" : "fallback";
    root.dataset.dataSaver = current.saveData ? "on" : "off";
    paintReadouts();
    window.dispatchEvent(new CustomEvent("neivum:device", { detail: current }));
  }

  function applyViewport() {
    cancelAnimationFrame(viewportFrame);
    viewportFrame = requestAnimationFrame(() => {
      const viewport = window.visualViewport;
      const height = Math.max(320, Math.round(viewport?.height || window.innerHeight || 320));
      const width = Math.max(320, Math.round(viewport?.width || window.innerWidth || 320));
      root.style.setProperty("--viewport-height", `${height}px`);
      root.style.setProperty("--viewport-width", `${width}px`);
      const active = document.activeElement;
      const editing = active?.matches?.("input, textarea, select, [contenteditable='true']");
      const keyboardOpen = Boolean(editing && viewport && window.innerHeight - viewport.height > 140);
      root.dataset.keyboard = keyboardOpen ? "open" : "closed";
      window.dispatchEvent(new CustomEvent("neivum:viewport", { detail: { width, height, keyboardOpen } }));
    });
  }

  const refresh = () => { applyProfile(); applyViewport(); };
  window.NEIVUM_DEVICE = {
    get profile() { return current; },
    refresh,
    readout: () => current ? readout(current) : "DEVICE CHECK / INITIALIZING"
  };

  applyProfile();
  applyViewport();
  addEventListener("resize", refresh, { passive: true });
  addEventListener("orientationchange", refresh, { passive: true });
  window.visualViewport?.addEventListener("resize", applyViewport, { passive: true });
  window.visualViewport?.addEventListener("scroll", applyViewport, { passive: true });
  document.addEventListener("focusin", applyViewport);
  document.addEventListener("focusout", applyViewport);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintReadouts, { once: true });
  else paintReadouts();
})();


"use strict";

const CACHE = "neivum-0.1-maximum-v4";
const CORE = [
  "./index.html", "./app.html", "./about.html", "./manifest.webmanifest",
  "./neivum-assets/device.js", "./neivum-assets/core.js",
  "./neivum-assets/site.css", "./neivum-assets/site.js", "./neivum-assets/about.css",
  "./neivum-assets/app.css", "./neivum-assets/app.js",
  "./neivum-assets/favicon.svg", "./neivum-assets/icon-192.png",
  "./neivum-assets/icon-512.png", "./neivum-assets/NEIVUM_og_cover.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("neivum-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.destination === "audio") return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html"))));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});

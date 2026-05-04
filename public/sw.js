// ════════════════════════════════════════════════════════════════
// NUTRIVO — Service Worker
// Permet à l'app de fonctionner hors ligne (mode avion)
// ════════════════════════════════════════════════════════════════

const CACHE_NAME = "nutrivo-v1";

// Fichiers à mettre en cache pour le mode hors ligne
const FICHIERS_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Installation — mise en cache des fichiers essentiels
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("NUTRIVO: Cache installé");
      return cache.addAll(FICHIERS_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation — supprimer les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch — stratégie Network First (réseau prioritaire, cache en fallback)
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les appels API Anthropic ou Supabase
  if (
    event.request.url.includes("anthropic.com") ||
    event.request.url.includes("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la nouvelle version
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Pas de réseau → servir depuis le cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Si même pas en cache → page hors ligne
          return caches.match("/index.html");
        });
      })
  );
});

// Notification push (pour les rappels futurs)
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const titre = data.titre || "NUTRIVO";
  const message = data.message || "N'oublie pas de scanner ton repas !";

  event.waitUntil(
    self.registration.showNotification(titre, {
      body: message,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" },
      actions: [
        { action: "scanner", title: "📸 Scanner maintenant" },
        { action: "ignorer", title: "Plus tard" },
      ],
    })
  );
});

// Clic sur notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "scanner") {
    event.waitUntil(clients.openWindow("/?action=scanner"));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});
const CACHE_NAME = 'mi-app-cache-v1';
const URLS_A_CACHEAR = ['/', '/icons/versatile.png'];

// 🚀 Instalación: Cacheamos archivos esenciales
self.addEventListener('install', (event) => {
	console.log('[SW] Instalando...');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[SW] Cacheando archivos...');
			return cache.addAll(URLS_A_CACHEAR);
		})
	);
});

// ✅ Activación: Limpieza de caché antigua si cambia la versión
self.addEventListener('activate', (event) => {
	console.log('[SW] Activado');
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						console.log('[SW] Eliminando caché antigua:', key);
						return caches.delete(key);
					}
				})
			)
		)
	);
});

self.addEventListener('push', (event) => {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		icon: data.image || '/icons/versatile.png',
		vibrate: [100, 50, 100],
		data: { url: data.url }
	});
});

self.addEventListener('notificationclick', async (event) => {
	event.notification.close();

	if (event.notification.data.url) {
		event.waitUntil(
			self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
				for (const client of clientList) {
					if (client.url === event.notification.data.url && 'focus' in client) {
						return client.focus();
					}
				}
				if (self.clients.openWindow) {
					return self.clients.openWindow(event.notification.data.url);
				}
			})
		);
	}
});

// 🔄 Intercepción de peticiones (Fetch)
// self.addEventListener('fetch', (event) => {
// 	console.log('[SW] Interceptando petición:', event.request.url);
// 	event.respondWith(
// 		caches.match(event.request).then((response) => response || fetch(event.request))
// 	);
// });

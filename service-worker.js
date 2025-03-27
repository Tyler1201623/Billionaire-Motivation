// Advanced Progressive Web App Service Worker
const CACHE_NAME = 'billionaire-ultra-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/manifest.json',
    '/sounds/'
];

// PreCache Strategy with Network Fallback
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Advanced Cache Strategy with Stale-While-Revalidate pattern
self.addEventListener('fetch', event => {
    // Don't cache API calls
    if (event.request.url.includes('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // For audio files, use network-first approach
    if (event.request.url.includes('.mp4') || 
        event.request.url.includes('.mp3') || 
        event.request.url.includes('.wav')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    
    // Stale-while-revalidate for general assets
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                return cachedResponse || fetchPromise;
            });
        })
    );
});

// Cache cleanup
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Background sync for offline listening history
self.addEventListener('sync', event => {
    if (event.tag === 'sync-listening-history') {
        event.waitUntil(syncListeningHistory());
    }
});

// Push notifications for new content
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// Sync listening history function
async function syncListeningHistory() {
    const db = await openDatabase();
    const history = await db.getAll('listening-history');
    
    if (history.length === 0) return;
    
    try {
        const response = await fetch('/api/sync-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(history)
        });
        
        if (response.ok) {
            const tx = db.transaction('listening-history', 'readwrite');
            await Promise.all(history.map(item => tx.store.delete(item.id)));
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// IndexedDB helper
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('billionaire-ultra', 1);
        
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('listening-history')) {
                db.createObjectStore('listening-history', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = e => resolve(e.target.result);
        request.onerror = e => reject(e.target.error);
    });
}

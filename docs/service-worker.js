console.debug("[ServiceWorker] Initializing");

let config = {};

self.addEventListener('install', function (e) {
    console.debug('[ServiceWorker] Installing offline worker');
    e.waitUntil(
        fetch("./package_13610555861db8957cd898a3fb4c62bee6a2a21b/uno-config.js")
            .then(r => r.text()
                .then(configStr => {
                    eval(configStr);
                    caches.open('package_13610555861db8957cd898a3fb4c62bee6a2a21b').then(function (cache) {
                        console.debug('[ServiceWorker] Caching app binaries and content');
                        return cache.addAll(config.offline_files);
                    });
                }
                )
            )
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(async function () {
        try {
            // Network first mode to get fresh content every time, then fallback to
            // cache content if needed.
            return await fetch(event.request);
        } catch (err) {
            return caches.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        }
    }());
});


// managed
// Service Worker per LazyWalker PWA
// Versione semplice e sicura senza caching aggressivo

const CACHE_NAME = 'lazywalker-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/onboarding',
  '/timer',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installazione in corso...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aperta')
        // Non precarichiamo tutto, solo le risorse essenziali
        return cache.addAll(STATIC_CACHE_URLS.filter(url => url !== '/' && url !== '/onboarding' && url !== '/timer'))
      })
      .catch((error) => {
        console.log('Service Worker: Errore durante l\'installazione:', error)
      })
  )
  
  // Forza l'attivazione immediata
  self.skipWaiting()
})

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Attivazione in corso...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Rimozione cache vecchia:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Prendi il controllo di tutte le pagine
  self.clients.claim()
})

// Gestione delle richieste
self.addEventListener('fetch', (event) => {
  // Solo per richieste GET
  if (event.request.method !== 'GET') {
    return
  }
  
  // Strategia: Network First per le pagine, Cache First per le risorse statiche
  if (event.request.destination === 'document') {
    // Per le pagine HTML: Network First
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se la richiesta ha successo, aggiorna la cache
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Se la rete fallisce, prova la cache
          return caches.match(event.request)
        })
    )
  } else if (event.request.destination === 'image' || 
             event.request.destination === 'style' || 
             event.request.destination === 'script') {
    // Per risorse statiche: Cache First
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response
          }
          
          // Se non in cache, fai la richiesta e salva in cache
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
            return response
          })
        })
    )
  }
})

// Gestione notifiche push (per future implementazioni)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Gestione click su notifiche
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

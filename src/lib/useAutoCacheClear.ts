import { useEffect } from 'react'

interface AutoCacheClearOptions {
  clearOnAppUpdate?: boolean
  clearOnHotReload?: boolean
  enableLogging?: boolean
}

export const useAutoCacheClear = (options: AutoCacheClearOptions = {}) => {
  const {
    clearOnAppUpdate = true,
    clearOnHotReload = true,
    enableLogging = true
  } = options

  useEffect(() => {
    const log = (message: string) => {
      if (enableLogging) {
        console.log(`🔄 Auto Cache Clear: ${message}`)
      }
    }

    // Funzione per pulire la cache
    const clearCache = async () => {
      try {
        // Pulisce la cache del service worker
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of registrations) {
            await registration.unregister()
            log('Service Worker rimosso')
          }
        }

        // Pulisce la cache del browser
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map(cacheName => {
              log(`Cache "${cacheName}" rimossa`)
              return caches.delete(cacheName)
            })
          )
        }

        log('Cache pulita automaticamente')
      } catch (error) {
        console.error('Errore nella pulizia automatica cache:', error)
      }
    }

    // Pulisce la cache quando l'app viene caricata (per aggiornamenti)
    if (clearOnAppUpdate) {
      // Controlla se c'è un parametro nell'URL che indica un aggiornamento
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('clearCache') === 'true') {
        log('Pulizia cache richiesta via URL')
        clearCache()
      }

      // Pulisce la cache se è la prima volta che l'app viene caricata
      const isFirstLoad = !sessionStorage.getItem('lazywalker_loaded')
      if (isFirstLoad) {
        log('Primo caricamento - pulizia cache')
        clearCache()
        sessionStorage.setItem('lazywalker_loaded', 'true')
      }
    }

    // Pulisce la cache su hot reload in sviluppo
    if (clearOnHotReload && process.env.NODE_ENV === 'development') {
      // In sviluppo, pulisce la cache ad ogni caricamento
      log('Modalità sviluppo - pulizia cache automatica')
      clearCache()
    }

  }, [clearOnAppUpdate, clearOnHotReload, enableLogging])
}

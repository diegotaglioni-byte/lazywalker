import { useEffect } from 'react'

interface CacheManagerOptions {
  clearOnUnload?: boolean
  clearOnFocus?: boolean
  clearOnVisibilityChange?: boolean
  enableLogging?: boolean
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const {
    clearOnUnload = true,
    clearOnFocus = false,
    clearOnVisibilityChange = false,
    enableLogging = true
  } = options

  useEffect(() => {
    const log = (message: string) => {
      if (enableLogging) {
        console.log(`🧹 Cache Manager: ${message}`)
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

        // Pulisce il localStorage (opzionale)
        if (process.env.NODE_ENV === 'development') {
          const keysToKeep = ['lazywalker_nickname', 'lazywalker_daily_goal', 'lazywalker_today_progress']
          const allKeys = Object.keys(localStorage)
          const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key))
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key)
            log(`localStorage key "${key}" rimossa`)
          })
        }

        log('Cache pulita con successo')
      } catch (error) {
        console.error('Errore nella pulizia cache:', error)
      }
    }

    // Event listener per beforeunload (quando la pagina viene chiusa)
    const handleBeforeUnload = () => {
      if (clearOnUnload) {
        log('Pulizia cache prima della chiusura')
        clearCache()
      }
    }

    // Event listener per focus (quando la finestra torna in primo piano)
    const handleFocus = () => {
      if (clearOnFocus) {
        log('Pulizia cache al focus')
        clearCache()
      }
    }

    // Event listener per visibility change (quando la tab diventa visibile/nascosta)
    const handleVisibilityChange = () => {
      if (clearOnVisibilityChange && document.visibilityState === 'visible') {
        log('Pulizia cache al cambio visibilità')
        clearCache()
      }
    }

    // Aggiunge gli event listener
    if (clearOnUnload) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    if (clearOnFocus) {
      window.addEventListener('focus', handleFocus)
    }

    if (clearOnVisibilityChange) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    // Cleanup degli event listener
    return () => {
      if (clearOnUnload) {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
      if (clearOnFocus) {
        window.removeEventListener('focus', handleFocus)
      }
      if (clearOnVisibilityChange) {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [clearOnUnload, clearOnFocus, clearOnVisibilityChange, enableLogging])

  // Funzione manuale per pulire la cache
  const clearCacheManually = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }

      console.log('🧹 Cache pulita manualmente')
    } catch (error) {
      console.error('Errore nella pulizia manuale cache:', error)
    }
  }

  return {
    clearCacheManually
  }
}

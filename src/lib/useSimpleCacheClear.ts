import { useEffect } from 'react'

export const useSimpleCacheClear = () => {
  useEffect(() => {
    // Funzione per pulire la cache
    const clearCache = () => {
      try {
        // Pulisce localStorage (mantiene solo i dati essenziali)
        const keysToKeep = ['lazywalker_nickname', 'lazywalker_daily_goal', 'lazywalker_today_progress']
        const allKeys = Object.keys(localStorage)
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key))
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
          console.log(`🧹 Rimosso dal localStorage: ${key}`)
        })

        // Pulisce sessionStorage
        sessionStorage.clear()
        console.log('🧹 SessionStorage pulito')

        // Pulisce la cache del browser se disponibile
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName)
              console.log(`🧹 Cache rimossa: ${cacheName}`)
            })
          })
        }

        console.log('🧹 Cache pulita automaticamente')
      } catch (error) {
        console.error('Errore nella pulizia cache:', error)
      }
    }

    // Pulisce la cache quando la pagina viene chiusa
    const handleBeforeUnload = () => {
      clearCache()
    }

    // Pulisce la cache quando la pagina diventa invisibile (tab chiuso)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearCache()
      }
    }

    // Aggiunge gli event listener
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}

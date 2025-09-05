'use client'

import { Button } from './Button'

export const CacheClearButton: React.FC = () => {
  const clearCache = () => {
    try {
      // Pulisce localStorage
      const keysToKeep = ['lazywalker_nickname', 'lazywalker_daily_goal', 'lazywalker_today_progress']
      const allKeys = Object.keys(localStorage)
      const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key))
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })

      // Pulisce sessionStorage
      sessionStorage.clear()

      // Pulisce la cache del browser
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName)
          })
        })
      }

      alert('🧹 Cache pulita! La pagina verrà ricaricata.')
      window.location.reload()
    } catch (error) {
      console.error('Errore nella pulizia cache:', error)
      alert('❌ Errore nella pulizia della cache')
    }
  }

  // Mostra solo in modalità sviluppo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={clearCache}
        className="btn-secondary text-xs px-3 py-2 shadow-lg"
        title="Pulisci cache del browser"
      >
        🧹 Cache
      </Button>
    </div>
  )
}

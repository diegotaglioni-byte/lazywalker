'use client'

import { useState } from 'react'
import { useCacheManager } from '@/lib/useCacheManager'
import { useAutoCacheClear } from '@/lib/useAutoCacheClear'
import { Button } from './Button'

interface CacheManagerProps {
  showManualButton?: boolean
  clearOnUnload?: boolean
  clearOnFocus?: boolean
  clearOnVisibilityChange?: boolean
}

export const CacheManager: React.FC<CacheManagerProps> = ({
  showManualButton = true,
  clearOnUnload = true,
  clearOnFocus = false,
  clearOnVisibilityChange = false
}) => {
  const [isClearing, setIsClearing] = useState(false)
  
  // Hook per gestione cache manuale
  const { clearCacheManually } = useCacheManager({
    clearOnUnload,
    clearOnFocus,
    clearOnVisibilityChange,
    enableLogging: true
  })

  // Hook per pulizia automatica cache
  useAutoCacheClear({
    clearOnAppUpdate: true,
    clearOnHotReload: true,
    enableLogging: true
  })

  const handleManualClear = async () => {
    setIsClearing(true)
    try {
      await clearCacheManually()
      // Mostra un messaggio di successo
      alert('🧹 Cache pulita con successo! La pagina verrà ricaricata.')
      // Ricarica la pagina
      window.location.reload()
    } catch (error) {
      console.error('Errore nella pulizia cache:', error)
      alert('❌ Errore nella pulizia della cache')
    } finally {
      setIsClearing(false)
    }
  }

  // In modalità sviluppo, mostra sempre il pulsante
  if (process.env.NODE_ENV === 'development' && showManualButton) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleManualClear}
          disabled={isClearing}
          className="btn-secondary text-xs px-3 py-2 shadow-lg"
          title="Pulisci cache del browser"
        >
          {isClearing ? '🧹 Pulendo...' : '🧹 Cache'}
        </Button>
      </div>
    )
  }

  return null
}

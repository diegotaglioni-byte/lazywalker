'use client'

import { useSimpleCacheClear } from '@/lib/useSimpleCacheClear'

export const SimpleCacheManager: React.FC = () => {
  // Attiva la pulizia automatica della cache
  useSimpleCacheClear()
  
  // Non renderizza nulla, solo gestisce la logica
  return null
}

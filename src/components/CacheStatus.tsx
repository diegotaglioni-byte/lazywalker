'use client'

import { useState, useEffect } from 'react'
import { Card } from './Card'

export const CacheStatus: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<{
    serviceWorkers: number
    caches: string[]
    localStorage: number
  }>({
    serviceWorkers: 0,
    caches: [],
    localStorage: 0
  })

  useEffect(() => {
    const getCacheInfo = async () => {
      try {
        // Conta Service Workers
        let serviceWorkers = 0
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          serviceWorkers = registrations.length
        }

        // Conta Cache
        let caches: string[] = []
        if ('caches' in window) {
          caches = Array.from(await caches.keys()).map(String)
        }

        // Conta localStorage
        const localStorage = Object.keys(window.localStorage).length

        setCacheInfo({
          serviceWorkers,
          caches,
          localStorage
        })
      } catch (error) {
        console.error('Errore nel recuperare info cache:', error)
      }
    }

    getCacheInfo()
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-64 text-xs">
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-800">🧹 Cache Status</h4>
        <div className="space-y-1 text-gray-600">
          <div>Service Workers: {cacheInfo.serviceWorkers}</div>
          <div>Cache: {cacheInfo.caches.length}</div>
          <div>localStorage: {cacheInfo.localStorage}</div>
        </div>
        {cacheInfo.caches.length > 0 && (
          <div className="text-xs text-gray-500">
            <div>Cache attive:</div>
            {cacheInfo.caches.map(cache => (
              <div key={cache} className="ml-2">• {cache}</div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

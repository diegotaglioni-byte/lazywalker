'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { useUserData } from '@/lib/useUserData'

// Japanese Walking Structure
const JAPANESE_WALKING_PHASES = [
  { name: 'warmup', label: 'Riscaldamento', duration: 3, color: 'bg-blue-500' },
  { name: 'fast', label: 'Camminata Veloce', duration: 3, color: 'bg-red-500' },
  { name: 'moderate', label: 'Camminata Moderata', duration: 3, color: 'bg-green-500' },
  { name: 'fast', label: 'Camminata Veloce', duration: 3, color: 'bg-red-500' },
  { name: 'moderate', label: 'Camminata Moderata', duration: 3, color: 'bg-green-500' },
  { name: 'fast', label: 'Camminata Veloce', duration: 3, color: 'bg-red-500' },
  { name: 'moderate', label: 'Camminata Moderata', duration: 3, color: 'bg-green-500' },
  { name: 'fast', label: 'Camminata Veloce', duration: 3, color: 'bg-red-500' },
  { name: 'moderate', label: 'Camminata Moderata', duration: 3, color: 'bg-green-500' },
  { name: 'cooldown', label: 'Defaticamento', duration: 3, color: 'bg-blue-500' }
]

const TOTAL_DURATION = 30 // 30 minuti totali

export default function Timer() {
  const router = useRouter()
  const { addWalk } = useUserData()
  
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0)
  const [totalTimeLeft, setTotalTimeLeft] = useState(TOTAL_DURATION * 60)

  const currentPhase = JAPANESE_WALKING_PHASES[currentPhaseIndex]
  const progress = ((TOTAL_DURATION * 60 - totalTimeLeft) / (TOTAL_DURATION * 60)) * 100

  const handleComplete = useCallback(async () => {
    setIsRunning(false)
    setIsCompleted(true)
    
    try {
      await addWalk(TOTAL_DURATION)
    } catch (error) {
      console.error('Errore nel salvare la camminata:', error)
    }
    
    // Suono e vibrazione
    playNotificationSound()
    triggerVibration()
  }, [addWalk])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused && totalTimeLeft > 0) {
      interval = setInterval(() => {
        setTotalTimeLeft(prev => {
          const newTotal = prev - 1
          if (newTotal <= 0) {
            handleComplete()
            return 0
          }
          return newTotal
        })

        setPhaseTimeLeft(prev => {
          const newPhaseTime = prev - 1
          if (newPhaseTime <= 0) {
            // Passa alla fase successiva
            setCurrentPhaseIndex(prevIndex => {
              const nextIndex = prevIndex + 1
              if (nextIndex >= JAPANESE_WALKING_PHASES.length) {
                handleComplete()
                return prevIndex
              }
              return nextIndex
            })
            return currentPhase.duration * 60
          }
          return newPhaseTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, totalTimeLeft, currentPhase.duration, handleComplete])

  const start = () => {
    setIsRunning(true)
    setIsPaused(false)
    setPhaseTimeLeft(currentPhase.duration * 60)
  }

  const pause = () => {
    setIsPaused(true)
  }

  const resume = () => {
    setIsPaused(false)
  }

  const reset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setIsCompleted(false)
    setCurrentPhaseIndex(0)
    setPhaseTimeLeft(0)
    setTotalTimeLeft(TOTAL_DURATION * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Funzione per suono di notifica
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Fallback: usa il beep del sistema
        console.log('🔔 Timer completato!')
      })
    } catch (error) {
      console.log('🔔 Timer completato!')
    }
  }

  // Funzione per vibrazione
  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
        <Card>
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800">
              Camminata Completata!
            </h1>
            <p className="text-gray-600">
              Hai completato con successo la Japanese Walking di 30 minuti!
            </p>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  🏆 Risultati della Sessione
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <div>⏱️ Durata: 30 minuti</div>
                  <div>🚶‍♀️ Tipo: Japanese Walking</div>
                  <div>📊 Fasi completate: 10/10</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push('/')}
                className="btn-primary flex-1"
              >
                🏠 Torna alla Home
              </Button>
              <Button
                onClick={reset}
                className="btn-secondary flex-1"
              >
                🔄 Nuova Camminata
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚶‍♀️ Japanese Walking Timer
        </h1>
        <p className="text-gray-600">
          Camminata giapponese con intervalli di 30 minuti
        </p>
      </div>

      {/* Timer Display */}
      <Card>
        <div className="text-center space-y-6">
          {/* Total Time */}
          <div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {formatTime(totalTimeLeft)}
            </div>
            <div className="text-sm text-gray-600">
              Tempo rimanente totale
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <ProgressBar progress={progress} className="h-4" />
            <div className="text-sm text-gray-600">
              {Math.round(progress)}% completato
            </div>
          </div>

          {/* Current Phase */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-gray-800">
              Fase Attuale
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${currentPhase.color}`}>
              {currentPhase.label}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatTime(phaseTimeLeft)}
            </div>
            <div className="text-sm text-gray-600">
              {currentPhaseIndex + 1} di {JAPANESE_WALKING_PHASES.length} fasi
            </div>
          </div>

          {/* Phase Progress */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Progresso fase</div>
            <ProgressBar 
              progress={((currentPhase.duration * 60 - phaseTimeLeft) / (currentPhase.duration * 60)) * 100} 
              className="h-2" 
            />
          </div>
        </div>
      </Card>

      {/* Phase Overview */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Struttura della Japanese Walking
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {JAPANESE_WALKING_PHASES.map((phase, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center text-sm ${
                index === currentPhaseIndex
                  ? `${phase.color} text-white font-semibold`
                  : index < currentPhaseIndex
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <div className="font-medium">{phase.label}</div>
              <div className="text-xs">{phase.duration} min</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📖 Come Funziona la Japanese Walking
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 font-bold">1.</span>
            <div>
              <strong>Riscaldamento (3 min):</strong> Camminata lenta e rilassata per preparare il corpo
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-red-500 font-bold">2.</span>
            <div>
              <strong>Camminata Veloce (3 min):</strong> Ritmo sostenuto, respirazione più intensa
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-500 font-bold">3.</span>
            <div>
              <strong>Camminata Moderata (3 min):</strong> Ritmo confortevole per recuperare
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 font-bold">4.</span>
            <div>
              <strong>Defaticamento (3 min):</strong> Camminata lenta per concludere
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          {!isRunning ? (
            <Button
              onClick={start}
              className="btn-primary flex-1 text-lg py-4"
            >
              🚀 Inizia Japanese Walking
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button
                  onClick={resume}
                  className="btn-primary flex-1 text-lg py-4"
                >
                  ▶️ Riprendi
                </Button>
              ) : (
                <Button
                  onClick={pause}
                  className="btn-secondary flex-1 text-lg py-4"
                >
                  ⏸️ Pausa
                </Button>
              )}
              <Button
                onClick={reset}
                className="btn-outline flex-1 text-lg py-4"
              >
                🔄 Reset
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="text-center">
        <Button
          onClick={() => router.push('/')}
          className="btn-outline"
        >
          🏠 Torna alla Home
        </Button>
      </div>
    </div>
  )
}
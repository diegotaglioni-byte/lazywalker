import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerReturn {
  timeLeft: number
  isRunning: boolean
  isPaused: boolean
  progress: number
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  setDuration: (seconds: number) => void
}

export const useTimer = (initialDuration: number, onComplete?: () => void): UseTimerReturn => {
  const [duration, setDuration] = useState(initialDuration)
  const [timeLeft, setTimeLeft] = useState(initialDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calcola il progresso in percentuale
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  // Funzione per pulire l'intervallo
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Funzione per avviare il timer
  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsPaused(false)
      
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            setIsRunning(false)
            setIsPaused(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [timeLeft, clearTimer, onComplete])

  // Funzione per mettere in pausa
  const pause = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(true)
  }, [clearTimer])

  // Funzione per riprendere
  const resume = useCallback(() => {
    if (timeLeft > 0 && isPaused) {
      start()
    }
  }, [timeLeft, isPaused, start])

  // Funzione per resettare
  const reset = useCallback(() => {
    clearTimer()
    setTimeLeft(duration)
    setIsRunning(false)
    setIsPaused(false)
  }, [clearTimer, duration])

  // Funzione per impostare una nuova durata
  const setNewDuration = useCallback((newDuration: number) => {
    clearTimer()
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setIsRunning(false)
    setIsPaused(false)
  }, [clearTimer])

  // Cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  // Aggiorna timeLeft quando cambia la durata
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(duration)
    }
  }, [duration, isRunning, isPaused])

  return {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    start,
    pause,
    resume,
    reset,
    setDuration: setNewDuration
  }
}

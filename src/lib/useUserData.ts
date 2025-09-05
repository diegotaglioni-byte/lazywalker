import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UserData {
  id: string
  name: string | null
  email: string
  nickname: string | null
  dailyGoal: number
  weeklyGoal: number
  totalWalks: number
  totalMinutes: number
  currentStreak: number
  createdAt: string
  walks?: Array<{
    id: string
    date: string
    duration: number
  }>
  badges: Array<{
    type: string
    emoji: string
    name: string
    description: string
  }>
  kudos: Array<{
    id: string
    type: string
    title: string
    description: string
    emoji: string
    earnedAt: string
  }>
}

export const useUserData = () => {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }

    fetchUserData()
  }, [session, status])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/data')
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento dati utente')
      }

      const data = await response.json()
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsLoading(false)
    }
  }

  const addWalk = async (duration: number, notes?: string) => {
    try {
      const response = await fetch('/api/user/walks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Errore nel salvare la camminata')
      }

      const result = await response.json()
      
      // Aggiorna i dati locali
      if (userData) {
        setUserData(prev => prev ? {
          ...prev,
          totalWalks: prev.totalWalks + 1,
          totalMinutes: prev.totalMinutes + duration,
          currentStreak: result.newStreak,
          badges: result.newBadges || prev.badges,
          kudos: result.newKudos ? [...prev.kudos, ...result.newKudos] : prev.kudos
        } : null)
      }

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      throw err
    }
  }

  const updateDailyGoal = async (newGoal: number) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dailyGoal: newGoal,
        }),
      })

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornare l\'obiettivo')
      }

      if (userData) {
        setUserData(prev => prev ? {
          ...prev,
          dailyGoal: newGoal
        } : null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      throw err
    }
  }

  const getTodayProgress = () => {
    if (!userData) return 0
    
    // Calcola il progresso di oggi dalle camminate
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const todayWalks = userData.walks?.filter(walk => 
      walk.date.startsWith(today)
    ) || []
    
    return todayWalks.reduce((total, walk) => total + walk.duration, 0)
  }

  return {
    userData,
    isLoading,
    error,
    addWalk,
    updateDailyGoal,
    getTodayProgress,
    refetch: fetchUserData,
    isAuthenticated: !!session?.user,
  }
}

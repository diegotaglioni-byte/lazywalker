import { useStorage } from './storage'

export const useStreak = () => {
  const { getBadges, addBadge } = useStorage()

  // Calcola lo streak attuale
  const getCurrentStreak = (): number => {
    try {
      // Controlla se siamo nel browser
      if (typeof window === 'undefined') {
        return 0
      }
      
      const streakData = localStorage.getItem('lazywalker_streak_data')
      if (!streakData) return 0

      const { lastActivityDate, currentStreak } = JSON.parse(streakData)
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

      // Se l'ultima attività è stata ieri, mantieni lo streak
      if (lastActivityDate === yesterday) {
        return currentStreak
      }
      
      // Se l'ultima attività è stata oggi, mantieni lo streak
      if (lastActivityDate === today) {
        return currentStreak
      }

      // Se è passato più di un giorno, resetta lo streak
      return 0
    } catch (error) {
      console.error('Errore nel calcolare lo streak:', error)
      return 0
    }
  }

  // Aggiorna lo streak dopo una camminata
  const updateStreak = () => {
    try {
      // Controlla se siamo nel browser
      if (typeof window === 'undefined') {
        return 0
      }
      
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      const streakData = localStorage.getItem('lazywalker_streak_data')
      let currentStreak = 0
      let lastActivityDate = ''

      if (streakData) {
        const parsed = JSON.parse(streakData)
        currentStreak = parsed.currentStreak
        lastActivityDate = parsed.lastActivityDate
      }

      // Se l'ultima attività è stata ieri, incrementa lo streak
      if (lastActivityDate === yesterday) {
        currentStreak += 1
      }
      // Se l'ultima attività è stata oggi, mantieni lo streak
      else if (lastActivityDate === today) {
        // Streak già aggiornato oggi
      }
      // Se è la prima volta o è passato più di un giorno, inizia da 1
      else {
        currentStreak = 1
      }

      // Salva i nuovi dati
      const newStreakData = {
        lastActivityDate: today,
        currentStreak: currentStreak
      }
      
      localStorage.setItem('lazywalker_streak_data', JSON.stringify(newStreakData))

      // Controlla e assegna badge basati sullo streak
      checkAndAssignBadges(currentStreak)

      return currentStreak
    } catch (error) {
      console.error('Errore nell\'aggiornare lo streak:', error)
      return 0
    }
  }

  // Controlla e assegna badge basati sullo streak
  const checkAndAssignBadges = (streak: number) => {
    const currentBadges = getBadges()
    
    // Badge per primi 3 giorni
    if (streak >= 3 && !currentBadges.includes('three_days')) {
      addBadge('three_days')
    }
    
    // Badge per 1 settimana
    if (streak >= 7 && !currentBadges.includes('one_week')) {
      addBadge('one_week')
    }
    
    // Badge per 2 settimane
    if (streak >= 14 && !currentBadges.includes('two_weeks')) {
      addBadge('two_weeks')
    }
    
    // Badge per 1 mese
    if (streak >= 30 && !currentBadges.includes('one_month')) {
      addBadge('one_month')
    }
  }

  // Assegna badge per la prima camminata
  const assignFirstWalkBadge = () => {
    const currentBadges = getBadges()
    if (!currentBadges.includes('first_walk')) {
      addBadge('first_walk')
    }
  }

  return {
    currentStreak: getCurrentStreak(),
    updateStreak,
    assignFirstWalkBadge,
    getBadges
  }
}

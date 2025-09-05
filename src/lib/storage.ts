// Utility per gestire il localStorage in modo sicuro
export const useStorage = () => {
  const STORAGE_KEYS = {
    NICKNAME: 'lazywalker_nickname',
    DAILY_GOAL: 'lazywalker_daily_goal',
    TODAY_PROGRESS: 'lazywalker_today_progress',
    LAST_ACTIVITY_DATE: 'lazywalker_last_activity_date',
    BADGES: 'lazywalker_badges'
  }

  // Funzione helper per salvare nel localStorage
  const saveToStorage = (key: string, value: any) => {
    try {
      // Controlla se siamo nel browser
      if (typeof window === 'undefined') {
        return
      }
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Errore nel salvare nel localStorage:', error)
    }
  }

  // Funzione helper per leggere dal localStorage
  const getFromStorage = (key: string, defaultValue: any = null) => {
    try {
      // Controlla se siamo nel browser
      if (typeof window === 'undefined') {
        return defaultValue
      }
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Errore nel leggere dal localStorage:', error)
      return defaultValue
    }
  }

  // Gestione nickname
  const setNickname = (nickname: string) => {
    saveToStorage(STORAGE_KEYS.NICKNAME, nickname)
  }

  const getNickname = (): string => {
    return getFromStorage(STORAGE_KEYS.NICKNAME, '')
  }

  // Gestione obiettivo giornaliero
  const setDailyGoal = (minutes: number) => {
    saveToStorage(STORAGE_KEYS.DAILY_GOAL, minutes)
  }

  const getDailyGoal = (): number => {
    return getFromStorage(STORAGE_KEYS.DAILY_GOAL, 10)
  }

  // Gestione progresso giornaliero
  const getTodayProgress = (): number => {
    const today = new Date().toDateString()
    const lastActivityDate = getFromStorage(STORAGE_KEYS.LAST_ACTIVITY_DATE, '')
    
    // Se è un nuovo giorno, resetta il progresso
    if (lastActivityDate !== today) {
      saveToStorage(STORAGE_KEYS.TODAY_PROGRESS, 0)
      saveToStorage(STORAGE_KEYS.LAST_ACTIVITY_DATE, today)
      return 0
    }
    
    return getFromStorage(STORAGE_KEYS.TODAY_PROGRESS, 0)
  }

  const addTodayProgress = (minutes: number) => {
    const currentProgress = getTodayProgress()
    const newProgress = currentProgress + minutes
    saveToStorage(STORAGE_KEYS.TODAY_PROGRESS, newProgress)
    saveToStorage(STORAGE_KEYS.LAST_ACTIVITY_DATE, new Date().toDateString())
  }

  // Gestione badge
  const getBadges = (): string[] => {
    return getFromStorage(STORAGE_KEYS.BADGES, [])
  }

  const addBadge = (badgeType: string) => {
    const currentBadges = getBadges()
    if (!currentBadges.includes(badgeType)) {
      const newBadges = [...currentBadges, badgeType]
      saveToStorage(STORAGE_KEYS.BADGES, newBadges)
    }
  }

  return {
    setNickname,
    getNickname,
    setDailyGoal,
    getDailyGoal,
    getTodayProgress,
    addTodayProgress,
    getBadges,
    addBadge
  }
}

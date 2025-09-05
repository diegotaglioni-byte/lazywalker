// Utility per gestire le date
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return date.toDateString() === yesterday.toDateString()
}

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const getStartOfDay = (date: Date): Date => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

export const getEndOfDay = (date: Date): Date => {
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

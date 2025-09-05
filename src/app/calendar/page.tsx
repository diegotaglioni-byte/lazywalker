'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/lib/useUserData'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

interface ScheduledWalk {
  id: string
  scheduledDate: string
  time?: string
  notes?: string
  isCompleted: boolean
  completedAt?: string
}

interface Walk {
  id: string
  date: string
  duration: number
  completedAt: string
}

export default function CalendarPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { userData, isLoading } = useUserData()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledWalks, setScheduledWalks] = useState<ScheduledWalk[]>([])
  const [completedWalks, setCompletedWalks] = useState<Walk[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduleNotes, setScheduleNotes] = useState('')
  const [weeklyStats, setWeeklyStats] = useState({
    completed: 0,
    scheduled: 0,
    goal: 4
  })

  // Genera i giorni del mese
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Aggiungi giorni vuoti per allineare il primo giorno
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Aggiungi i giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      days.push({
        day,
        date: dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isPast: new Date(dateStr) < new Date(new Date().toISOString().split('T')[0])
      })
    }
    
    return days
  }

  // Calcola le statistiche settimanali
  const calculateWeeklyStats = useCallback((walks: Walk[]) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const weekWalks = walks.filter(walk => {
      const walkDate = new Date(walk.date)
      return walkDate >= startOfWeek && walkDate <= endOfWeek
    })

    const uniqueDays = new Set(weekWalks.map(walk => walk.date))
    
    setWeeklyStats({
      completed: uniqueDays.size,
      scheduled: scheduledWalks.filter(s => !s.isCompleted).length,
      goal: userData?.weeklyGoal || 4
    })
  }, [scheduledWalks, userData?.weeklyGoal])

  // Carica le camminate programmate e completate
  const loadWalks = useCallback(async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/user/calendar')
      if (response.ok) {
        const data = await response.json()
        setScheduledWalks(data.scheduledWalks || [])
        setCompletedWalks(data.completedWalks || [])
        calculateWeeklyStats(data.completedWalks || [])
      }
    } catch (error) {
      console.error('Errore nel caricamento delle camminate:', error)
    }
  }, [session?.user?.email, calculateWeeklyStats])

  // Programma una camminata
  const scheduleWalk = async () => {
    if (!selectedDate || !session?.user?.email) return

    try {
      const response = await fetch('/api/user/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDate: selectedDate,
          time: scheduleTime || null,
          notes: scheduleNotes || null
        }),
      })

      if (response.ok) {
        setShowScheduleModal(false)
        setScheduleTime('')
        setScheduleNotes('')
        setSelectedDate('')
        loadWalks()
      }
    } catch (error) {
      console.error('Errore nella programmazione:', error)
    }
  }

  // Rimuovi una camminata programmata
  const removeScheduledWalk = async (id: string) => {
    try {
      const response = await fetch(`/api/user/calendar/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadWalks()
      }
    } catch (error) {
      console.error('Errore nella rimozione:', error)
    }
  }

  useEffect(() => {
    if (session) {
      loadWalks()
    }
  }, [session, currentDate, loadWalks])

  useEffect(() => {
    calculateWeeklyStats(completedWalks)
  }, [completedWalks, scheduledWalks, userData?.weeklyGoal, calculateWeeklyStats])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!session || !userData) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Calendario
            </h1>
            <p className="text-gray-600 mb-4">
              Devi essere loggato per vedere il calendario
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Vai al Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const getDayStatus = (date: string) => {
    const completed = completedWalks.some(walk => walk.date === date)
    const scheduled = scheduledWalks.find(s => s.scheduledDate === date)
    
    if (completed) return 'completed'
    if (scheduled) return 'scheduled'
    return 'empty'
  }

  const getDayIcon = (date: string) => {
    const status = getDayStatus(date)
    switch (status) {
      case 'completed': return '✅'
      case 'scheduled': return '📅'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📅 Calendario Japanese Walking
        </h1>
        <p className="text-gray-600">
          Programma le tue camminate e monitora i tuoi progressi
        </p>
      </div>

      {/* Weekly Stats */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📊 Obiettivo Settimanale
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {weeklyStats.completed}
            </div>
            <div className="text-sm text-gray-600">Completate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {weeklyStats.scheduled}
            </div>
            <div className="text-sm text-gray-600">Programmate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {weeklyStats.goal}
            </div>
            <div className="text-sm text-gray-600">Obiettivo</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso settimanale</span>
            <span>{weeklyStats.completed}/{weeklyStats.goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                weeklyStats.completed >= weeklyStats.goal 
                  ? 'bg-green-500' 
                  : weeklyStats.completed >= weeklyStats.goal * 0.75
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((weeklyStats.completed / weeklyStats.goal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        {weeklyStats.completed >= weeklyStats.goal ? (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-semibold">
              🎉 Obiettivo settimanale raggiunto!
            </div>
            <div className="text-green-600 text-sm">
              Hai completato {weeklyStats.completed} camminate questa settimana!
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-semibold">
              ⚠️ Obiettivo settimanale
            </div>
            <div className="text-yellow-600 text-sm">
              Ti mancano {weeklyStats.goal - weeklyStats.completed} camminate per raggiungere l&apos;obiettivo settimanale
            </div>
          </div>
        )}
      </Card>

      {/* Calendar */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="btn-outline text-sm"
            >
              ←
            </Button>
            <Button
              onClick={() => setCurrentDate(new Date())}
              className="btn-outline text-sm"
            >
              Oggi
            </Button>
            <Button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="btn-outline text-sm"
            >
              →
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Header */}
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 min-h-[60px] border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                day?.isToday 
                  ? 'bg-primary-100 border-primary-300' 
                  : day?.isPast 
                  ? 'bg-gray-50' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => {
                if (day && !day.isPast) {
                  setSelectedDate(day.date)
                  setShowScheduleModal(true)
                }
              }}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-gray-800">
                    {day.day}
                  </div>
                  <div className="text-lg mt-1">
                    {getDayIcon(day.date)}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Completata</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Programmata</span>
          </div>
        </div>
      </Card>

      {/* Scheduled Walks List */}
      {scheduledWalks.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Camminate Programmate
          </h2>
          <div className="space-y-3">
            {scheduledWalks
              .filter(s => !s.isCompleted)
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((scheduled) => (
                <div key={scheduled.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {new Date(scheduled.scheduledDate).toLocaleDateString('it-IT')}
                    </div>
                    {scheduled.time && (
                      <div className="text-sm text-gray-600">
                        Ore: {scheduled.time}
                      </div>
                    )}
                    {scheduled.notes && (
                      <div className="text-sm text-gray-600">
                        {scheduled.notes}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => removeScheduledWalk(scheduled.id)}
                    className="btn-outline text-sm"
                  >
                    ❌
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📅 Programma Camminata
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  {selectedDate && new Date(selectedDate).toLocaleDateString('it-IT')}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ora (opzionale)
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (opzionale)
                </label>
                <textarea
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Aggiungi note per questa camminata..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowScheduleModal(false)}
                className="btn-outline flex-1"
              >
                Annulla
              </Button>
              <Button
                onClick={scheduleWalk}
                className="btn-primary flex-1"
              >
                Programma
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="text-center space-x-4">
        <Button onClick={() => router.push('/')} className="btn-secondary">
          🏠 Home
        </Button>
        <Button onClick={() => router.push('/timer')} className="btn-primary">
          ⏱️ Inizia Japanese Walking
        </Button>
      </div>
    </div>
  )
}

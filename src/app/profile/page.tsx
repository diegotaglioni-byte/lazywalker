'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/lib/useUserData'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { userData, isLoading, updateDailyGoal } = useUserData()
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState(userData?.dailyGoal || 10)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveGoal = async () => {
    setIsSaving(true)
    try {
      await updateDailyGoal(newGoal)
      setIsEditing(false)
    } catch (error) {
      console.error('Errore nel salvare l\'obiettivo:', error)
    } finally {
      setIsSaving(false)
    }
  }

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
              Profilo
            </h1>
            <p className="text-gray-600 mb-4">
              Devi essere loggato per vedere il profilo
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Vai al Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          👤 Il Mio Profilo
        </h1>
        <p className="text-gray-600">
          Gestisci le tue informazioni e obiettivi
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Informazioni Personali
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {userData.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {userData.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {userData.nickname || 'Non impostato'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membro dal
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {new Date(userData.createdAt).toLocaleDateString('it-IT')}
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Goal */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎯 Obiettivo Giornaliero
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Attualmente: <span className="font-semibold">{userData.dailyGoal} minuti</span>
            </p>
            <p className="text-sm text-gray-500">
              Quanti minuti di camminata vuoi fare ogni giorno?
            </p>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <select
                value={newGoal}
                onChange={(e) => setNewGoal(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value={5}>5 minuti</option>
                <option value={10}>10 minuti</option>
                <option value={15}>15 minuti</option>
                <option value={20}>20 minuti</option>
                <option value={30}>30 minuti</option>
              </select>
              <Button
                onClick={handleSaveGoal}
                className="btn-primary text-sm"
                disabled={isSaving}
              >
                {isSaving ? 'Salvataggio...' : 'Salva'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  setNewGoal(userData.dailyGoal)
                }}
                className="btn-secondary text-sm"
              >
                Annulla
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-sm"
            >
              Modifica
            </Button>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userData.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Giorni di Streak</div>
            <div className="text-xs text-gray-500 mt-1">
              Giorni consecutivi di Japanese Walking
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userData.totalWalks}
            </div>
            <div className="text-sm text-gray-600">Camminate Totali</div>
            <div className="text-xs text-gray-500 mt-1">
              Sessioni completate
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userData.totalMinutes}
            </div>
            <div className="text-sm text-gray-600">Minuti Totali</div>
            <div className="text-xs text-gray-500 mt-1">
              Tempo totale di Japanese Walking
            </div>
          </div>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🏆 I Miei Badge ({userData.badges?.length || 0})
        </h2>
        {userData.badges && userData.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userData.badges.map((badge, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <div className="font-semibold text-sm">{badge.name}</div>
                <div className="text-xs text-gray-600">{badge.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏃‍♀️</div>
            <p>Inizia la Japanese Walking per sbloccare i tuoi primi badge!</p>
          </div>
        )}
      </Card>

      {/* Recent Kudos */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🎉 Kudos Recenti ({userData.kudos?.length || 0})
        </h2>
        {userData.kudos && userData.kudos.length > 0 ? (
          <div className="space-y-3">
            {userData.kudos.slice(0, 5).map((kudos, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{kudos.emoji}</div>
                <div>
                  <div className="font-semibold">{kudos.title}</div>
                  <div className="text-sm text-gray-600">{kudos.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>Completa la Japanese Walking per ricevere kudos!</p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="text-center space-x-4">
        <Button onClick={() => router.push('/')} className="btn-secondary">
          🏠 Home
        </Button>
        <Button onClick={() => router.push('/timer')} className="btn-primary">
          ⏱️ Inizia Japanese Walking
        </Button>
        <Button onClick={() => router.push('/calendar')} className="btn-secondary">
          📅 Calendario
        </Button>
      </div>
    </div>
  )
}

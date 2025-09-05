'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { ProgressBar } from '@/components/ProgressBar'
import { useUserData } from '@/lib/useUserData'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { userData, isLoading, isAuthenticated, getTodayProgress } = useUserData()

  // Redirect se non autenticato
  useEffect(() => {
    if (status === 'loading') return
    
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
  }, [status, isAuthenticated, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-primary-500">Caricamento...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Errore nel caricamento dei dati</p>
          <Button onClick={() => router.push('/auth/signin')} className="btn-primary">
            Torna al login
          </Button>
        </div>
      </div>
    )
  }

  const progressPercentage = userData.dailyGoal > 0 ? (getTodayProgress() / userData.dailyGoal) * 100 : 0

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-8">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button
            onClick={async () => {
              try {
                await signOut({ callbackUrl: '/auth/signin' })
              } catch (error) {
                console.error('Errore durante il logout:', error)
                router.push('/auth/signin')
              }
            }}
            className="btn-secondary text-sm"
          >
            Logout
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ciao, {userData.nickname || userData.name}! 👋
        </h1>
        <p className="text-gray-600">
          Pronto per la tua camminata giapponese?
        </p>
      </div>

      {/* Streak */}
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {userData.currentStreak}
          </div>
          <div className="text-gray-600">
            Giorni consecutivi 🔥
          </div>
        </div>
      </Card>

      {/* Progresso giornaliero */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Obiettivo giornaliero
            </h3>
            <span className="text-sm text-gray-600">
              {getTodayProgress()}/{userData.dailyGoal} min
            </span>
          </div>
          
          <ProgressBar 
            progress={progressPercentage}
            className="h-4"
          />
          
          <div className="text-center">
            {progressPercentage >= 100 ? (
              <div className="text-success-600 font-semibold">
                🎉 Obiettivo raggiunto!
              </div>
            ) : (
              <div className="text-gray-600">
                {Math.round(userData.dailyGoal - getTodayProgress())} min rimanenti
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Badge */}
      {userData.badges.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            I tuoi badge
          </h3>
          <div className="flex flex-wrap gap-2">
            {userData.badges.map((badge, index) => (
              <Badge key={index} badge={badge} />
            ))}
          </div>
        </Card>
      )}

      {/* Kudos recenti */}
      {userData.kudos.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            I tuoi kudos recenti 🏆
          </h3>
          <div className="space-y-3">
            {userData.kudos.slice(0, 3).map((kudos) => (
              <div key={kudos.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="font-semibold text-yellow-800">{kudos.title}</div>
                <div className="text-sm text-yellow-700">{kudos.description}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Azioni principali */}
      <div className="space-y-4">
        <Button
          onClick={() => router.push('/timer')}
          className="w-full btn-primary text-lg py-4"
        >
          🚶‍♀️ Inizia Japanese Walking
        </Button>
        
        <Button
          onClick={() => router.push('/calendar')}
          className="w-full btn-secondary"
        >
          📅 Calendario
        </Button>
        
        <Button
          onClick={() => router.push('/profile')}
          className="w-full btn-secondary"
        >
          👤 Profilo
        </Button>
        
        <Button
          onClick={async () => {
            try {
              await signOut({ callbackUrl: '/auth/signin' })
            } catch (error) {
              console.error('Errore durante il logout:', error)
              router.push('/auth/signin')
            }
          }}
          className="w-full btn-outline"
        >
          Logout
        </Button>
      </div>

      {/* Development Links */}
      {process.env.NODE_ENV === 'development' && (
        <div className="space-y-2">
          <div className="text-center text-sm text-gray-500">
            Development Tools:
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/test')}
              className="flex-1 btn-outline text-xs"
            >
              🧪 Test Page
            </Button>
            <Button
              onClick={() => router.push('/admin')}
              className="flex-1 btn-outline text-xs"
            >
              🔧 Admin Panel
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pb-8">
        <p>LazyWalker - Japanese Walking Timer</p>
        <p>Camminata giapponese con intervalli per il benessere 🌱</p>
      </div>
    </div>
  )
}

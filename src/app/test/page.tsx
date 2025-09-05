'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useUserData } from '@/lib/useUserData'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export default function TestPage() {
  const { data: session, status } = useSession()
  const { userData, isLoading, addWalk, getTodayProgress } = useUserData()
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const runTests = async () => {
    setTestResults([])
    addTestResult('🧪 Inizio test...')

    // Test 1: Verifica sessione
    if (status === 'loading') {
      addTestResult('⏳ Caricamento sessione...')
      return
    }
    
    if (!session) {
      addTestResult('❌ Nessuna sessione attiva')
      return
    }
    
    addTestResult('✅ Sessione attiva')

    // Test 2: Verifica dati utente
    if (isLoading) {
      addTestResult('⏳ Caricamento dati utente...')
      return
    }
    
    if (!userData) {
      addTestResult('❌ Nessun dato utente')
      return
    }
    
    addTestResult(`✅ Dati utente caricati: ${userData.nickname || userData.name}`)

    // Test 3: Verifica progresso giornaliero
    const progress = getTodayProgress()
    addTestResult(`✅ Progresso giornaliero: ${progress} minuti`)

    // Test 4: Test aggiunta camminata
    try {
      addTestResult('🧪 Test aggiunta camminata...')
      const result = await addWalk(5)
      addTestResult(`✅ Camminata aggiunta: ${result.duration} minuti`)
      addTestResult(`✅ Nuovo streak: ${result.newStreak}`)
      addTestResult(`✅ Badge ottenuti: ${result.newBadges?.length || 0}`)
      addTestResult(`✅ Kudos ricevuti: ${result.newKudos?.length || 0}`)
    } catch (error) {
      addTestResult(`❌ Errore aggiunta camminata: ${error}`)
    }

    // Test 5: Verifica aggiornamento progresso
    const newProgress = getTodayProgress()
    addTestResult(`✅ Nuovo progresso: ${newProgress} minuti`)

    addTestResult('🎉 Test completati!')
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

  if (!session) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Test Page
            </h1>
            <p className="text-gray-600 mb-4">
              Devi essere loggato per eseguire i test
            </p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
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
          🧪 Test Page
        </h1>
        <p className="text-gray-600">
          Testa tutte le funzionalità dell&apos;app
        </p>
      </div>

      {/* Info Utente */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📊 Informazioni Utente
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Nome:</span> {userData?.name}
          </div>
          <div>
            <span className="font-medium">Nickname:</span> {userData?.nickname || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userData?.email}
          </div>
          <div>
            <span className="font-medium">Streak:</span> {userData?.currentStreak || 0}
          </div>
          <div>
            <span className="font-medium">Obiettivo:</span> {userData?.dailyGoal} min
          </div>
          <div>
            <span className="font-medium">Progresso oggi:</span> {getTodayProgress()} min
          </div>
          <div>
            <span className="font-medium">Camminate totali:</span> {userData?.totalWalks || 0}
          </div>
          <div>
            <span className="font-medium">Minuti totali:</span> {userData?.totalMinutes || 0}
          </div>
        </div>
      </Card>

      {/* Badge e Kudos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🏆 Badge ({userData?.badges?.length || 0})
          </h2>
          <div className="space-y-2">
            {userData?.badges?.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-2xl">{badge.emoji}</span>
                <div>
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-sm text-gray-600">{badge.description}</div>
                </div>
              </div>
            )) || <p className="text-gray-500">Nessun badge ancora</p>}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎉 Kudos ({userData?.kudos?.length || 0})
          </h2>
          <div className="space-y-2">
            {userData?.kudos?.map((kudos, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-2xl">{kudos.emoji}</span>
                <div>
                  <div className="font-medium">{kudos.title}</div>
                  <div className="text-sm text-gray-600">{kudos.description}</div>
                </div>
              </div>
            )) || <p className="text-gray-500">Nessun kudos ancora</p>}
          </div>
        </Card>
      </div>

      {/* Test Controls */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🧪 Test Controls
        </h2>
        <div className="space-y-4">
          <Button onClick={runTests} className="btn-primary">
            🚀 Esegui Test Completi
          </Button>
          
          <Button 
            onClick={() => addWalk(30)} 
            className="btn-secondary"
          >
            ➕ Aggiungi Japanese Walking (30 min)
          </Button>
        </div>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Risultati Test
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                {result}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="text-center space-x-4">
        <Button onClick={() => window.location.href = '/'} className="btn-secondary">
          🏠 Home
        </Button>
        <Button onClick={() => window.location.href = '/timer'} className="btn-primary">
          ⏱️ Japanese Walking Timer
        </Button>
        <Button onClick={() => window.location.href = '/calendar'} className="btn-secondary">
          📅 Calendario
        </Button>
      </div>
    </div>
  )
}

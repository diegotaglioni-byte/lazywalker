'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

interface User {
  id: string
  name: string
  email: string
  nickname?: string
  dailyGoal: number
  currentStreak: number
  totalWalks: number
  totalMinutes: number
  createdAt: string
}

interface Walk {
  id: string
  duration: number
  date: string
  user: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [walks, setWalks] = useState<Walk[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Solo per test - in produzione dovresti avere un sistema di ruoli
  const isAdmin = session?.user?.email === 'admin@example.com' || 
                  session?.user?.email === 'diego.taglioni@u-hopper.com'

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Errore nel caricamento utenti')
      }
    } catch (error) {
      setError('Errore di connessione')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWalks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/walks')
      if (response.ok) {
        const data = await response.json()
        setWalks(data)
      } else {
        setError('Errore nel caricamento camminate')
      }
    } catch (error) {
      setError('Errore di connessione')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
      fetchWalks()
    }
  }, [isAdmin])

  if (status === 'loading') {
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
              Admin Panel
            </h1>
            <p className="text-gray-600 mb-4">
              Devi essere loggato per accedere
            </p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Vai al Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              🔒 Accesso Negato
            </h1>
            <p className="text-gray-600 mb-4">
              Non hai i permessi per accedere a questa pagina
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Torna alla Home
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
          🔧 Admin Panel
        </h1>
        <p className="text-gray-600">
          Gestione utenti e camminate
        </p>
      </div>

      {error && (
        <Card>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Utenti Totali</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {walks.length}
            </div>
            <div className="text-sm text-gray-600">Camminate Totali</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {walks.reduce((total, walk) => total + walk.duration, 0)}
            </div>
            <div className="text-sm text-gray-600">Minuti Totali</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {users.reduce((total, user) => total + user.currentStreak, 0)}
            </div>
            <div className="text-sm text-gray-600">Streak Totali</div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            👥 Utenti ({users.length})
          </h2>
          <Button onClick={fetchUsers} className="btn-secondary text-sm">
            🔄 Aggiorna
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Nome</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Nickname</th>
                <th className="text-left py-2">Obiettivo</th>
                <th className="text-left py-2">Streak</th>
                <th className="text-left py-2">Camminate</th>
                <th className="text-left py-2">Minuti</th>
                <th className="text-left py-2">Registrato</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.nickname || 'N/A'}</td>
                  <td className="py-2">{user.dailyGoal} min</td>
                  <td className="py-2">{user.currentStreak}</td>
                  <td className="py-2">{user.totalWalks}</td>
                  <td className="py-2">{user.totalMinutes}</td>
                  <td className="py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Walks Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🚶‍♀️ Camminate Recenti ({walks.length})
          </h2>
          <Button onClick={fetchWalks} className="btn-secondary text-sm">
            🔄 Aggiorna
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Utente</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Durata</th>
                <th className="text-left py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {walks.slice(0, 20).map((walk) => (
                <tr key={walk.id} className="border-b">
                  <td className="py-2">{walk.user.name}</td>
                  <td className="py-2">{walk.user.email}</td>
                  <td className="py-2">{walk.duration} min</td>
                  <td className="py-2">
                    {new Date(walk.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Navigation */}
      <div className="text-center space-x-4">
        <Button onClick={() => window.location.href = '/'} className="btn-secondary">
          🏠 Home
        </Button>
        <Button onClick={() => window.location.href = '/test'} className="btn-primary">
          🧪 Test Page
        </Button>
      </div>
    </div>
  )
}

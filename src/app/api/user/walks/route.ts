import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendKudosEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    const { duration, notes } = await request.json()

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { error: 'Durata non valida' },
        { status: 400 }
      )
    }

    // Aggiungi la camminata
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const walk = await prisma.walk.create({
      data: {
        userId: session.user.id,
        duration,
        date: today,
        notes: notes || null,
      }
    })

    // Calcola nuovo streak
    const newStreak = await calculateAndUpdateStreak(session.user.id)

    // Controlla e assegna badge
    const newBadges = await checkAndAssignBadges(session.user.id, newStreak)

    // Controlla e assegna kudos
    const newKudos = await checkAndAssignKudos(session.user.id, duration, newStreak)

    // Controlla obiettivo settimanale
    await checkWeeklyGoal(session.user.id)

    // Invia email per kudos importanti
    if (newKudos.length > 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      })
      
      if (user?.email) {
        for (const kudos of newKudos) {
          try {
            await sendKudosEmail(user.email, user.name || 'Utente', kudos.title, kudos.description)
          } catch (emailError) {
            console.error('Errore invio email kudos:', emailError)
          }
        }
      }
    }

    return NextResponse.json({
      walk,
      newStreak,
      newBadges,
      newKudos
    })

  } catch (error) {
    console.error('Errore nell\'aggiungere camminata:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

async function calculateAndUpdateStreak(userId: string): Promise<number> {
  try {
    const walks = await prisma.walk.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' }
    })

    if (walks.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < walks.length; i++) {
      const walkDate = new Date(walks[i].completedAt)
      walkDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)

      if (walkDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  } catch (error) {
    console.error('Errore nel calcolare streak:', error)
    return 0
  }
}

async function checkAndAssignBadges(userId: string, streak: number): Promise<string[]> {
  const newBadges: string[] = []

  try {
    const existingBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeType: true }
    })

    const existingBadgeTypes = existingBadges.map(b => b.badgeType)

    // Badge per primi 3 giorni
    if (streak >= 3 && !existingBadgeTypes.includes('three_days')) {
      await prisma.userBadge.create({
        data: { userId, badgeType: 'three_days' }
      })
      newBadges.push('three_days')
    }

    // Badge per 1 settimana
    if (streak >= 7 && !existingBadgeTypes.includes('one_week')) {
      await prisma.userBadge.create({
        data: { userId, badgeType: 'one_week' }
      })
      newBadges.push('one_week')
    }

    // Badge per 2 settimane
    if (streak >= 14 && !existingBadgeTypes.includes('two_weeks')) {
      await prisma.userBadge.create({
        data: { userId, badgeType: 'two_weeks' }
      })
      newBadges.push('two_weeks')
    }

    // Badge per 1 mese
    if (streak >= 30 && !existingBadgeTypes.includes('one_month')) {
      await prisma.userBadge.create({
        data: { userId, badgeType: 'one_month' }
      })
      newBadges.push('one_month')
    }

  } catch (error) {
    console.error('Errore nell\'assegnare badge:', error)
  }

  return newBadges
}

async function checkAndAssignKudos(userId: string, duration: number, streak: number): Promise<Array<{id: string, type: string, title: string, description: string, earnedAt: string}>> {
  const newKudos: Array<{id: string, type: string, title: string, description: string, earnedAt: string}> = []

  try {
    const existingKudos = await prisma.kudos.findMany({
      where: { userId },
      select: { type: true }
    })

    const existingKudosTypes = existingKudos.map(k => k.type)

    // Kudos per prima camminata
    if (!existingKudosTypes.includes('first_walk')) {
      const kudos = await prisma.kudos.create({
        data: {
          userId,
          type: 'first_walk',
          title: 'Primo passo! 🚶‍♀️',
          description: 'Hai completato la tua prima camminata giapponese!'
        }
      })
      newKudos.push({
        id: kudos.id,
        type: kudos.type,
        title: kudos.title,
        description: kudos.description,
        earnedAt: kudos.earnedAt.toISOString()
      })
    }

    // Kudos per obiettivo giornaliero raggiunto
    if (duration >= 10 && !existingKudosTypes.includes('daily_goal_10')) {
      const kudos = await prisma.kudos.create({
        data: {
          userId,
          type: 'daily_goal_10',
          title: 'Obiettivo raggiunto! 🎯',
          description: 'Hai completato 10 minuti di camminata in una sessione!'
        }
      })
      newKudos.push({
        id: kudos.id,
        type: kudos.type,
        title: kudos.title,
        description: kudos.description,
        earnedAt: kudos.earnedAt.toISOString()
      })
    }

    // Kudos per streak
    if (streak === 3 && !existingKudosTypes.includes('streak_3')) {
      const kudos = await prisma.kudos.create({
        data: {
          userId,
          type: 'streak_3',
          title: '3 giorni consecutivi! 🔥',
          description: 'Hai camminato per 3 giorni di fila!'
        }
      })
      newKudos.push({
        id: kudos.id,
        type: kudos.type,
        title: kudos.title,
        description: kudos.description,
        earnedAt: kudos.earnedAt.toISOString()
      })
    }

    if (streak === 7 && !existingKudosTypes.includes('streak_7')) {
      const kudos = await prisma.kudos.create({
        data: {
          userId,
          type: 'streak_7',
          title: 'Una settimana! 🏆',
          description: 'Hai camminato per 7 giorni consecutivi!'
        }
      })
      newKudos.push({
        id: kudos.id,
        type: kudos.type,
        title: kudos.title,
        description: kudos.description,
        earnedAt: kudos.earnedAt.toISOString()
      })
    }

  } catch (error) {
    console.error('Errore nell\'assegnare kudos:', error)
  }

  return newKudos
}

// Funzione per controllare l'obiettivo settimanale
async function checkWeeklyGoal(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return

    const weeklyGoal = user.weeklyGoal || 4

    // Calcola l'inizio e la fine della settimana corrente
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    // Conta le camminate di questa settimana
    const weekWalks = await prisma.walk.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek.toISOString().split('T')[0],
          lte: endOfWeek.toISOString().split('T')[0]
        }
      }
    })

    const uniqueDays = new Set(weekWalks.map(walk => walk.date))
    const weeklyCount = uniqueDays.size

    // Controlla se ha già ricevuto il kudos per questa settimana
    const existingKudos = await prisma.kudos.findFirst({
      where: {
        userId,
        type: 'weekly_goal',
        earnedAt: {
          gte: startOfWeek
        }
      }
    })

    // Se ha raggiunto l'obiettivo e non ha ancora ricevuto il kudos
    if (weeklyCount >= weeklyGoal && !existingKudos) {
      await prisma.kudos.create({
        data: {
          userId,
          type: 'weekly_goal',
          title: 'Obiettivo Settimanale Raggiunto! 🎯',
          description: `Hai completato ${weeklyCount} camminate questa settimana!`
        }
      })

      // Invia email di congratulazioni
      if (user.email) {
        const { sendKudosEmail } = await import('@/lib/email')
        await sendKudosEmail(
          user.email,
          user.name || user.nickname || 'Utente',
          'Obiettivo Settimanale Raggiunto! 🎯',
          `Hai completato ${weeklyCount} camminate questa settimana!`
        )
      }
    }
  } catch (error) {
    console.error('Errore nel controllo obiettivo settimanale:', error)
  }
}

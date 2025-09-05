import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    // Recupera i dati dell'utente
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        walks: {
          orderBy: { date: 'desc' },
          take: 10 // Ultime 10 camminate
        },
        badges: {
          orderBy: { earnedAt: 'desc' }
        },
        kudos: {
          orderBy: { earnedAt: 'desc' },
          take: 5 // Ultimi 5 kudos
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      )
    }

    // Calcola statistiche
    const totalWalks = user.walks.length
    const totalMinutes = user.walks.reduce((sum, walk) => sum + walk.duration, 0)
    
    // Calcola streak attuale
    const currentStreak = await calculateCurrentStreak(user.id)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      dailyGoal: user.dailyGoal,
      weeklyGoal: user.weeklyGoal || 4,
      totalWalks,
      totalMinutes,
      currentStreak,
      createdAt: user.createdAt.toISOString(),
      walks: user.walks.map(walk => ({
        id: walk.id,
        date: walk.date,
        duration: walk.duration
      })),
      badges: user.badges.map(badge => ({
        type: badge.badgeType,
        emoji: getBadgeEmoji(badge.badgeType),
        name: getBadgeName(badge.badgeType),
        description: getBadgeDescription(badge.badgeType)
      })),
      kudos: user.kudos.map(kudos => ({
        id: kudos.id,
        type: kudos.type,
        title: kudos.title,
        description: kudos.description,
        emoji: getKudosEmoji(kudos.type),
        earnedAt: kudos.earnedAt.toISOString()
      }))
    }

    return NextResponse.json(userData)

  } catch (error) {
    console.error('Errore nel recuperare dati utente:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

async function calculateCurrentStreak(userId: string): Promise<number> {
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

function getBadgeEmoji(badgeType: string): string {
  const emojiMap: { [key: string]: string } = {
    'FIRST_WALK': '🚶‍♀️',
    'WEEK_STREAK': '📅',
    'MONTH_STREAK': '🗓️',
    'TOTAL_WALKS_10': '🎯',
    'TOTAL_WALKS_50': '🏆',
    'TOTAL_WALKS_100': '💎',
    'TOTAL_MINUTES_100': '⏰',
    'TOTAL_MINUTES_500': '🕐',
    'TOTAL_MINUTES_1000': '⏳'
  }
  return emojiMap[badgeType] || '🏅'
}

function getBadgeName(badgeType: string): string {
  const nameMap: { [key: string]: string } = {
    'FIRST_WALK': 'Prima Camminata',
    'WEEK_STREAK': 'Settimana Completa',
    'MONTH_STREAK': 'Mese Completo',
    'TOTAL_WALKS_10': '10 Camminate',
    'TOTAL_WALKS_50': '50 Camminate',
    'TOTAL_WALKS_100': '100 Camminate',
    'TOTAL_MINUTES_100': '100 Minuti',
    'TOTAL_MINUTES_500': '500 Minuti',
    'TOTAL_MINUTES_1000': '1000 Minuti'
  }
  return nameMap[badgeType] || 'Badge Sconosciuto'
}

function getBadgeDescription(badgeType: string): string {
  const descMap: { [key: string]: string } = {
    'FIRST_WALK': 'Hai completato la tua prima camminata!',
    'WEEK_STREAK': 'Hai camminato per 7 giorni consecutivi',
    'MONTH_STREAK': 'Hai camminato per 30 giorni consecutivi',
    'TOTAL_WALKS_10': 'Hai completato 10 camminate totali',
    'TOTAL_WALKS_50': 'Hai completato 50 camminate totali',
    'TOTAL_WALKS_100': 'Hai completato 100 camminate totali',
    'TOTAL_MINUTES_100': 'Hai camminato per 100 minuti totali',
    'TOTAL_MINUTES_500': 'Hai camminato per 500 minuti totali',
    'TOTAL_MINUTES_1000': 'Hai camminato per 1000 minuti totali'
  }
  return descMap[badgeType] || 'Badge ottenuto!'
}

function getKudosEmoji(kudosType: string): string {
  const emojiMap: { [key: string]: string } = {
    'MOTIVATION': '💪',
    'CONGRATULATION': '🎉',
    'ENCOURAGEMENT': '🌟',
    'ACHIEVEMENT': '🏆',
    'SUPPORT': '🤝',
    'CELEBRATION': '🎊'
  }
  return emojiMap[kudosType] || '👏'
}

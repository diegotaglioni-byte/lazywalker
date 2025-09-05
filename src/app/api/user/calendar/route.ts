import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Carica camminate programmate e completate
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
    }

    // Carica camminate programmate
    const scheduledWalks = await prisma.scheduledWalk.findMany({
      where: { userId: user.id },
      orderBy: { scheduledDate: 'asc' }
    })

    // Carica camminate completate
    const completedWalks = await prisma.walk.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({
      scheduledWalks,
      completedWalks
    })
  } catch (error) {
    console.error('Errore nel caricamento del calendario:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST - Programma una nuova camminata
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
    }

    const { scheduledDate, time, notes } = await request.json()

    if (!scheduledDate) {
      return NextResponse.json({ error: 'Data richiesta' }, { status: 400 })
    }

    // Verifica se esiste già una camminata programmata per questa data
    const existingScheduled = await prisma.scheduledWalk.findUnique({
      where: {
        userId_scheduledDate: {
          userId: user.id,
          scheduledDate
        }
      }
    })

    if (existingScheduled) {
      return NextResponse.json({ error: 'Camminata già programmata per questa data' }, { status: 400 })
    }

    // Crea la camminata programmata
    const scheduledWalk = await prisma.scheduledWalk.create({
      data: {
        userId: user.id,
        scheduledDate,
        time: time || null,
        notes: notes || null
      }
    })

    return NextResponse.json(scheduledWalk)
  } catch (error) {
    console.error('Errore nella programmazione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

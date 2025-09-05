import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Solo per test - in produzione dovresti avere un sistema di ruoli
    const isAdmin = session.user?.email === 'admin@example.com' || 
                    session.user?.email === 'diego.taglioni@u-hopper.com'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
    }

    const walks = await prisma.walk.findMany({
      select: {
        id: true,
        duration: true,
        date: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 100 // Limita a 100 camminate più recenti
    })

    return NextResponse.json(walks)
  } catch (error) {
    console.error('Errore nel recupero camminate:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

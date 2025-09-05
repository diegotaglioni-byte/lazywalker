import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Rimuovi una camminata programmata
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Verifica che la camminata programmata appartenga all'utente
    const scheduledWalk = await prisma.scheduledWalk.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!scheduledWalk) {
      return NextResponse.json({ error: 'Camminata programmata non trovata' }, { status: 404 })
    }

    // Rimuovi la camminata programmata
    await prisma.scheduledWalk.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nella rimozione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

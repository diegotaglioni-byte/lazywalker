import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, nickname, dailyGoal } = await request.json()

    // Validazioni
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e password sono obbligatori' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La password deve essere di almeno 6 caratteri' },
        { status: 400 }
      )
    }

    // Controlla se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utente con questa email esiste già' },
        { status: 400 }
      )
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crea l'utente
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        nickname: nickname || name.split(' ')[0],
        dailyGoal: dailyGoal || 10,
      }
    })

    // Invia email di verifica
    try {
      await sendVerificationEmail(email, name)
    } catch (emailError) {
      console.error('Errore invio email:', emailError)
      // Non blocchiamo la registrazione se l'email fallisce
    }

    return NextResponse.json(
      { 
        message: 'Utente creato con successo',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Errore registrazione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

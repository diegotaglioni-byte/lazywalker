import nodemailer from 'nodemailer'

// Configurazione del transporter per Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false, // true per 465, false per altri porti
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD, // App password di Gmail
  },
})

export async function sendVerificationEmail(email: string, name: string) {
  try {
    // Se le credenziali email non sono configurate, salta l'invio
    if (!process.env.EMAIL_SERVER_USER || process.env.EMAIL_SERVER_USER === 'your-gmail@gmail.com') {
      console.log('📧 Email di verifica simulata per:', email)
      return
    }

    const verificationToken = generateVerificationToken()
    
    // Salva il token nel database (opzionale, per ora lo generiamo solo)
    // In una versione completa, salveresti questo token nel database con scadenza

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Benvenuto in LazyWalker! 🚶‍♀️ Verifica il tuo account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin: 0;">LazyWalker</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0;">Japanese Walking Timer</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0;">Ciao ${name}! 👋</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Benvenuto in LazyWalker! Il tuo account è stato creato con successo.
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Ora puoi iniziare la tua camminata giapponese e tracciare i tuoi progressi ogni giorno.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/auth/signin" 
                 style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Inizia la tua camminata 🚶‍♀️
              </a>
            </div>
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">💡 Consigli per iniziare:</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>Inizia con 5-10 minuti al giorno</li>
              <li>Mantieni un ritmo lento e costante</li>
              <li>Concentrati sul respiro e sul movimento</li>
              <li>Traccia i tuoi progressi per rimanere motivato</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>Se hai domande, rispondi a questa email!</p>
            <p style="margin: 10px 0 0 0;">
              <strong>LazyWalker Team</strong><br>
              Fai movimento leggero ogni giorno 🌱
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Email di verifica inviata a:', email)
    
  } catch (error) {
    console.error('Errore invio email di verifica:', error)
    throw error
  }
}

export async function sendKudosEmail(email: string, name: string, kudosTitle: string, kudosDescription: string) {
  try {
    // Se le credenziali email non sono configurate, salta l'invio
    if (!process.env.EMAIL_SERVER_USER || process.env.EMAIL_SERVER_USER === 'your-gmail@gmail.com') {
      console.log('🏆 Email kudos simulata per:', email, '-', kudosTitle)
      return
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `🎉 Kudos! Hai raggiunto: ${kudosTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin: 0;">LazyWalker</h1>
            <p style="color: #666; font-size: 16px; margin: 5px 0;">Japanese Walking Timer</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">🏆</div>
            <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 24px;">Complimenti ${name}!</h2>
            <h3 style="color: #b45309; margin: 0 0 15px 0; font-size: 20px;">${kudosTitle}</h3>
            <p style="color: #a16207; line-height: 1.6; margin: 0;">
              ${kudosDescription}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/" 
               style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Continua la tua camminata 🚶‍♀️
            </a>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>Continua così! Ogni passo conta! 🌱</p>
            <p style="margin: 10px 0 0 0;">
              <strong>LazyWalker Team</strong>
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Email kudos inviata a:', email)
    
  } catch (error) {
    console.error('Errore invio email kudos:', error)
    throw error
  }
}

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

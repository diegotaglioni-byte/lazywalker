# 🚀 Setup LazyWalker con Autenticazione

## 📋 Prerequisiti

1. **Node.js** (versione 18 o superiore)
2. **PostgreSQL** (locale o cloud)
3. **Account Gmail** per invio email
4. **Account Google** per OAuth
5. **Account Facebook** per OAuth

## 🛠️ Configurazione

### 1. Variabili d'Ambiente

Crea un file `.env` nella root del progetto con:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lazywalker?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Email Configuration (Gmail)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-gmail@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-gmail@gmail.com"
```

### 2. Setup Database

```bash
# Genera il client Prisma
npm run db:generate

# Crea e applica le migrazioni
npm run db:migrate

# (Opzionale) Apri Prisma Studio per vedere i dati
npm run db:studio
```

### 3. Setup OAuth Providers

#### Google OAuth
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita l'API Google+ 
4. Crea credenziali OAuth 2.0
5. Aggiungi `http://localhost:3000/api/auth/callback/google` agli URI di redirect
6. Copia Client ID e Client Secret nel file `.env`

#### Facebook OAuth
1. Vai su [Facebook Developers](https://developers.facebook.com/)
2. Crea una nuova app
3. Aggiungi il prodotto "Facebook Login"
4. Configura gli URI di redirect: `http://localhost:3000/api/auth/callback/facebook`
5. Copia App ID e App Secret nel file `.env`

### 4. Setup Email (Gmail)

1. Abilita l'autenticazione a 2 fattori su Gmail
2. Genera una "App Password" per l'applicazione
3. Usa questa password nel campo `EMAIL_SERVER_PASSWORD`

## 🚀 Avvio

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:3000`

## 📱 Test delle Funzionalità

### 1. Registrazione
- Vai su `/auth/signup`
- Crea un account con email/password
- Controlla la casella email per la conferma

### 2. Social Login
- Testa il login con Google
- Testa il login con Facebook

### 3. Timer e Dati
- Fai una camminata con il timer
- Verifica che i dati vengano salvati nel database
- Controlla badge e kudos

## 🗄️ Struttura Database

### Tabelle Principali
- **User**: Dati utente (nome, email, obiettivi)
- **Walk**: Camminate completate
- **Kudos**: Riconoscimenti ottenuti
- **UserBadge**: Badge sbloccati
- **Account/Session**: Gestione autenticazione NextAuth

## 🔧 Comandi Utili

```bash
# Reset database (ATTENZIONE: cancella tutti i dati)
npx prisma migrate reset

# Visualizza il database
npm run db:studio

# Genera nuovo client Prisma dopo modifiche schema
npm run db:generate

# Deploy migrazioni in produzione
npx prisma migrate deploy
```

## 🚀 Deploy su Vercel

1. **Database**: Usa un servizio come [Neon](https://neon.tech/) o [Supabase](https://supabase.com/)
2. **Variabili d'ambiente**: Configura tutte le variabili in Vercel
3. **Deploy**: Connetti il repository GitHub a Vercel

### Variabili Vercel
- `DATABASE_URL`: URL del database PostgreSQL
- `NEXTAUTH_URL`: URL del tuo dominio
- `NEXTAUTH_SECRET`: Chiave segreta per JWT
- Tutte le altre variabili OAuth e email

## 🐛 Troubleshooting

### Database non si connette
- Verifica che PostgreSQL sia in esecuzione
- Controlla l'URL del database
- Assicurati che il database esista

### OAuth non funziona
- Verifica Client ID e Secret
- Controlla gli URI di redirect
- Assicurati che l'app sia pubblicata (per Facebook)

### Email non vengono inviate
- Verifica le credenziali Gmail
- Usa App Password, non la password normale
- Controlla che l'autenticazione a 2 fattori sia abilitata

## 📞 Supporto

Se hai problemi:
1. Controlla i log della console
2. Verifica le variabili d'ambiente
3. Controlla la connessione al database
4. Testa i provider OAuth singolarmente

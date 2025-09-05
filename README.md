# LazyWalker - Japanese Walking Timer PWA

Un'app PWA mobile-first per aiutare le persone pigre a fare movimento leggero con la tecnica **Japanese Walking**.

## 🚶‍♀️ Cos'è LazyWalker?

LazyWalker è un timer PWA che ti aiuta a iniziare a muoverti con la tecnica Japanese Walking - una camminata lenta e consapevole, perfetta per chi vuole iniziare senza sforzi eccessivi.

## ✨ Caratteristiche

- **🎯 Timer personalizzabile**: 3, 5, 8, 10 minuti
- **📱 PWA mobile-first**: Funziona offline e si installa come app nativa
- **👤 Sistema utenti**: Registrazione, login e profili personalizzati
- **🔐 Autenticazione multipla**: Email/password, Google, Facebook
- **📧 Verifica email**: Conferma account via email
- **🔥 Streak giornaliera**: Traccia i tuoi giorni consecutivi
- **🏆 Sistema badge**: Sblocca achievement per motivarti
- **🎉 Sistema kudos**: Riconoscimenti per obiettivi raggiunti
- **📊 Obiettivo giornaliero**: Imposta e raggiungi i tuoi target
- **💾 Database persistente**: Tutti i dati salvati in PostgreSQL
- **📈 Storico camminate**: Traccia tutte le tue sessioni
- **🔔 Notifiche**: Suono, vibrazione e email per kudos

## 🛠️ Stack Tecnologico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js** per autenticazione
- **Prisma** + **PostgreSQL** per database
- **Nodemailer** per email
- **PWA** (Service Worker + Manifest)
- **OAuth** (Google, Facebook)

## 🚀 Setup e Deploy

### Setup Locale

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd lazywalker
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   - Copia `.env.example` in `.env`
   - Configura database, OAuth e email (vedi [SETUP.md](./SETUP.md))

4. **Setup database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Avvia l'app**
   ```bash
   npm run dev
   ```

### Deploy su Vercel

1. **Database**: Usa [Neon](https://neon.tech/) o [Supabase](https://supabase.com/)
2. **OAuth**: Configura Google e Facebook OAuth
3. **Email**: Configura Gmail con App Password
4. **Deploy**: Connetti GitHub a Vercel

> 📖 **Guida completa**: Vedi [SETUP.md](./SETUP.md) per istruzioni dettagliate

## 📱 Test su Mobile

1. Apri l'URL dell'app sul tuo smartphone
2. Clicca "Aggiungi a Home" (iOS) o "Installa app" (Android)
3. L'app si comporterà come un'app nativa
4. Testa il timer, le notifiche e la persistenza dati

## 🏗️ Struttura del Progetto

```
lazywalker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principale con meta PWA
│   │   ├── page.tsx            # Home page
│   │   ├── onboarding/         # Setup iniziale
│   │   └── timer/              # Timer camminata
│   ├── components/
│   │   ├── Button.tsx          # Componente bottone riutilizzabile
│   │   ├── Card.tsx            # Card container
│   │   ├── ProgressBar.tsx     # Barra di progresso
│   │   └── Badge.tsx           # Sistema badge
│   └── lib/
│       ├── storage.ts          # Gestione localStorage
│       ├── useTimer.ts         # Hook timer personalizzato
│       ├── useStreak.ts        # Gestione streak e badge
│       └── date.ts             # Utility date
├── public/
│   ├── manifest.json           # Configurazione PWA
│   ├── sw.js                   # Service Worker
│   └── icons/                  # Icone PWA
└── README.md
```

## 🎯 Funzionalità Implementate

### ✅ Sistema Completo
- [x] **Autenticazione**: Registrazione, login, verifica email
- [x] **Social Login**: Google e Facebook OAuth
- [x] **Database**: PostgreSQL con Prisma ORM
- [x] **Timer**: Start/pause/resume/reset con salvataggio
- [x] **Profilo utente**: Nickname, obiettivi, statistiche
- [x] **Sistema badge**: Achievement per streak (3/7/14/30 giorni)
- [x] **Sistema kudos**: Riconoscimenti per obiettivi
- [x] **Email**: Invio automatico per kudos importanti
- [x] **Storico**: Traccia tutte le camminate
- [x] **PWA**: Installabile su mobile
- [x] **UI responsive**: Mobile-first design

### 🔮 Future Implementazioni
- [ ] Notifiche push per promemoria
- [ ] Statistiche avanzate e grafici
- [ ] Condivisione social dei risultati
- [ ] Temi personalizzabili
- [ ] Sincronizzazione multi-dispositivo
- [ ] Gamification avanzata
- [ ] Community e sfide

## 🎨 Personalizzazione

### Colori
Modifica `tailwind.config.ts` per cambiare i colori:
```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Colore principale
    600: '#0284c7', // Colore hover
  }
}
```

### Timer Options
Modifica `TIMER_OPTIONS` in `src/app/timer/page.tsx`:
```typescript
const TIMER_OPTIONS = [3, 5, 8, 10] // Aggiungi/rimuovi opzioni
```

### Badge
Aggiungi nuovi badge in `src/lib/useStreak.ts`:
```typescript
// Badge per 1 mese
if (streak >= 30 && !currentBadges.includes('one_month')) {
  addBadge('one_month')
}
```

## 🐛 Troubleshooting

### L'app non si installa
- Verifica che il manifest.json sia accessibile
- Controlla che il service worker sia registrato
- Assicurati di usare HTTPS (richiesto per PWA)

### Timer non funziona
- Controlla la console per errori JavaScript
- Verifica che il browser supporti le API moderne
- Prova a ricaricare la pagina

### Dati persi
- I dati sono salvati in localStorage
- Cancellare i dati del browser li rimuoverà
- Considera l'export/import per backup

## 📄 Licenza

MIT License - Usa liberamente per i tuoi progetti!

## 🤝 Contributi

I contributi sono benvenuti! Apri una issue o fai una pull request.

---

**Fatto con ❤️ per aiutare le persone pigre a muoversi di più!** 🚶‍♀️

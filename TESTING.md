# 🧪 Guida al Testing di LazyWalker

## 📋 Checklist di Test Completo

### ✅ **Setup Iniziale**
- [ ] Server di sviluppo avviato (`npm run dev`)
- [ ] Database SQLite configurato (`npm run db:push`)
- [ ] Prisma Studio avviato (`npm run db:studio`)
- [ ] Variabili d'ambiente configurate (`.env`)

### 🔐 **Test Autenticazione**

#### **Registrazione Email/Password**
- [ ] Vai su `http://localhost:3000/auth/signup`
- [ ] Compila il form con dati validi
- [ ] Verifica che la registrazione funzioni
- [ ] Controlla che l'email di verifica sia simulata (console)
- [ ] Verifica il redirect automatico alla home

#### **Login Email/Password**
- [ ] Vai su `http://localhost:3000/auth/signin`
- [ ] Inserisci credenziali valide
- [ ] Verifica il login e redirect alla home
- [ ] Testa credenziali errate (dovrebbe mostrare errore)

#### **Social Login (Opzionale)**
- [ ] Configura credenziali Google OAuth
- [ ] Configura credenziali Facebook OAuth
- [ ] Testa login con Google
- [ ] Testa login con Facebook
- [ ] Verifica che i dati vengano salvati nel database

### 🏠 **Test Dashboard Home**

#### **Visualizzazione Dati**
- [ ] Verifica che il nome/nickname sia mostrato
- [ ] Controlla che lo streak sia visualizzato
- [ ] Verifica il progresso giornaliero (0 min inizialmente)
- [ ] Controlla che l'obiettivo giornaliero sia mostrato
- [ ] Verifica che i badge siano mostrati (vuoto inizialmente)
- [ ] Controlla che i kudos siano mostrati (vuoto inizialmente)

#### **Navigazione**
- [ ] Testa il pulsante "Inizia camminata"
- [ ] Testa il pulsante "Profilo"
- [ ] Testa il pulsante "Logout"
- [ ] Verifica i link di development (solo in dev mode)

### ⏱️ **Test Timer**

#### **Funzionalità Base**
- [ ] Vai su `http://localhost:3000/timer`
- [ ] Seleziona una durata (5, 10, 15, 20 min)
- [ ] Avvia il timer
- [ ] Verifica che il countdown funzioni
- [ ] Testa il pulsante "Pausa"
- [ ] Testa il pulsante "Riprendi"
- [ ] Testa il pulsante "Stop"

#### **Completamento Camminata**
- [ ] Completa una camminata
- [ ] Verifica che i dati vengano salvati nel database
- [ ] Controlla che lo streak si aggiorni
- [ ] Verifica che i badge vengano assegnati
- [ ] Controlla che i kudos vengano generati
- [ ] Verifica il redirect alla home

### 👤 **Test Profilo**

#### **Visualizzazione**
- [ ] Vai su `http://localhost:3000/profile`
- [ ] Verifica che tutte le informazioni siano mostrate
- [ ] Controlla le statistiche (streak, camminate, minuti)
- [ ] Verifica i badge ottenuti
- [ ] Controlla i kudos ricevuti

#### **Modifica Obiettivo**
- [ ] Clicca "Modifica" sull'obiettivo giornaliero
- [ ] Cambia l'obiettivo
- [ ] Salva le modifiche
- [ ] Verifica che l'obiettivo sia aggiornato

### 🧪 **Test Page**

#### **Test Automatici**
- [ ] Vai su `http://localhost:3000/test`
- [ ] Clicca "Esegui Test Completi"
- [ ] Verifica che tutti i test passino
- [ ] Controlla i risultati nella console
- [ ] Testa "Aggiungi Camminata (10 min)"

### 🔧 **Admin Panel**

#### **Accesso**
- [ ] Vai su `http://localhost:3000/admin`
- [ ] Verifica che solo gli admin possano accedere
- [ ] Controlla le statistiche generali
- [ ] Verifica la tabella utenti
- [ ] Controlla la tabella camminate

### 🗄️ **Test Database**

#### **Prisma Studio**
- [ ] Apri `http://localhost:5555`
- [ ] Verifica la tabella `User`
- [ ] Controlla la tabella `Walk`
- [ ] Verifica la tabella `Kudos`
- [ ] Controlla la tabella `UserBadge`

#### **Integrità Dati**
- [ ] Verifica che i dati utente siano corretti
- [ ] Controlla che le camminate siano salvate
- [ ] Verifica le relazioni tra tabelle
- [ ] Controlla che i timestamp siano corretti

### 🧹 **Test Cache Management**

#### **Pulizia Automatica**
- [ ] Chiudi il tab del browser
- [ ] Riapri l'app
- [ ] Verifica che la cache sia stata pulita
- [ ] Controlla la console per i log di pulizia

#### **Pulizia Manuale**
- [ ] Clicca il pulsante "🧹 Cache" (solo in dev)
- [ ] Verifica che la cache sia pulita
- [ ] Controlla il reload automatico

### 📱 **Test PWA**

#### **Installazione**
- [ ] Apri l'app su mobile
- [ ] Verifica che l'installazione PWA sia disponibile
- [ ] Installa l'app
- [ ] Testa l'app offline

#### **Funzionalità Offline**
- [ ] Disconnetti internet
- [ ] Verifica che l'app funzioni
- [ ] Testa le funzionalità base
- [ ] Riconnetti e verifica la sincronizzazione

## 🐛 **Test di Errori**

### **Errori di Connessione**
- [ ] Simula errori di rete
- [ ] Verifica i messaggi di errore
- [ ] Controlla il fallback offline

### **Errori di Validazione**
- [ ] Testa email non valide
- [ ] Testa password troppo corte
- [ ] Verifica la validazione lato client

### **Errori di Database**
- [ ] Simula errori di connessione DB
- [ ] Verifica i messaggi di errore
- [ ] Controlla il rollback delle transazioni

## 📊 **Metriche di Performance**

### **Tempi di Caricamento**
- [ ] Home page: < 2 secondi
- [ ] Timer page: < 1 secondo
- [ ] Profilo: < 1.5 secondi
- [ ] Login/Registrazione: < 2 secondi

### **Responsività**
- [ ] Test su desktop (1920x1080)
- [ ] Test su tablet (768x1024)
- [ ] Test su mobile (375x667)
- [ ] Verifica che l'UI si adatti

## 🎯 **Test di Usabilità**

### **Flusso Utente**
- [ ] Registrazione → Login → Dashboard → Timer → Profilo
- [ ] Verifica che il flusso sia intuitivo
- [ ] Controlla che i feedback siano chiari
- [ ] Verifica che gli errori siano gestiti bene

### **Accessibilità**
- [ ] Testa con screen reader
- [ ] Verifica il contrasto dei colori
- [ ] Controlla la navigazione da tastiera
- [ ] Testa con zoom al 200%

## ✅ **Criteri di Accettazione**

L'app è pronta per il deployment quando:

- [ ] Tutti i test di autenticazione passano
- [ ] Il timer funziona correttamente
- [ ] I dati vengono salvati nel database
- [ ] I badge e kudos vengono assegnati
- [ ] La PWA funziona offline
- [ ] L'admin panel è accessibile
- [ ] Non ci sono errori nella console
- [ ] Le performance sono accettabili
- [ ] L'UI è responsive

## 🚀 **Prossimi Passi**

Dopo aver completato tutti i test:

1. **Fixare eventuali bug** trovati durante il testing
2. **Ottimizzare le performance** se necessario
3. **Preparare il deployment** su Vercel
4. **Configurare le variabili d'ambiente** di produzione
5. **Testare in produzione** dopo il deploy

---

**Buon testing!** 🧪✨

# AI Chat - Mira

<img width="1920" height="831" alt="Screenshot 2025-12-05 183103" src="https://github.com/user-attachments/assets/f19250a6-6d68-4cd4-9c57-79dd9186bd20" />


Benvenuti in AI Chat - Mira, il vostro assistente psicologo virtuale. Questo progetto è una moderna applicazione di chat basata su Next.js che consente agli utenti di interagire con un'intelligenza artificiale con la personalità di uno psicologo esperto.

## Caratteristiche

- **Interfaccia Utente Intuitiva:** Un'interfaccia di chat pulita e reattiva costruita con React e Tailwind CSS.
- **Assistente AI Personalizzato:** Interagisce con Mira, un assistente AI configurato per comportarsi come uno psicologo con oltre 20 anni di esperienza, offrendo un tono pacato e dolce.
- **Scroll Automatico della Chat:** La chatbox scorre automaticamente per mostrare sempre l'ultimo messaggio.
- **Visualizzazione Intelligente dell'Ora:** I timestamp dei messaggi vengono visualizzati in modo intuitivo (Oggi, Ieri, Nome del giorno, Data completa).
- **Gestione dello Stato UI:** L'intestazione della chat mostra lo stato dell'AI (es. "Online", "Sta scrivendo...").
- **API Route Sicura:** Utilizza una Next.js API Route per interagire con l'API di Gemini in modo sicuro, mantenendo la chiave API lato server.
- **Gestione degli Errori:** Gestione di base degli errori per le chiamate API, inclusi messaggi specifici per "troppe richieste".

## Tecnologie Utilizzate

- **Next.js:** Framework React per applicazioni web, con supporto per Server-Side Rendering (SSR) e API Routes.
- **React:** Libreria JavaScript per la costruzione di interfacce utente.
- **TypeScript:** Linguaggio tipizzato per una maggiore robustezza del codice.
- **Tailwind CSS:** Framework CSS utility-first per uno styling rapido e personalizzabile.
- **Google Gemini API:** L'intelligenza artificiale che alimenta le risposte di Mira.
- **React Icons:** Libreria di icone per React.

## Configurazione del Progetto

Segui questi passaggi per configurare ed eseguire il progetto localmente.

### Prerequisiti

Assicurati di avere installati Node.js e npm (o Yarn) sulla tua macchina.

- [Node.js (versione 18 o superiore)](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (solitamente viene installato con Node.js)

### Passaggi

1.  **Clona il repository:**

    git clone [URL_DEL_TUO_REPOSITORY]
    cd ai-chat 2. **Installa le dipendenze:**

    npm install

    # oppure

    yarn install 3. **Configura la chiave API di Gemini:**

    Crea un file `.env.local` nella directory radice del progetto e aggiungi la tua chiave API di Google Gemini:

    Puoi ottenere una chiave API Gemini dal [Google AI Studio](https://aistudio.google.com/).

2.  **Avvia il server di sviluppo:**

    npm run dev

    # oppure

    yarn dev L'applicazione sarà disponibile su `http://localhost:3000`.

## Struttura del Progetto

```
├── public/                    # File statici (favicon, immagini)
│   └── favicon.svg
├── src/
│   ├── app/                   # Root del routing di Next.js
│   │   ├── api/               # API Routes
│   │   │   └── route.ts       # Endpoint per l'interazione con Gemini API
│   │   ├── assets/            # Immagini e altre risorse
│   │   │   └── ai-logo.png
│   │   ├── components/        # Componenti React riutilizzabili
│   │   │   ├── ChatBox.tsx    # Componente principale della chat
│   │   │   ├── ClientLayout.tsx # Layout lato client, include Header e Footer
│   │   │   ├── Footer.tsx     # Footer con campo input e pulsante invia
│   │   │   └── Header.tsx     # Header della chat con logo e stato AI
│   │   ├── globals.css        # Stili CSS globali (importa Tailwind)
│   │   ├── layout.tsx         # Layout principale (HTML, metadati, CSS globale)
│   │   └── page.tsx           # Componente della pagina principale (mostra ChatBox)
│   └── ... altri file ...
├── .env.local                 # Variabili d'ambiente (non committate su Git)
├── next.config.mjs            # Configurazione di Next.js
├── package.json               # Dipendenze e script del progetto
├── postcss.config.mjs         # Configurazione PostCSS (per Tailwind)
├── tailwind.config.ts         # Configurazione di Tailwind CSS
└── tsconfig.json              # Configurazione TypeScript
```

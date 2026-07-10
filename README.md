# Ollama + Obsidian Local

Chat Chrome MV3 locale: il popup chiama Ollama, mentre il bridge gestisce esclusivamente note e conversazioni Obsidian. Nessun dato cloud.

## Avvio

1. Richiede Node 20+ e Ollama in esecuzione (`ollama serve`), più un modello, ad esempio `ollama pull gemma3`.
2. Da questa directory: `npm install`, poi `npm run build`.
3. Configura manualmente `bridge/bridge-data.json` con `vaultPath` assoluto; avvia `npm run dev -w bridge`. Al primo avvio il token appare una sola volta e viene salvato con permessi utente.
4. Apri `chrome://extensions`, attiva Developer mode, **Load unpacked** e seleziona `extension/` (i file JS sono generati in `extension/dist`; per MVP copia `dist/*.js` in `extension/` oppure usa un bundler di packaging).
5. Dopo il caricamento copia l'ID estensione: configura `extensionOrigin` in `bridge-data.json` come `chrome-extension://<ID>`, riavvia il bridge, poi inserisci token e URL nelle Impostazioni.

## API bridge

Tutte le richieste richiedono `Authorization: Bearer <token>`. `GET /health` restituisce stato vault; `GET /notes` restituisce percorsi Markdown; `POST /notes/read` accetta `{paths}` (massimo 10, 50.000 caratteri); `POST /conversations` salva prompt, risposta, modello e contesto. L'endpoint locale `/admin/config` è autenticato ed è opzionale: la configurazione diretta del file è più semplice e sicura per il bootstrap.

## Test manuale

- Testo: invia una domanda con streaming on/off.
- Immagine: scegli PNG/JPEG/WebP e un modello della lista vision configurata.
- Note: imposta vault, apri Contesto note, seleziona note e invia.
- Salvataggio: premi Salva nel vault e verifica `AI Chats`.
- Errori: arresta Ollama, usa token errato, o seleziona una nota inesistente.

## Limiti

Il packaging dell'estensione richiede di copiare i JS compilati accanto agli HTML (un bundler è il miglioramento successivo). La classificazione vision è volutamente configurabile perché `/api/tags` non garantisce metadati uniformi; CORS consente temporaneamente qualunque origin `chrome-extension://` finché non si imposta l'origin esatto.

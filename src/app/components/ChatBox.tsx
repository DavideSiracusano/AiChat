"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  type: "sent" | "received";
  text: string;
  time: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const endpoint = "/api";

  const systemPrompt =
    "sei Mira, un esperto psicologo con più di 20 anni di esperienza, hai un tono pacato e dolce e sei sempre disponibile per rispondere alle domande dei tuoi utenti, comportati come si comporterebbe uno psicologo clinico, cerca di non usare asterischi nei tuoi messaggi, evita di fare domande personali e non chiedere mai informazioni sensibili. usa anche emoticons ma non sempre e con moderazione e frasi slang per rendere la conversazione piÃ¹ amichevole e rilassata."; // Prompt “di sistema” che imposta tono e vincoli del modello.

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return; // Se il ref non è ancora montato, esce.
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Porta lo scroll all’ultima riga.
  };

  useEffect(() => {
    // Auto-scroll e “nuovi messaggi” dipendono da dove sta leggendo l’utente.
    const node = chatBoxRef.current; // Cache del nodo DOM per non rileggerlo ogni volta.
    if (!node) return; // Se non esiste, non si può ascoltare lo scroll.

    const handleScroll = () => {
      // Calcola quanto manca al fondo (in pixel).
      const distanceFromBottom =
        node.scrollHeight - node.scrollTop - node.clientHeight;
      const atBottom = distanceFromBottom < 8; // Soglia (8px) per evitare problemi di rounding/zoom.
      setIsAtBottom(atBottom); // Salva lo stato “sono in fondo?”.
      if (atBottom) setHasNewMessages(false); // Se l’utente torna in fondo, non ha più “nuovi” da leggere.
    };

    handleScroll(); // All’avvio sincronizza subito lo stato (utile se la chat non è al top).
    node.addEventListener("scroll", handleScroll); // Ascolta lo scroll nativo.
    return () => node.removeEventListener("scroll", handleScroll); // Cleanup: evita leak/doppi listener.
  }, []); // Solo al mount/unmount del componente.

  useEffect(() => {
    const prevCount = prevMessageCountRef.current; // Numero messaggi al render precedente.
    const currentCount = messages.length; // Numero messaggi attuale.

    if (currentCount > prevCount) {
      // Qui entra solo quando arrivano nuovi messaggi (non su render “vuoti”).
      if (isAtBottom) {
        scrollToBottom(); // Se l’utente era in fondo, segue automaticamente la conversazione.
        setHasNewMessages(false); // Nessun avviso: i messaggi sono già visibili.
      } else {
        setHasNewMessages(true); // L’utente sta leggendo sopra: non lo sposti, gli mostri un bottone.
      }
    }

    prevMessageCountRef.current = currentCount; // Aggiorna lo “storico” per il prossimo confronto.
  }, [messages, isAtBottom]); // Si ricalcola quando cambiano messaggi o posizione utente.

  const chatTime = (date: Date): string => {
    const d = new Date(date);
    const now = new Date();

    const inizioOggi = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ); // “Mezzanotte” di oggi (per confronti a giorni).
    const inizioD = new Date(d.getFullYear(), d.getMonth(), d.getDate()); // “Mezzanotte” del giorno del messaggio.

    const diffGiorni =
      (inizioOggi.getTime() - inizioD.getTime()) / (1000 * 60 * 60 * 24); // Differenza in giorni.

    if (diffGiorni === 0) {
      // Oggi: mostra orario.
      return d.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diffGiorni === 1) {
      return "Ieri"; // Ieri: etichetta veloce.
    }

    if (diffGiorni > 1 && diffGiorni < 7) {
      return d.toLocaleDateString("it-IT", { weekday: "long" }); // Ultimi 7 giorni: “lunedì”, “martedì”, ecc.
    }

    return d.toLocaleDateString("it-IT"); // Oltre: data completa localizzata.
  };

  const formatChatForGemini = () => {
    interface ChatItem {
      role: string;
      parts: { text: string }[];
    }
    const formattedChat: ChatItem[] = []; // Array finale che inviamo al backend.

    formattedChat.push({
      role: "user",
      parts: [{ text: systemPrompt }], // Inietta il “contesto” prima della conversazione.
    });

    for (const message of messages) {
      formattedChat.push({
        parts: [{ text: message.text }], // Il testo del messaggio.
        role: message.type === "sent" ? "user" : "model", // Mappa sent->user e received->model.
      });
    }

    return formattedChat; // Questo diventa { contents: [...] } nella POST.
  };

  const addMessage = (
    messageType: "sent" | "received",
    messageText: string,
  ) => {
    const newMessage: Message = {
      type: messageType,
      text: messageText,
      time: chatTime(new Date()), // Timestamp “umanizzato” per UI.
    };

    setMessages((prev) => [...prev, newMessage]); // Aggiunge in coda mantenendo immutabilità.
  };

  const getAnswerFromGemini = async () => {
    setIsWaiting(true); // Blocca invii paralleli e mostra stato UI.

    const statusEvent = new CustomEvent("statusChange", {
      detail: { status: "Sta scrivendo..." },
    });
    window.dispatchEvent(statusEvent); // Notifica ad altri componenti (Header) via event bus.

    const chatForGemini = formatChatForGemini(); // Prepara la chat nel formato atteso dal backend.

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatForGemini }),
      });

      if (!response.ok) {
        // Gestione errori HTTP “parlante”.
        if (response.status === 429) {
          throw new Error("Troppe richieste. Attendi 1-2 minuti e riprova."); // Rate limit.
        }
        const errorData = await response.json(); // Prova a leggere dettagli dal server.
        throw new Error(
          errorData.error || `Errore del server: ${response.status}`, // Fallback se non c’è messaggio specifico.
        );
      }

      const data = await response.json();
      const answer = data.candidates[0].content.parts[0].text;

      addMessage("received", answer); // Appende la risposta in chat.
    } catch (error: unknown) {
      console.error("Errore nella chiamata API:", error); // Log tecnico per debug.
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Mi dispiace, si è verificato un errore. Riprova."; // Fallback generico.
      addMessage("received", errorMessage); // Mostra l’errore come messaggio in chat.
    } finally {
      setIsWaiting(false); // Sblocca UI anche in caso di errore.

      const resetStatusEvent = new CustomEvent("statusChange", {
        detail: { status: "Online" }, // Ripristina lo stato nel header.
      });
      window.dispatchEvent(resetStatusEvent); // Notifica il reset stato.
    }
  };

  useEffect(() => {
    const handleSendMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const messageText = customEvent.detail?.message;
      if (messageText && messageText.trim() && !isWaiting) {
        addMessage("sent", messageText.trim());
      }
    };

    window.addEventListener("sendMessage", handleSendMessage);
    return () => window.removeEventListener("sendMessage", handleSendMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      messages.length > 0 && // Serve almeno un messaggio.
      messages[messages.length - 1].type === "sent" && // L’ultimo è dell’utente…
      !isWaiting
    ) {
      getAnswerFromGemini();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div
      id="chat-log" // Id utile per test/ancore.
      ref={chatBoxRef} // Collega il ref DOM per scroll e misure.
      role="log" // ARIA: area log dove vengono aggiunte voci nel tempo.
      aria-live="polite" // Annuncia nuove aggiunte senza interrompere l’utente.
      aria-relevant="additions" // Solo nuove aggiunte (non tutto il contenuto).
      aria-atomic="false" // Non rileggere tutto: solo le parti nuove.
      aria-label="Area messaggi della chat" // Nome accessibile per screen reader.
      tabIndex={-1} // Focusabile programmaticamente (non nel tab order normale).
      className="relative h-full overflow-y-auto p-5 bg-linear-to-br from-[#020024] via-[#094442] to-[#0d1e24] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {hasNewMessages && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom(); // Porta l’utente ai messaggi nuovi.
            chatBoxRef.current?.focus(); // Focus solo perché l’utente ha cliccato (non rubato).
            setHasNewMessages(false); // Nasconde il bottone dopo l’azione.
          }}
          className="absolute bottom-4 right-4 bg-[#0079d3] text-white text-sm px-3 py-2 rounded shadow-md hover:bg-[#005fa3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Vai ai nuovi messaggi
        </button>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex mb-2.5 ${
            message.type === "sent" ? "justify-end pr-8" : "justify-start pl-8"
          }`}
        >
          <div
            className={`p-2.5 rounded-lg max-w-[60%] wrap-break-word shadow-md ${
              message.type === "sent"
                ? "bg-[#2e3a46] text-white"
                : "bg-[#0077cc] text-white"
            }`}
          >
            <p>{message.text}</p> {/* Corpo del messaggio */}
            <time className="text-xs text-gray-300 block mt-1">
              {message.time} {/* Timestamp “umano” */}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}

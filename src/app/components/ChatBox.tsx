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
  const [hasNewMessages, setHasNewMessages] = useState(false); // Avviso senza rubare il focus.
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const endpoint = "/api";

  const systemPrompt =
    "sei Mira, un esperto psicologo con piÃ¹ di 20 anni di esperienza, hai un tono pacato e dolce e sei sempre disponibile per rispondere alle domande dei tuoi utenti, comportati come si comporterebbe uno psicologo clinico, cerca di non usare asterischi nei tuoi messaggi, evita di fare domande personali e non chiedere mai informazioni sensibili. usa anche emoticons ma non sempre e con moderazione e frasi slang per rendere la conversazione piÃ¹ amichevole e rilassata.";

  const scrollToBottom = () => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  };

  useEffect(() => { // Auto-scroll solo se l'utente è già in fondo.
    const node = chatBoxRef.current;
    if (!node) return;

    const handleScroll = () => {
      const distanceFromBottom =
        node.scrollHeight - node.scrollTop - node.clientHeight;
      const atBottom = distanceFromBottom < 8;
      setIsAtBottom(atBottom);
      if (atBottom) setHasNewMessages(false);
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const prevCount = prevMessageCountRef.current;
    const currentCount = messages.length;

    if (currentCount > prevCount) {
      if (isAtBottom) {
        scrollToBottom();
        setHasNewMessages(false);
      } else {
        setHasNewMessages(true);
      }
    }

    prevMessageCountRef.current = currentCount;
  }, [messages, isAtBottom]);

  const chatTime = (date: Date): string => {
    const d = new Date(date);
    const now = new Date();

    const inizioOggi = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const inizioD = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffGiorni =
      (inizioOggi.getTime() - inizioD.getTime()) / (1000 * 60 * 60 * 24);

    if (diffGiorni === 0) {
      return d.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diffGiorni === 1) {
      return "Ieri";
    }

    if (diffGiorni > 1 && diffGiorni < 7) {
      return d.toLocaleDateString("it-IT", { weekday: "long" });
    }

    return d.toLocaleDateString("it-IT");
  };

  const formatChatForGemini = () => {
    interface ChatItem {
      role: string;
      parts: { text: string }[];
    }
    const formattedChat: ChatItem[] = [];

    formattedChat.push({
      role: "user",
      parts: [{ text: systemPrompt }],
    });

    for (const message of messages) {
      formattedChat.push({
        parts: [{ text: message.text }],
        role: message.type === "sent" ? "user" : "model",
      });
    }

    return formattedChat;
  };

  const addMessage = (
    messageType: "sent" | "received",
    messageText: string,
  ) => {
    const newMessage: Message = {
      type: messageType,
      text: messageText,
      time: chatTime(new Date()),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const getAnswerFromGemini = async () => {
    setIsWaiting(true);

    const statusEvent = new CustomEvent("statusChange", {
      detail: { status: "Sta scrivendo..." }, // Stato annunciato nel header.
    });
    window.dispatchEvent(statusEvent);

    const chatForGemini = formatChatForGemini();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatForGemini }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Troppe richieste. Attendi 1-2 minuti e riprova.");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Errore del server: ${response.status}`,
        );
      }

      const data = await response.json();
      const answer = data.candidates[0].content.parts[0].text;

      addMessage("received", answer);
    } catch (error: unknown) {
      console.error("Errore nella chiamata API:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Mi dispiace, si Ã¨ verificato un errore. Riprova.";
      addMessage("received", errorMessage);
    } finally {
      setIsWaiting(false);

      const resetStatusEvent = new CustomEvent("statusChange", {
        detail: { status: "Online" },
      });
      window.dispatchEvent(resetStatusEvent);
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
      messages.length > 0 &&
      messages[messages.length - 1].type === "sent" &&
      !isWaiting
    ) {
      getAnswerFromGemini();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div
      id="chat-log"
      ref={chatBoxRef}
      role="log" // Region log: messaggi aggiunti in coda.
      aria-live="polite" // Annuncio non invasivo.
      aria-relevant="additions" // Solo nuove aggiunte.
      aria-atomic="false"
      aria-label="Area messaggi della chat"
      tabIndex={-1} // Focusabile solo via azione esplicita.
      className="relative h-full overflow-y-auto p-5 bg-linear-to-br from-[#020024] via-[#094442] to-[#0d1e24] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {hasNewMessages && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom();
            chatBoxRef.current?.focus(); // Focus solo su azione dell'utente.
            setHasNewMessages(false);
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
            <p>{message.text}</p>
            <time className="text-xs text-gray-300 block mt-1">
              {message.time}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}

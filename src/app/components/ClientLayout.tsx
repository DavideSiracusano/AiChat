"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useRef, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); // Focus di ritorno dopo l'invio.

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return; // Evita invii vuoti.

    const event = new CustomEvent("sendMessage", {
      detail: { message: inputValue },
    });
    window.dispatchEvent(event);

    setInputValue("");
    inputRef.current?.focus(); // Riprende il focus dopo l'invio.
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1e24]">
      <a
        href="#chat-input" // Skip link verso il campo messaggio.
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Salta al campo messaggio
      </a>
      <Header />
      <main id="main-content" className="flex-1 overflow-hidden">
        {children}
      </main>
      <Footer
        inputRef={inputRef}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

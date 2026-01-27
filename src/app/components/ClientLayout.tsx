"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const event = new CustomEvent("sendMessage", {
      detail: { message: inputValue },
    });
    window.dispatchEvent(event);

    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Permette di dare il focus all'input messaggi quando
  // viene emesso l'evento "focusInput" (es. premendo TAB nella chat)
  useEffect(() => {
    const handleFocusInput = () => {
      inputRef.current?.focus();
    };

    window.addEventListener("focusInput", handleFocusInput);
    return () => window.removeEventListener("focusInput", handleFocusInput);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0d1e24]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
      >
        Salta al contenuto principale
      </a>
      <Header />
      <main id="main-content" role="main" className="flex-1 overflow-hidden">
        {children}
      </main>
      <Footer
        inputRef={inputRef}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
}

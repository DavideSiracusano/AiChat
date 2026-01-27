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

  useEffect(() => {
    const handleTabFromDocument = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const isBodyOrRoot =
        active === document.body || active === document.documentElement;

      if (event.key === "Tab" && isBodyOrRoot) {
        event.preventDefault();
        if (event.shiftKey) {
          const focusable = document.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
          );
          const lastFocusable = focusable[focusable.length - 1];
          lastFocusable?.focus();
          return;
        }

        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleTabFromDocument);
    return () => window.removeEventListener("keydown", handleTabFromDocument);
  }, []);

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

  return (
    <div className="flex flex-col h-screen bg-[#0d1e24]">
      <a
        href="#chat-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
      >
        Salta al campo messaggio
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

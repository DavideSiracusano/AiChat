"use client";

import "./globals.css";
import Header from "./components/Header";
import { useRef, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Dispatch custom event al ChatBox
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
    <html lang="it">
      <body className="flex flex-col h-screen bg-[#0d1e24]">
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
        <footer className="h-[70px] bg-[#2e3a46] text-white flex justify-center items-center gap-0 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Scrivi un messaggio"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="p-2.5 flex-1 mx-5 rounded-lg border-none shadow-md outline-none text-black"
            aria-label="Scrivi un messaggio"
          />
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-lg mr-5 bg-[#0077cc] text-white cursor-pointer shadow-md hover:bg-[#005fa3]"
            aria-label="Invia"
          >
            ✉️
          </button>
        </footer>
      </body>
    </html>
  );
}

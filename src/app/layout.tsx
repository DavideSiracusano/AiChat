"use client";

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
        <Footer
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </body>
    </html>
  );
}

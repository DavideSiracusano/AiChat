"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useRef, useState } from "react";

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

  return (
    <div className="flex flex-col h-screen bg-[#0d1e24]">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
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

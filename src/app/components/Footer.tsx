"use client";

import { AiOutlineSend } from "react-icons/ai";

interface FooterProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Footer({
  inputRef,
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
}: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="h-[70px] bg-[#0d1e24] text-white flex justify-center items-center gap-0 shrink-0"
    >
      <input
        id="chat-input"
        ref={inputRef}
        type="text"
        placeholder="Scrivi un messaggio"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="p-2.5 flex-1 mx-5 rounded-lg border-none shadow-md text-white bg-[#2e3a46] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Scrivi un messaggio nella chat"
        aria-controls="chat-log"
      />
      <button
        type="button"
        onClick={handleSendMessage}
        className="p-2.5 rounded-lg mr-5 bg-[#0079d3] text-white cursor-pointer shadow-md hover:bg-[#005fa3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Invia messaggio in chat"
        aria-controls="chat-log"
      >
        <AiOutlineSend size={24} aria-hidden="true" />
      </button>
    </footer>
  );
}

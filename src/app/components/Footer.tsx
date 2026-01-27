"use client";

import { AiOutlineSend } from "react-icons/ai";

interface FooterProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
}

export default function Footer({
  inputRef,
  inputValue,
  setInputValue,
  handleSendMessage,
}: FooterProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage();
  };

  return (
    <footer className="h-[70px] bg-[#0d1e24] text-white flex justify-center items-center gap-0 shrink-0">
      <form
        className="flex w-full items-center"
        onSubmit={handleSubmit} // Invio nativo con Enter.
      >
        <label htmlFor="chat-input" className="sr-only">
          Scrivi un messaggio {/* Label stabile per SR. */}
        </label>
        <input
          id="chat-input" // Target dello skip link.
          ref={inputRef}
          type="text"
          placeholder="Scrivi un messaggio"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="p-2.5 flex-1 mx-5 rounded-lg border-none shadow-md text-white bg-[#2e3a46] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        />
        <button
          type="submit"
          className="p-2.5 rounded-lg mr-5 bg-[#0079d3] text-white cursor-pointer shadow-md hover:bg-[#005fa3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Invia messaggio in chat"
        >
          <AiOutlineSend size={24} aria-hidden="true" />
        </button>
      </form>
    </footer>
  );
}

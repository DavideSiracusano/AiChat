"use client";

import Image from "next/image";
import AILogo from "../assets/ai-logo.avif";
import { BsSearch, BsJournalMedical, BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function Header() {
  const [status, setStatus] = useState("Online 🟢");

  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setStatus(customEvent.detail?.status || "Online 🟢");
    };

    window.addEventListener("statusChange", handleStatusChange);
    return () => window.removeEventListener("statusChange", handleStatusChange);
  }, []);

  return (
    <header className="h-[70px] bg-[#2e3a46] text-white flex justify-between items-center px-5">
      <div className="flex gap-2.5 text-5xl cursor-pointer items-center">
        <Image src={AILogo} className="w-12 h-12 rounded-full" alt="avatar" />
        <div className="flex flex-col justify-center items-start ml-2.5">
          <h3 id="name" className="font-bold text-xl">
            Platone
          </h3>
          <p id="status" className="text-xs text-gray-400">
            {status}
          </p>
        </div>
      </div>

      <div className="flex gap-2.5 text-5xl cursor-pointer">
        <BsSearch />
        <BsJournalMedical />
        <BsThreeDots />
      </div>
    </header>
  );
}

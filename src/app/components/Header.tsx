"use client";

import Image from "next/image";
import AILogo from "../assets/ai-logo.png";
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
    <header className="h-[70px] bg-[#0d1e24] text-white flex justify-between items-center px-5">
      <div className="flex gap-2.5 text-5xl cursor-pointer items-center">
        <Image src={AILogo} className="w-20 h-12 rounded-full" alt="avatar" />
        <div className="flex flex-col justify-center items-start ml-2.5">
          <h3 id="name" className="font-bold text-xl">
            Mira
          </h3>
          <p id="status" className="text-xs text-gray-400">
            {status}
          </p>
        </div>
      </div>
    </header>
  );
}

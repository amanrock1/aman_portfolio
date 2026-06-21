"use client";
import React, { useEffect, useState } from "react";
import SocialMediaButtons from "../social/social-media-icons";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="flex w-full shrink-0 flex-col items-center justify-between gap-6 border-t border-border px-6 py-8 md:flex-row md:px-12 bg-slate-900/5 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center md:items-start gap-1">
        <p className="text-xs text-muted-foreground">
          Based in <span className="text-foreground font-medium">Bhopal, India</span>
        </p>
        <p className="text-[11px] font-mono text-zinc-500 tracking-wider">
          Local Time: {time || "00:00:00 AM"} (IST)
        </p>
      </div>

      <div className="flex items-center justify-center">
        <SocialMediaButtons />
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="/Aman_Kumar_Prabhat_Resume.pdf" 
          download="Aman_Kumar_Prabhat_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs border-zinc-700/50 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40">
            <Download className="w-3.5 h-3.5" />
            Download Resume
          </Button>
        </a>
      </div>
    </footer>
  );
}

export default Footer;

import React from "react";
import Link from "next/link";
import { footer } from "./config";
import { Button } from "../ui/button";
import SocialMediaButtons from "../social/social-media-icons";
import { config } from "@/data/config";

function Footer() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-4 border-t border-border px-4 py-8 md:px-6">
      <SocialMediaButtons />
    </footer>
  );
}

export default Footer;

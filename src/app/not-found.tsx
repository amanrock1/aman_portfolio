import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 text-center">
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-slate-800 dark:text-zinc-100 font-display select-none">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-xs md:text-sm rounded rotate-12 absolute font-semibold text-white">
        Page Not Found
      </div>
      <p className="mt-8 text-sm md:text-md text-slate-500 dark:text-zinc-400 font-light tracking-wide max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="mt-8">
        <span className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-white dark:bg-zinc-900 border border-current rounded-md hover:text-white hover:bg-[#FF6A3D] transition-colors duration-300">
            Go Home
          </span>
        </span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

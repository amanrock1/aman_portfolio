import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="press max-w-md p-8 text-center">
        <span className="stamp -rotate-2">404 · not shipped</span>
        <h1 className="mt-6 font-serif text-[40px] leading-tight text-ink">This page isn&apos;t in the log.</h1>
        <Link href="/" className="mt-6 inline-flex items-center gap-1 font-mono text-[13px] text-vermilion hover:underline">
          Back to the Ship Log <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

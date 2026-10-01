import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode } from "react"

export const SectionHeader = ({ id, title, desc, className }: { id: string, title: string | ReactNode, desc?: string, className?: string }) => {
  return (
    <div className={cn("mb-10", className)}>
      <Link href={`#${id}`}>
        <h2
          className={cn(
            "text-xl md:text-2xl font-medium tracking-tight",
            "text-zinc-100"
          )}
        >
          {title}
        </h2>
      </Link>
      {desc && (
        <p className="mt-2 max-w-2xl text-sm text-zinc-500 leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  )
}

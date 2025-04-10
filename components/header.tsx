import { CloudIcon } from "./cloud-icon"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-nord-3/50 backdrop-blur-md bg-nord-0/70">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <CloudIcon className="h-6 w-6 text-nord-8" />
          <span className="font-marker text-lg">VBU (Vercel Blob upload)</span>
        </Link>
        <nav className="flex items-center gap-4">{/* Navigation items can be added here */}</nav>
      </div>
    </header>
  )
}

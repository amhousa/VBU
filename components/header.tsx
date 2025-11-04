import { CloudIcon } from "./cloud-icon"
import Link from "next/link"

import { useView } from "./ui/view-provider"

export function Header() {
  const { mode, setMode } = useView()

  return (
    <header className="border-b border-nord-3/50 backdrop-blur-md bg-nord-0/70">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <CloudIcon className="h-6 w-6 text-nord-8" />
          <span className="font-marker text-lg">VBU (Vercel Blob upload)</span>
        </Link>
        <nav className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              className={`px-2 py-1 rounded ${mode === "grid" ? "bg-nord-2 text-nord-9" : "text-nord-6 hover:bg-nord-2/50"}`}
              onClick={() => setMode("grid")}
              aria-label="Grid view"
            >
              Grid
            </button>
            <button
              className={`px-2 py-1 rounded ${mode === "list" ? "bg-nord-2 text-nord-9" : "text-nord-6 hover:bg-nord-2/50"}`}
              onClick={() => setMode("list")}
              aria-label="List view"
            >
              List
            </button>
            <button
              className={`px-2 py-1 rounded ${mode === "compact" ? "bg-nord-2 text-nord-9" : "text-nord-6 hover:bg-nord-2/50"}`}
              onClick={() => setMode("compact")}
              aria-label="Compact view"
            >
              Compact
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

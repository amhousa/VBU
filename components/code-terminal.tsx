import { CopyButton } from "./copy-button"
import { cn } from "@/lib/utils"

interface CodeTerminalProps {
  title: string
  code: string
  language?: string
}

export function CodeTerminal({ title, code, language = "bash" }: CodeTerminalProps) {
  return (
    <div className="w-full rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground/70 select-none">{title}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <div className="relative group">
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground/50 font-mono">{language}</span>
        </div>
        <div className="p-4 font-mono text-sm overflow-x-auto bg-zinc-950 text-zinc-50 dark:bg-zinc-900/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <pre className="whitespace-pre-wrap break-all leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

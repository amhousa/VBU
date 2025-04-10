import { CopyButton } from "./copy-button"

interface CodeTerminalProps {
  title: string
  code: string
}

export function CodeTerminal({ title, code }: CodeTerminalProps) {
  return (
    <div className="w-full">
      <div className="terminal-header">
        <div className="terminal-dot bg-nord-11"></div>
        <div className="terminal-dot bg-nord-13"></div>
        <div className="terminal-dot bg-nord-14"></div>
        <div className="flex-1 text-center text-sm font-medium">{title}</div>
        <CopyButton text={code} />
      </div>
      <div className="terminal-body">
        <pre className="whitespace-pre-wrap break-all">{code}</pre>
      </div>
    </div>
  )
}

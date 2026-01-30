"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type ViewMode = "grid" | "list" | "compact"

const KEY = "vbu:view-mode"
const BG_KEY = "vbu:astronaut-bg"

const ViewContext = createContext<{
  mode: ViewMode
  setMode: (m: ViewMode) => void
  showAstronaut: boolean
  setShowAstronaut: (show: boolean) => void
}>({
  mode: "grid",
  setMode: () => {},
  showAstronaut: false,
  setShowAstronaut: () => {},
})

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("grid")
  const [showAstronaut, setShowAstronaut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(KEY)
      if (stored === "grid" || stored === "list" || stored === "compact") {
        setMode(stored)
      }
      
      const storedBg = localStorage.getItem(BG_KEY)
      if (storedBg === "true") {
        setShowAstronaut(true)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(KEY, mode)
        localStorage.setItem(BG_KEY, String(showAstronaut))
        
        if (showAstronaut) {
          document.body.classList.add('astronaut-bg')
        } else {
          document.body.classList.remove('astronaut-bg')
        }
      } catch {}
    }
  }, [mode, showAstronaut, mounted])

  return (
    <ViewContext.Provider value={{ mode, setMode, showAstronaut, setShowAstronaut }}>
      {children}
    </ViewContext.Provider>
  )
}

export function useView() {
  return useContext(ViewContext)
}

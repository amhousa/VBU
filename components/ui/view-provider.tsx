"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type ViewMode = "grid" | "list" | "compact"

const KEY = "vbu:view-mode"

const ViewContext = createContext<{
  mode: ViewMode
  setMode: (m: ViewMode) => void
}>({
  mode: "grid",
  setMode: () => {},
})

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored === "grid" || stored === "list" || stored === "compact") return stored
    } catch {
      // ignore
    }
    return "grid"
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, mode)
    } catch {}
  }, [mode])

  return <ViewContext.Provider value={{ mode, setMode }}>{children}</ViewContext.Provider>
}

export function useView() {
  return useContext(ViewContext)
}

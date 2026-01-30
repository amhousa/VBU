"use client"

import { CloudIcon } from "./cloud-icon"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, LayoutGrid, List, LayoutList, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useView } from "./ui/view-provider"
import { LoginPopup } from "./login-popup"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Header() {
  const { mode, setMode, showAstronaut, setShowAstronaut } = useView()
  const { setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <CloudIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-marker">
              VBU
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other controls could go here */}
          </div>
          <nav className="flex items-center gap-2">
            <div className="flex items-center border border-border/40 rounded-full p-1 bg-background/50 backdrop-blur-sm shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  mode === "grid" 
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setMode("grid")}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  mode === "list" 
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setMode("list")}
                title="List View"
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  mode === "compact" 
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setMode("compact")}
                title="Compact View"
              >
                <LayoutList className="h-4 w-4" />
                <span className="sr-only">Compact</span>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/50">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    <span className="text-sm">Space Mode</span>
                  </div>
                  <Switch 
                    checked={showAstronaut} 
                    onCheckedChange={setShowAstronaut}
                    className="scale-75 data-[state=checked]:bg-primary"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <LoginPopup />
          </nav>
        </div>
      </div>
    </header>
  )
}

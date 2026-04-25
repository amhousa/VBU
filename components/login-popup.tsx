"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginScreen } from "./login-screen"
import { User, LogOut, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("vbu_token")
    const userEmail = localStorage.getItem("vbu_email")
    if (token && userEmail) {
      setIsLoggedIn(true)
      setEmail(userEmail)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("vbu_token")
    localStorage.removeItem("vbu_email")
    setIsLoggedIn(false)
    setEmail(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    // Refresh the page to reload file list
    window.location.reload()
  }

  const handleLoginComplete = () => {
    const userEmail = localStorage.getItem("vbu_email")
    if (userEmail) {
      setEmail(userEmail)
      setIsLoggedIn(true)
    }
    setIsOpen(false)
  }

  if (isLoggedIn && email) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="rounded-full border-border/40 pl-1 pr-4 h-10 gap-3 hover:bg-accent/50 transition-all shadow-sm group"
          >
            <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground truncate max-w-[100px]">
              {email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-full border-border/40 pl-1 pr-4 h-10 gap-3 hover:bg-accent/50 transition-all shadow-sm group"
        >
          <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
        <LoginScreen onLogin={handleLoginComplete} />
      </DialogContent>
    </Dialog>
  )
}

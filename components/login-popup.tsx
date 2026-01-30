"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoginScreen } from "./login-screen"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false)

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
        <LoginScreen onLogin={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

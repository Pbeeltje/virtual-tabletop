"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface LoginFormProps {
  onLogin: (username: string, role: "DM" | "player") => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Sending login request:", { username, isTestLogin: false })
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isTestLogin: false }),
      })

      console.log("Login response:", response)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      onLogin(username, data.role)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}! You are logged in as a ${data.role}.`,
      })
    } catch (error) {
      console.error("Login error:", error)
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)))
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDMLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "DM_User", password: "dm_password", isTestLogin: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "DM Login failed")
      }

      onLogin("DM_User", "DM")
      toast({
        title: "DM Login",
        description: "Logged in as DM for testing.",
      })
    } catch (error) {
      console.error("DM Login error:", error)
      toast({
        title: "DM Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during DM login",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <Button type="button" onClick={handleDMLogin} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white">
        DM Login (Testing)
      </Button>
    </form>
  )
}


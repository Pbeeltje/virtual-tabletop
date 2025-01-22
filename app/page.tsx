"use client"

import { useState, useEffect } from "react"
import MainContent from "./components/MainContent"
import RightSideMenu from "./components/RightSideMenu"
import BottomBar from "./components/BottomBar"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "./types/user"
import { toast } from "@/components/ui/use-toast"

type MessageType = "user" | "system"

interface ChatMessage {
  type: MessageType
  content: string
  timestamp: string
  username: string
}

interface Character {
  CharacterId: number
  Name: string
  Description: string
  Path: string
  // Add other fields as needed
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [chatBackgroundColor, setChatBackgroundColor] = useState("bg-white")
  const [characters, setCharacters] = useState<Record<string, Character[]>>({
    Party: [],
    NPC: [],
    Monster: [],
  })

  const addMessage = (type: MessageType, content: string, username: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    setMessages((prevMessages) => [...prevMessages, { type, content, timestamp, username }])
  }

  const handleDiceRoll = (sides: number, result: number) => {
    addMessage("system", `${user?.username} rolled a d${sides}: <b>${result}</b>`, "System")
  }

  const handleLogin = async (username: string, role: "DM" | "player") => {
    setUser({ id: Date.now(), username, role })
    addMessage("system", `${username} has joined the game.`, "System")
    await fetchCharacters()
  }

  const handleRegister = async (username: string) => {
    setUser({ id: Date.now(), username, role: "player" }) // id is temporary, should be set by the server
    addMessage("system", `${username} has joined the game.`, "System")
    await fetchCharacters()
  }

  const fetchCharacters = async () => {
    try {
      const categories = ["Party", "NPC", "Monster"]
      const characterData: Record<string, Character[]> = {}
      for (const category of categories) {
        console.log(`Fetching characters for category: ${category}`)
        try {
          const response = await fetch(`/api/characters?category=${category}`, {
            credentials: "include",
          })

          console.log(`Response status for ${category}:`, response.status)
          console.log(`Response headers for ${category}:`, Object.fromEntries(response.headers.entries()))

          if (response.status === 401) {
            console.log("User is not authenticated, redirecting to login")
            setUser(null)
            return
          }

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`Error response for ${category}:`, errorText)
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
          }

          const data = await response.json()
          console.log(`Data received for ${category}:`, data)
          characterData[category] = data
        } catch (categoryError) {
          console.error(`Error fetching ${category} characters:`, categoryError)
          characterData[category] = []
        }
      }
      setCharacters(characterData)
    } catch (error) {
      console.error("Detailed error in fetchCharacters:", error)
      toast({
        title: "Error",
        description: `Failed to fetch characters: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
      setCharacters({
        Party: [],
        NPC: [],
        Monster: [],
      })
    }
  }

  // Instead of directly using getUserFromCookie, make an API call
useEffect(() => {
  const checkAuth = async () => {
    const response = await fetch('/api/user', {
      credentials: 'include',  // This sends cookies with the request
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      await fetchCharacters();
    }
  };

  checkAuth();
}, []);

  useEffect(() => {
    if (user) {
      fetchCharacters()
    }
  }, [user])

  const handleAddCharacter = async (category: string) => {
    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
      }
      const newCharacter = await response.json()
      setCharacters((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), newCharacter],
      }))
    } catch (error) {
      console.error("Error adding character:", error)
      toast({
        title: "Error",
        description: `Failed to add character: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleUpdateCharacter = async (updatedCharacter: Character) => {
    try {
      const response = await fetch(`/api/characters/${updatedCharacter.CharacterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCharacter),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
      }
      setCharacters((prev) => {
        const updatedCharacters = { ...prev }
        Object.keys(updatedCharacters).forEach((category) => {
          updatedCharacters[category] = updatedCharacters[category].map((c) =>
            c.CharacterId === updatedCharacter.CharacterId ? updatedCharacter : c,
          )
        })
        return updatedCharacters
      })
    } catch (error) {
      console.error("Error updating character:", error)
      toast({
        title: "Error",
        description: `Failed to update character: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCharacter = async (character: Character) => {
    try {
      const response = await fetch(`/api/characters/${character.CharacterId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
      }
      setCharacters((prev) => {
        const updatedCharacters = { ...prev }
        Object.keys(updatedCharacters).forEach((category) => {
          updatedCharacters[category] = updatedCharacters[category].filter(
            (c) => c.CharacterId !== character.CharacterId,
          )
        })
        return updatedCharacters
      })
    } catch (error) {
      console.error("Error deleting character:", error)
      toast({
        title: "Error",
        description: `Failed to delete character: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handlePhaseChange = (phase: string, color: string) => {
    setChatBackgroundColor(color)
    addMessage("system", `${phase}`, "System")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Virtual Tabletop</h1>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLogin={handleLogin} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onRegister={handleRegister} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-auto">
          <MainContent />
        </div>
        <RightSideMenu
          messages={messages}
          addMessage={addMessage}
          user={user.username}
          chatBackgroundColor={chatBackgroundColor}
          characters={characters}
          onAddCharacter={handleAddCharacter}
          onUpdateCharacter={handleUpdateCharacter}
          onDeleteCharacter={handleDeleteCharacter}
          onLogout={() => setUser(null)}
        />
      </div>
      <BottomBar onDiceRoll={handleDiceRoll} onPhaseChange={handlePhaseChange} />
    </div>
  )
}


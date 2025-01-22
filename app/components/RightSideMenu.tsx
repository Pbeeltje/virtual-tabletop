'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area" // Removed ScrollArea import
import { X } from 'lucide-react'
import CharacterList from './CharacterList'
import { toast } from "@/components/ui/use-toast"

type MessageType = 'user' | 'system'

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

interface RightSideMenuProps {
  messages: ChatMessage[]
  addMessage: (type: MessageType, content: string, username: string) => void
  user: string
  chatBackgroundColor: string
  characters: Record<string, Character[]>
  onAddCharacter: (category: string) => void
  onUpdateCharacter: (updatedCharacter: Character) => void
  onDeleteCharacter: (character: Character) => void
  onLogout: () => void
}

export default function RightSideMenu({ 
  messages, 
  addMessage, 
  user,
  chatBackgroundColor,
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onLogout
}: RightSideMenuProps) {
  const [inputMessage, setInputMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<'chat' | 'characters'>('chat')

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage('user', inputMessage, user)
      setInputMessage('')
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        onLogout()
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-64 flex flex-col bg-gray-100 border-l">
      <nav className="p-4 border-b">
        <ul className="space-y-2">
          <li>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0"
              onClick={() => setActiveSection(activeSection === 'characters' ? 'chat' : 'characters')}
            >
              {activeSection === 'characters' ? 'Chat' : 'Characters'}
            </Button>
          </li>
          <li><Link href="#" className="text-blue-600 hover:underline">Maps</Link></li>
          <li><Link href="#" className="text-blue-600 hover:underline">Settings</Link></li>
          <li>
            <Button
              variant="link"
              className="text-blue-600 hover:underline p-0"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </li>
        </ul>
      </nav>
      <div className="flex-grow flex flex-col overflow-hidden">
        {activeSection === 'chat' ? (
          <>
            <h2 className="text-lg font-semibold p-4 pb-2">Chat</h2>
            <div 
              ref={chatContainerRef}
              className={`flex-grow px-4 ${chatBackgroundColor} overflow-y-auto`}
            >
              <div className="space-y-2 pb-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.type === 'user' ? (
                      <span className="font-semibold">{message.username} ({message.timestamp}):</span>
                    ) : (
                      <span className="font-semibold text-green-600">System ({message.timestamp}):</span>
                    )}{' '}
                    <span dangerouslySetInnerHTML={{ __html: message.content }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 border-t">
              <div className="flex h-10">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-grow mr-2"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Characters</h2>
            <CharacterList 
              categories={['Party', 'NPC', 'Monster']}
              characters={characters}
              onAddCharacter={onAddCharacter}
              onUpdateCharacter={onUpdateCharacter}
              onDeleteCharacter={onDeleteCharacter}
            />
          </div>
        )}
      </div>
    </div>
  )
}


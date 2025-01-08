'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function RightSideMenu() {
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, inputMessage])
      setInputMessage('')
    }
  }

  return (
    <div className="w-64 flex flex-col bg-gray-100 border-l">
      <nav className="p-4 border-b">
        <ul className="space-y-2">
          <li><Link href="#" className="text-blue-600 hover:underline">Characters</Link></li>
          <li><Link href="#" className="text-blue-600 hover:underline">Maps</Link></li>
          <li><Link href="#" className="text-blue-600 hover:underline">Settings</Link></li>
        </ul>
      </nav>
      <div className="flex-grow flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>
        <ScrollArea className="flex-grow mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">User:</span> {message}
            </div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow mr-2"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
}


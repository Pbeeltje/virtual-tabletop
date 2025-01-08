'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type MessageType = 'user' | 'system'

interface ChatMessage {
  type: MessageType
  content: string
  timestamp: string
}

interface RightSideMenuProps {
  messages: ChatMessage[]
  addMessage: (type: MessageType, content: string) => void
}

export default function RightSideMenu({ messages, addMessage }: RightSideMenuProps) {
  const [inputMessage, setInputMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage('user', inputMessage)
      setInputMessage('')
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-64 flex flex-col bg-gray-100 border-l">
      <nav className="p-4 border-b">
        <ul className="space-y-2">
          <li><Link href="#" className="text-blue-600 hover:underline">Characters</Link></li>
          <li><Link href="#" className="text-blue-600 hover:underline">Maps</Link></li>
          <li><Link href="#" className="text-blue-600 hover:underline">Settings</Link></li>
        </ul>
      </nav>
      <div className="flex-grow flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold p-4 pb-2">Chat</h2>
        <ScrollArea className="flex-grow px-4" ref={scrollAreaRef}>
          <div className="space-y-2 pb-4">
            {messages.map((message, index) => (
              <div key={index}>
                {message.type === 'user' ? (
                  <span className="font-semibold">Anonymous ({message.timestamp}):</span>
                ) : (
                  <span className="font-semibold text-green-600">System ({message.timestamp}):</span>
                )}{' '}
                <span dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t">
        <div className="flex">
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
    </div>
  )
}


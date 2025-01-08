'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
//import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from 'lucide-react'

type MessageType = 'user' | 'system'

interface ChatMessage {
  type: MessageType
  content: string
  timestamp: string
  username: string
}

interface RightSideMenuProps {
  messages: ChatMessage[]
  addMessage: (type: MessageType, content: string, username: string) => void
  user: string
  users: string[]
  chatBackgroundColor: string
}

export default function RightSideMenu({ messages, addMessage, user, users, chatBackgroundColor }: RightSideMenuProps) {
  const [inputMessage, setInputMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage('user', inputMessage, user)
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
          {/* <li>
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="text-blue-600 hover:underline p-0">Users</Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Online Users</h3>
                  <PopoverClose className="rounded-full h-4 w-4 inline-flex items-center justify-center text-gray-500 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </PopoverClose>
                </div>
                <ul>
                  {users.map((user, index) => (
                    <li key={index}>{user}</li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </li> */}
        </ul>
      </nav>
      <div className="flex-grow flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold p-4 pb-2">Chat</h2>
        <ScrollArea className={`flex-grow px-4 ${chatBackgroundColor}`} ref={scrollAreaRef}>
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
        </ScrollArea>
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
    </div>
  )
}


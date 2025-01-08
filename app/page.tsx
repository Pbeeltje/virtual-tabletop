'use client'

import { useState } from 'react'
import MainContent from './components/MainContent'
import RightSideMenu from './components/RightSideMenu'
import BottomBar from './components/BottomBar'

type MessageType = 'user' | 'system'

interface ChatMessage {
  type: MessageType
  content: string
  timestamp: string
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (type: MessageType, content: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setMessages(prevMessages => [...prevMessages, { type, content, timestamp }])
  }

  const handleDiceRoll = (sides: number, result: number) => {
    addMessage('system', `User rolled a d${sides}: <b>${result}</b>`)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-auto">
          <MainContent />
        </div>
        <RightSideMenu messages={messages} addMessage={addMessage} />
      </div>
      <BottomBar onDiceRoll={handleDiceRoll} />
    </div>
  )
}


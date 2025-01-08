import { useState } from 'react'
import MainContent from './components/MainContent'
import RightSideMenu from './components/RightSideMenu'
import BottomBar from './components/BottomBar'
import LoginForm from './components/LoginForm'

type MessageType = 'user' | 'system'

interface ChatMessage {
  type: MessageType
  content: string
  timestamp: string
  username: string
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [user, setUser] = useState<string | null>(null)
  const [chatBackgroundColor, setChatBackgroundColor] = useState('white');

  const onPhaseChange = (phase: string, color: string) => {
    if(phase != '') 
    {
        setMessages(prevMessages => [...prevMessages, { type: 'system', content: `${phase}`, timestamp: new Date().toLocaleTimeString(), username: 'System' }]);
    }
    setChatBackgroundColor(color); // This will change the background color dynamically
  };

  const addMessage = (type: MessageType, content: string, username: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setMessages(prevMessages => [...prevMessages, { type, content, timestamp, username }])
  }

  const handleDiceRoll = (sides: number, result: number) => {
    addMessage('system', `${user} rolled a d${sides}: <b>${result}</b>`, 'System')
  }

  const handleLogin = (username: string) => {
    setUser(username)
    addMessage('system', `${username} has joined the game.`, 'System')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to Virtual Tabletop</h1>
          <LoginForm onLogin={handleLogin} />
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
  user={user} 
  users={[]} 
  chatBackgroundColor={chatBackgroundColor} // Use state here
  onPhaseChange={onPhaseChange} 
/>
      </div>
      <BottomBar 
  onDiceRoll={handleDiceRoll} 
  onPhaseChange={onPhaseChange} 
/>
    </div>
  )
}


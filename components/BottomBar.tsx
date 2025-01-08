'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'

export default function BottomBar() {
  const [lastRoll, setLastRoll] = useState<number | null>(null)

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    setLastRoll(result)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2 flex justify-center space-x-2">
      <Button onClick={() => rollDice(4)} variant="outline" size="icon">
        <Dice1 className="h-4 w-4" />
      </Button>
      <Button onClick={() => rollDice(6)} variant="outline" size="icon">
        <Dice2 className="h-4 w-4" />
      </Button>
      <Button onClick={() => rollDice(8)} variant="outline" size="icon">
        <Dice3 className="h-4 w-4" />
      </Button>
      <Button onClick={() => rollDice(10)} variant="outline" size="icon">
        <Dice4 className="h-4 w-4" />
      </Button>
      <Button onClick={() => rollDice(12)} variant="outline" size="icon">
        <Dice5 className="h-4 w-4" />
      </Button>
      <Button onClick={() => rollDice(20)} variant="outline" size="icon">
        <Dice6 className="h-4 w-4" />
      </Button>
      {lastRoll && <span className="ml-4 font-bold">Last roll: {lastRoll}</span>}
    </div>
  )
}


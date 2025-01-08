'use client'

import { Button } from "@/components/ui/button"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'
import EncounterButton from './EncounterButton'

interface BottomBarProps {
  onDiceRoll: (sides: number, result: number) => void
  onPhaseChange: (phase: string, color: string) => void
}

export default function BottomBar({ onDiceRoll, onPhaseChange }: BottomBarProps) {
  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    onDiceRoll(sides, result)
  }

  return (
    <div className="bg-gray-200 p-2 flex justify-center space-x-2 items-center">
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
      <div className="border-l border-gray-400 h-6 mx-2"></div>
      <EncounterButton onPhaseChange={onPhaseChange} />
    </div>
  )
}


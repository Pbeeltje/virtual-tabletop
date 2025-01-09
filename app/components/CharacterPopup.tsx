'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Character {
  CharacterId: number
  Name: string
  Description: string
  Age: number
  Level: number
  Guard: number
  Armor: number
  MaxGuard: number
  Strength: number
  MaxStrength: number
  Dexternity: number
  MaxDexternity: number
  Mind: number
  MaxMind: number
  Charisma: number
  MaxCharisma: number
  Skill: number
  MaxSkill: number
  Mp: number
  MaxMp: number
  InventoryId: number
  JobId: number | null
  Path: string
}

interface CharacterPopupProps {
  character: Character
  onClose: () => void
  onUpdate: (updatedCharacter: Character) => void
}

export default function CharacterPopup({ character, onClose, onUpdate }: CharacterPopupProps) {
  const [editedCharacter, setEditedCharacter] = useState<Character>(character)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedCharacter({ ...editedCharacter, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/characters/${character.CharacterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCharacter),
      })
      if (response.ok) {
        onUpdate(editedCharacter)
      } else {
        console.error('Failed to update character')
      }
    } catch (error) {
      console.error('Error updating character:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="stats">
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="Name"
                value={editedCharacter.Name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <Input
                name="Description"
                value={editedCharacter.Description}
                onChange={handleInputChange}
                placeholder="Description"
              />
              <Input
                name="Age"
                type="number"
                value={editedCharacter.Age}
                onChange={handleInputChange}
                placeholder="Age"
              />
              <Input
                name="Level"
                type="number"
                value={editedCharacter.Level}
                onChange={handleInputChange}
                placeholder="Level"
              />
              {/* Add more inputs for other stats */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="jobs">
            {/* Add job-related fields here */}
            <p>Job information coming soon...</p>
          </TabsContent>
          <TabsContent value="inventory">
            {/* Add inventory-related fields here */}
            <p>Inventory information coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import CharacterPopup from './CharacterPopup'

interface Character {
  CharacterId: number
  Name: string
  Description: string
  // Add other fields as needed
}

interface CharacterListProps {
  category: 'Party' | 'NPC' | 'Monster'
}

export default function CharacterList({ category }: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  useEffect(() => {
    fetchCharacters()
  }, [category])

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`/api/characters?category=${category}`)
      const data = await response.json()
      setCharacters(data)
    } catch (error) {
      console.error('Error fetching characters:', error)
    }
  }

  const handleAddCharacter = async () => {
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      })
      const newCharacter = await response.json()
      setCharacters([...characters, newCharacter])
    } catch (error) {
      console.error('Error adding character:', error)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{category}</h2>
      <ul className="space-y-2">
        {characters.map((character) => (
          <li key={character.CharacterId} className="flex items-center justify-between">
            <span>{character.Name}</span>
            <Button variant="ghost" onClick={() => setSelectedCharacter(character)}>
              View
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" className="mt-2" onClick={handleAddCharacter}>
        <Plus className="w-4 h-4 mr-2" /> Add {category}
      </Button>
      {selectedCharacter && (
        <CharacterPopup
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          onUpdate={(updatedCharacter) => {
            setCharacters(characters.map(c => c.CharacterId === updatedCharacter.CharacterId ? updatedCharacter : c))
            setSelectedCharacter(null)
          }}
        />
      )}
    </div>
  )
}


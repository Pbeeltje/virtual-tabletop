import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const client = createClient({
  url: 'libsql://machiovttdb-pbeeltje.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzY0MTc0NDksImlkIjoiMzhhZDhmZDYtZmMwMy00M2NjLWFjZjktMWJiMTNiZDZiY2U0IiwicmlkIjoiMDU3M2UyZmYtZTg1MS00NDhlLThmNmItMzY5MTEwODZjOTZmIn0.NYSv79DSUMoo6MTDrjjrag2qL2YN_x7VvabUBnEqPUMXKafJkaJt5tyVDLIEuAEka1lg2dbU-7BlUIyCpU6OBw'
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM Character WHERE Path = ?',
      args: [category]
    })
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { category } = await request.json()

  try {
    const result = await client.execute({
      sql: 'INSERT INTO Character (Name, Description, Path) VALUES (?, ?, ?)',
      args: [`New ${category}`, 'A new character', category]
    })
    const newCharacterId = result.lastInsertRowid

    if (newCharacterId === undefined) {
      throw new Error('Failed to retrieve new character ID')
    }

    const newCharacter = await client.execute({
      sql: 'SELECT * FROM Character WHERE CharacterId = ?',
      args: [newCharacterId]
    })

    return NextResponse.json(newCharacter.rows[0])
  } catch (error) {
    console.error('Error adding character:', error)
    return NextResponse.json({ error: 'Failed to add character' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { CharacterId, ...updatedFields } = await request.json()

  try {
    const setClause = Object.keys(updatedFields).map(key => `${key} = ?`).join(', ')
    const args = [...Object.values(updatedFields), CharacterId]

    await client.execute({
      sql: `UPDATE Character SET ${setClause} WHERE CharacterId = ?`,
      args
    })

    const updatedCharacter = await client.execute({
      sql: 'SELECT * FROM Character WHERE CharacterId = ?',
      args: [CharacterId]
    })

    return NextResponse.json(updatedCharacter.rows[0])
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json({ error: 'Failed to update character' }, { status: 500 })
  }
}


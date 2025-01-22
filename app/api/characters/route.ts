import { NextResponse } from "next/server"
import { createClient } from "@libsql/client"
import { getUserFromCookie } from "@/lib/auth"

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
})

export async function GET(req: Request) {
  console.log("Entering GET function in /api/characters/route.ts")

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("Database configuration is missing")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 })
  }

  const user = getUserFromCookie(req)

  if (!user) {
    console.log("User is not authenticated")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  console.log(`Authenticated user: ${user.username}, role: ${user.role}`)

  try {
    console.log(`Fetching characters for category: ${category}`)

    let sql = "SELECT * FROM Character"
    let args: any[] = [category]

    if (category === "Party") {
      sql = "SELECT * FROM Character"
      args = []
    }

    if (user.role === "player") {
      sql += " AND UserId = ?"
      args.push(user.id)
    }

    const result = await client.execute({
      sql: sql,
      args: args,
    })

    console.log(`Characters fetched for ${category}:`, result.rows)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching characters:", error)
    return NextResponse.json(
      { error: "Failed to fetch characters", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}


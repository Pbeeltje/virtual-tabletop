import { cookies } from "next/headers"

export async function setUserCookie(user: { id: number; username: string; role: string }) {
  console.log("Setting user cookie:", user)
  try {
    const cookieStore = cookies()

    // Convert the user object to a JSON string
    const userString = JSON.stringify(user)
    console.log("User stringified:", userString, typeof userString)
    // Ensure the cookie value is a string
    cookieStore.set("user", userString)
    console.log("User cookie set successfully")
  } catch (error) {
    console.error("Error in setUserCookie:", error)
    throw error // Re-throw the error to be caught in the calling function
  }
}

export function getUserFromCookie() {
  console.log("Getting user from cookie")
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")
    if (userCookie && userCookie.value) {
      const user = JSON.parse(userCookie.value)
      console.log("User found in cookie:", user)
      if (user && user.id !== undefined && user.username && user.role) {
        return user
      }
    }
    console.log("No valid user found in cookie")
    return null
  } catch (error) {
    console.error("Error in getUserFromCookie:", error)
    return null
  }
}

export async function clearUserCookie() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("user")
    console.log("User cookie cleared")
  } catch (error) {
    console.error("Error in clearUserCookie:", error)
    throw error
  }
}


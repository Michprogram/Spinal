"use server"

import { db } from "@/lib/db"
import { canCodes, registrations } from "@/lib/db/schema"
import { cookies } from "next/headers"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function redeemCode(formData: FormData) {
  const code = formData.get("code") as string

  if (!code) {
    throw new Error("El código es requerido")
  }

  // Validate 13-digit code
  const cleanCode = code.replace(/\s/g, "")
  if (!/^\d{13}$/.test(cleanCode)) {
    throw new Error("El código debe tener exactamente 13 dígitos")
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get("spinal_session")?.value

  if (!sessionId) {
    throw new Error("Debes iniciar sesión para canjear códigos")
  }

  const userId = parseInt(sessionId, 10)

  // Check if user exists
  const users = await db
    .select()
    .from(registrations)
    .where(eq(registrations.id, userId))
    .limit(1)

  if (users.length === 0) {
    throw new Error("Usuario no encontrado")
  }

  // Check if code was already used by this user
  const existingCodes = await db
    .select()
    .from(canCodes)
    .where(eq(canCodes.code, cleanCode))
    .limit(1)

  if (existingCodes.length > 0) {
    throw new Error("Este código ya fue canjeado")
  }

  // Add code and update points
  await db.insert(canCodes).values({
    userId,
    code: cleanCode,
  })

  await db
    .update(registrations)
    .set({ points: sql`${registrations.points} + 5` })
    .where(eq(registrations.id, userId))

  revalidatePath("/")
  
  const updatedUsers = await db
    .select({ points: registrations.points })
    .from(registrations)
    .where(eq(registrations.id, userId))
    .limit(1)

  return { 
    success: true, 
    points: updatedUsers[0]?.points ?? 0,
    message: "¡Código canjeado! +5 puntos" 
  }
}

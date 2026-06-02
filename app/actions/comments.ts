"use server"

import { db } from "@/lib/db"
import { comments, type Comment } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getComments(): Promise<Comment[]> {
  return db.select().from(comments).orderBy(desc(comments.createdAt))
}

export async function addComment(formData: FormData) {
  const name = formData.get("name") as string
  const ageStr = formData.get("age") as string
  const message = formData.get("message") as string

  if (!name || !ageStr || !message) {
    throw new Error("Nombre, edad y mensaje son requeridos")
  }

  const age = parseInt(ageStr, 10)
  if (isNaN(age) || age < 10 || age > 120) {
    throw new Error("Debes tener al menos 10 años para comentar")
  }

  if (name.length > 100) {
    throw new Error("El nombre debe tener 100 caracteres o menos")
  }

  if (message.length > 1000) {
    throw new Error("El mensaje debe tener 1000 caracteres o menos")
  }

  await db.insert(comments).values({
    name: name.trim(),
    age,
    message: message.trim(),
  })

  revalidatePath("/")
}

"use server"

import { db } from "@/lib/db"
import { registrations } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function validateRut(rut: string): boolean {
  const cleanRut = rut.replace(/[.-]/g, "").toUpperCase()

  // Must be exactly 8 digits + 1 verifier (digit or K)
  if (!/^[0-9]{8}[0-9K]$/.test(cleanRut)) {
    return false
  }

  const body = cleanRut.slice(0, -1)
  const verifier = cleanRut.slice(-1)

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const calculatedVerifier = remainder === 0 ? "0" : remainder === 1 ? "K" : String(11 - remainder)

  return calculatedVerifier === verifier
}

function formatRut(rut: string): string {
  const cleanRut = rut.replace(/[.-]/g, "").toUpperCase()
  const body = cleanRut.slice(0, -1)
  const verifier = cleanRut.slice(-1)
  return `${body}-${verifier}`
}

async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.log("[v0] Resend not configured, skipping email")
    return
  }

  try {
    await resend.emails.send({
      from: "SPINAL <onboarding@resend.dev>",
      to: email,
      subject: "¡Bienvenido a la familia SPINAL!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #22c55e;">¡Bienvenido a SPINAL, ${name}!</h1>
          <p>Tu registro ha sido exitoso. Gracias por unirte a nuestra comunidad.</p>
          <p>Ahora puedes iniciar sesión con tu RUT y contraseña para comenzar a acumular puntos ingresando los códigos de tus latas SPINAL.</p>
          <p style="margin-top: 30px;">¡Energía natural para tu día!</p>
          <p><strong>El equipo de SPINAL</strong></p>
        </div>
      `,
    })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
  }
}

export async function addRegistration(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const rut = formData.get("rut") as string
  const password = formData.get("password") as string

  if (!name || !email || !phone || !rut || !password) {
    throw new Error("Todos los campos son requeridos")
  }

  if (name.length > 100) {
    throw new Error("El nombre debe tener 100 caracteres o menos")
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error("Por favor ingresa un correo electrónico válido")
  }

  const phoneRegex = /^\+?[0-9]{8,15}$/
  const cleanPhone = phone.replace(/[\s-]/g, "")
  if (!phoneRegex.test(cleanPhone)) {
    throw new Error("Por favor ingresa un número de teléfono válido")
  }

  if (!validateRut(rut)) {
    return { error: "Por favor ingresa un RUT válido (formato: 12345678-9)" }
  }

  const formattedRut = formatRut(rut)
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await db.insert(registrations).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      rut: formattedRut,
      password: hashedPassword,
      points: 0,
    })
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return { error: "Este RUT ya está registrado" }
    }
    return { error: "Error al registrar. Por favor intenta de nuevo." }
  }

  await sendWelcomeEmail(email.trim().toLowerCase(), name.trim())
  revalidatePath("/")
  return { success: true }
}

export async function login(formData: FormData) {
  const rut = formData.get("rut") as string
  const password = formData.get("password") as string

  if (!rut || !password) {
    throw new Error("RUT y contraseña son requeridos")
  }

  if (!validateRut(rut)) {
    throw new Error("RUT inválido")
  }

  const formattedRut = formatRut(rut)

  const users = await db
    .select()
    .from(registrations)
    .where(eq(registrations.rut, formattedRut))
    .limit(1)

  if (users.length === 0) {
    throw new Error("RUT o contraseña incorrectos")
  }

  const user = users[0]

  if (!user.password) {
    throw new Error("Esta cuenta no tiene contraseña configurada")
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    throw new Error("RUT o contraseña incorrectos")
  }

  const cookieStore = await cookies()
  cookieStore.set("spinal_session", String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  revalidatePath("/")
  return { success: true, user: { id: user.id, name: user.name, points: user.points ?? 0 } }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("spinal_session")
  revalidatePath("/")
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("spinal_session")?.value

  if (!sessionId) {
    return null
  }

  const users = await db
    .select({
      id: registrations.id,
      name: registrations.name,
      points: registrations.points,
    })
    .from(registrations)
    .where(eq(registrations.id, parseInt(sessionId, 10)))
    .limit(1)

  if (users.length === 0) {
    return null
  }

  return users[0]
}

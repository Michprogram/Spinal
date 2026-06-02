"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addRegistration } from "@/app/actions/registrations"
import { redeemCode } from "@/app/actions/codes"
import { UserPlus, Loader2, CheckCircle, Gift, Star } from "lucide-react"

interface RegistrationSectionProps {
  user: { id: number; name: string; points: number | null } | null
}

export function RegistrationSection({ user }: RegistrationSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [codeSuccess, setCodeSuccess] = useState<string | null>(null)
  const [currentPoints, setCurrentPoints] = useState(user?.points ?? 0)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        await addRegistration(formData)
        setSuccess(true)
        const form = document.getElementById("registration-form") as HTMLFormElement
        form?.reset()
      } catch (err) {
        setSuccess(false)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Error al registrar. Por favor, inténtalo de nuevo.")
        }
      }
    })
  }

  async function handleRedeemCode(formData: FormData) {
    setError(null)
    setCodeSuccess(null)
    startTransition(async () => {
      try {
        const result = await redeemCode(formData)
        setCodeSuccess(result.message)
        setCurrentPoints(result.points)
        const form = document.getElementById("code-form") as HTMLFormElement
        form?.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al canjear código")
      }
    })
  }

  // If user is logged in, show code redemption section
  if (user) {
    return (
      <section id="registro" className="py-24 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Canjear Puntos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Ingrese el código de su lata para <span className="text-primary">ganar puntos</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Encuentra el código de 13 dígitos en tu lata SPINAL y gana 5 puntos por cada código.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-center gap-2 mb-6 p-4 rounded-lg bg-primary/10">
              <Star className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{currentPoints} puntos</span>
            </div>

            {codeSuccess ? (
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 text-center mb-4">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="text-lg font-semibold">{codeSuccess}</p>
                <Button
                  onClick={() => setCodeSuccess(null)}
                  variant="outline"
                  className="mt-4"
                >
                  Ingresar otro código
                </Button>
              </div>
            ) : (
              <form id="code-form" action={handleRedeemCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-2">
                    Código de la lata (13 dígitos)
                  </label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="1234567890123"
                    required
                    maxLength={13}
                    pattern="\d{13}"
                    className="bg-secondary/50 text-center text-lg tracking-widest"
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    El código se encuentra en la parte inferior de tu lata SPINAL
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4 mr-2" />
                  )}
                  {isPending ? "Canjeando..." : "Canjear Código (+5 pts)"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Not logged in - show registration form
  return (
    <section id="registro" className="py-24 px-6 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Registro</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Únete a la <span className="text-primary">Familia SPINAL</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Regístrate para acumular puntos y canjearlos por mas bebidas!.
          </p>
        </div>

        {success ? (
          <div className="p-8 rounded-xl bg-primary/10 border border-primary/30 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h3>
            <p className="text-muted-foreground mb-6">
              Gracias por unirte a la familia SPINAL. Te hemos enviado un correo de bienvenida.
              Ahora puedes iniciar sesión para comenzar a acumular puntos.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline">
              Registrar otra persona
            </Button>
          </div>
        ) : (
          <form id="registration-form" action={handleSubmit} className="p-6 rounded-xl bg-card border border-border">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <Input
                  id="reg-name"
                  name="name"
                  placeholder="Juan Pérez"
                  required
                  maxLength={100}
                  className="bg-secondary/50"
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  required
                  className="bg-secondary/50"
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-sm font-medium mb-2">
                  Teléfono
                </label>
                <Input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="9 1234 5678"
                  required
                  className="bg-secondary/50"
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="reg-rut" className="block text-sm font-medium mb-2">
                  RUT
                </label>
                <Input
                  id="reg-rut"
                  name="rut"
                  placeholder="12345678-9"
                  required
                  maxLength={10}
                  pattern="^\d{8}-[\dkK]$"
                  className="bg-secondary/50"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: 12345678-9 (8 números, guión y dígito verificador)
                </p>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <Input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="bg-secondary/50"
                  disabled={isPending}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={isPending} className="w-full mt-2">
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Registrando..." : "Registrarme"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

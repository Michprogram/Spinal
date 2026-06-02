"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, logout } from "@/app/actions/registrations"
import { LogIn, LogOut, Loader2, Star, X } from "lucide-react"

interface HeaderProps {
  user: { id: number; name: string; points: number | null } | null
}

export function Header({ user }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await login(formData)
        setShowLogin(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      }
    })
  }

  async function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg
              viewBox="0 0 40 40"
              className="w-10 h-10 text-primary"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
              <path
                d="M20 8 L20 12 M20 14 L20 18 M20 20 L20 24 M20 26 L20 30 M20 32"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="10" r="2" fill="currentColor" />
              <circle cx="20" cy="16" r="2" fill="currentColor" />
              <circle cx="20" cy="22" r="2" fill="currentColor" />
              <circle cx="20" cy="28" r="2" fill="currentColor" />
            </svg>
            <span className="text-2xl font-black tracking-tight">SPINAL</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#caracteristicas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#registro" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {user ? "Canjear" : "Registro"}
            </Link>
            <Link href="#comunidad" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Comentarios
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">{user.points ?? 0} pts</span>
                </div>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Hola, {user.name.split(" ")[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  <span className="hidden sm:inline ml-2">Salir</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogin(true)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Login Modal - fuera del header */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogin(false)
          }}
        >
          <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-xl">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

            <form action={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-rut" className="block text-sm font-medium mb-2">
                  RUT
                </label>
                <Input
                  id="login-rut"
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
                <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Tu contraseña"
                  required
                  className="bg-secondary/50"
                  disabled={isPending}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-4">
              ¿No tienes cuenta?{" "}
              <Link
                href="#registro"
                onClick={() => setShowLogin(false)}
                className="text-primary hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
} 
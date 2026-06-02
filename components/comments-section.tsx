"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/actions/comments"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import type { Comment } from "@/lib/db/schema"

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function CommentsSection({ initialComments }: { initialComments: Comment[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await addComment(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al publicar comentario")
      }
    })
  }

  return (
    <section id="comunidad" className="py-24 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Comunidad</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Lo Que Dicen <span className="text-primary">Nuestros Fans</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Únete a la experiencia. Tu opinion es importante para nosotros, cuentanos que te parece nuestro sistema!
          </p>
        </div>

        {/* Comment Form */}
        <form action={handleSubmit} className="mb-12 p-6 rounded-xl bg-card border border-border">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Tu nombre"
                required
                maxLength={100}
                className="bg-secondary/50"
                disabled={isPending}
              />
              <Input
                name="age"
                type="number"
                placeholder="Tu edad"
                required
                min={10}
                max={120}
                className="bg-secondary/50"
                disabled={isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Debes tener al menos 10 años para dejar un comentario.
            </p>
            <Textarea
              name="message"
              placeholder="Comparte tu experiencia con SPINAL..."
              required
              maxLength={1000}
              rows={3}
              className="bg-secondary/50 resize-none"
              disabled={isPending}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={isPending} className="self-end">
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isPending ? "Publicando..." : "Publicar Comentario"}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {initialComments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!</p>
            </div>
          ) : (
            initialComments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{comment.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.age} años</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {comment.createdAt ? formatDateTime(new Date(comment.createdAt)) : ""}
                  </span>
                </div>
                <p className="text-foreground/90 leading-relaxed">{comment.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

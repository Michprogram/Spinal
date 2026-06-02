import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { RegistrationSection } from "@/components/registration-section"
import { CommentsSection } from "@/components/comments-section"
import { Footer } from "@/components/footer"
import { getComments } from "@/app/actions/comments"
import { getSession } from "@/app/actions/registrations"

export default async function Home() {
  const [comments, user] = await Promise.all([
    getComments(),
    getSession(),
  ])

  return (
    <main className="min-h-screen">
      <Header user={user} />
      <Hero />
      <Features />
      <RegistrationSection user={user} />
      <CommentsSection initialComments={comments} />
      <Footer />
    </main>
  )
}

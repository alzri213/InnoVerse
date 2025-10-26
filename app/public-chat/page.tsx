import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import PublicChat from "@/components/public-chat"

export default async function PublicChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Public Chat Komunitas
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Diskusi bersama komunitas InnoVerse • Bagikan pengalaman dan bantu sesama
            </p>
          </div>

          <PublicChat language="id" />
        </div>
      </div>
    </div>
  )
}

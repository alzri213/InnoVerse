import { createClient } from "@/lib/supabase/server"
import AIAssistant from "@/components/ai-assistant"

export default async function AIAssistantPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              InnoVerse AI Assistant
            </h1>
            <p className="text-muted-foreground">
              Tanyakan apa saja tentang platform InnoVerse, materi pembelajaran, dan bantuan teknis
            </p>
          </div>

          <AIAssistant language="id" />
        </div>
      </div>
    </div>
  )
}

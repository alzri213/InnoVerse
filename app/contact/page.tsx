import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import PublicChat from "@/components/public-chat"

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Contact Information Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hubungi Kami
            </h1>
            <p className="text-muted-foreground">
              Ada pertanyaan atau butuh bantuan? Hubungi tim InnoVerse
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Email:</strong> innoverse28@gmail.com
                  </div>
                  <div>
                    <strong>Telepon:</strong> +62 857-8064-3419
                  </div>
                  <div>
                    <strong>Jam Operasional:</strong> Senin - Jumat, 08:00 - 17:00 WIB
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Alamat</h2>
                <div className="text-sm">
                  <p>SMK TELEKOMUNIKASI TELESANDI BEKASI</p>
                  <p>Desa, Mekarsari, Kec. Tambun Sel.</p>
                  <p>Kabupaten Bekasi, Jawa Barat 17510</p>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Bantuan Cepat</h2>
                <div className="space-y-2 text-sm">
                  <p>• Panduan penggunaan platform</p>
                  <p>• Pertanyaan teknis</p>
                  <p>• Masukan dan saran</p>
                  <p>• Laporan bug</p>
                </div>
              </div>
            </div>

            {/* Room Chatting Section */}
            <div className="bg-card rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Room Chatting</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Diskusi real-time dengan komunitas InnoVerse
                </p>
              </div>
              <PublicChat language="id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Terima Kasih!</CardTitle>
            <CardDescription>Akun Anda telah berhasil dibuat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium mb-2">📧 Periksa Email Anda</p>
              <p className="text-muted-foreground text-sm">
                Kami telah mengirim link konfirmasi ke email Anda. Klik link tersebut untuk mengaktifkan akun.
              </p>
            </div>
            <div className="p-4 bg-muted/20 border border-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Jika Anda tidak menerima email, periksa folder spam atau junk mail.
              </p>
            </div>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary-dark text-background">Kembali ke Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

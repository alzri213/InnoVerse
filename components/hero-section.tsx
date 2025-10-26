import { Button } from "@/components/ui/button"
import Link from "next/link"
import AnimatedCube from "@/components/animated-cube"

export default function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="animate-slide-in-up">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground drop-shadow-2xl font-black">ONLINE</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x bg-size-200 filter drop-shadow-2xl font-black" style={{color:'#ff0000ff', textShadow: '0 0 10px rgba(255, 0, 0, 0.4), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.2)', WebkitTextStroke: '0.5px #000000'}}>EDUCATION</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...
          </p>
          <Link href="/games">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 animate-blink-glow animate-float-up-down relative overflow-hidden group">
              <span className="relative z-10">GAMES</span>
              <span className="ml-2 inline-block animate-bounce-right-majestic group-hover:animate-bounce-right-majestic">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </Link>
        </div>

        {/* Right 3D Cube */}
        <div className="flex justify-center items-center h-96">
          <AnimatedCube />
        </div>
      </div>
    </section>
  )
}

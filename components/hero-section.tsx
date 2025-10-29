import { Button } from "@/components/ui/button"
import Link from "next/link"
import AnimatedCube from "@/components/animated-cube"
import AnimatedText from "@/components/animated-text"
import AnimatedSection from "@/components/animated-section"
import { motion } from "framer-motion"

export default function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <AnimatedSection delay={0.2}>
          <motion.div
            className="animate-slide-in-up"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnimatedText
              type="words"
              staggerChildren={0.1}
              className="text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-foreground drop-shadow-2xl font-black">ONLINE</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x bg-size-200 filter drop-shadow-2xl font-black" style={{color:'#ff0000ff', textShadow: '0 0 10px rgba(255, 0, 0, 0.4), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.2)', WebkitTextStroke: '0.5px #000000'}}>EDUCATION</span>
            </AnimatedText>
            <AnimatedSection delay={0.6}>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Platform pembelajaran online terdepan yang menghadirkan pengalaman edukasi teknologi interaktif dan inovatif. Dengan materi yang up-to-date, metode pembelajaran yang menarik, dan komunitas yang mendukung, kami membantu Anda menguasai teknologi masa depan dengan cara yang lebih efektif dan menyenangkan.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.8}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/games">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 animate-blink-glow animate-float-up-down relative overflow-hidden group">
                    <span className="relative z-10">GAMES</span>
                    <span className="ml-2 inline-block animate-bounce-right-majestic group-hover:animate-bounce-right-majestic">→</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.7 }}
                    />
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </motion.div>
        </AnimatedSection>

        {/* Right 3D Cube */}
        <AnimatedSection delay={0.4} direction="right">
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex justify-center items-center h-96"
          >
            <AnimatedCube />
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}

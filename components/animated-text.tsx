"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerChildren?: number
  type?: "words" | "characters" | "lines"
}

export default function AnimatedText({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.05,
  type = "words"
}: AnimatedTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const splitText = (text: string, type: "words" | "characters" | "lines") => {
    switch (type) {
      case "characters":
        return text.split("")
      case "lines":
        return text.split("\n")
      default:
        return text.split(" ")
    }
  }

  const renderAnimatedText = (text: string) => {
    const parts = splitText(text, type)

    return (
      <motion.span
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {parts.map((part, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            style={{ display: type === "characters" ? "inline-block" : "inline" }}
          >
            {part}
            {type === "words" && index < parts.length - 1 && " "}
            {type === "lines" && <br />}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  if (typeof children === "string") {
    return renderAnimatedText(children)
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  )
}

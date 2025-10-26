"use client"

export default function FloatingIcons() {
  const icons = [
    { icon: "🧠", delay: "0s", x: "85%", y: "15%" },
    { icon: "✅", delay: "0.5s", x: "90%", y: "30%" },
    { icon: "💬", delay: "1s", x: "80%", y: "50%" },
    { icon: "⌛", delay: "1.5s", x: "85%", y: "70%" },
    { icon: "💻", delay: "2s", x: "90%", y: "85%" },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((item, index) => (
        <div
          key={index}
          className="absolute text-4xl animate-float"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: item.delay,
            opacity: 0.3,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]

      const dayName = days[now.getDay()]
      const monthName = months[now.getMonth()]
      const date = now.getDate()
      const year = now.getFullYear()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")

      const formatted = `${dayName}, ${monthName} ${date}, ${year} - ${hours}:${minutes}:${seconds}`
      setDateTime(formatted)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return <div className="text-sm text-muted-foreground font-medium">{dateTime}</div>
}

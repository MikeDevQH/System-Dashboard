"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Clock } from "lucide-react"

interface UptimeProps {
  uptime: number // Tiempo en segundos
}

const Uptime: React.FC<UptimeProps> = ({ uptime }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentUptime, setCurrentUptime] = useState(uptime)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setCurrentUptime((prev) => prev + 1) // Incrementar uptime cada segundo
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Convertir uptime a días, horas, minutos y segundos
  const days = Math.floor(currentUptime / 86400)
  const hours = Math.floor((currentUptime % 86400) / 3600)
  const minutes = Math.floor((currentUptime % 3600) / 60)
  const seconds = Math.floor(currentUptime % 60)

  // Formatear con ceros a la izquierda
  const formattedHours = hours.toString().padStart(2, "0")
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = seconds.toString().padStart(2, "0")

  // Obtener zona horaria en formato UTC±HH:MM
  const timeZoneOffset = -currentTime.getTimezoneOffset()
  const timeZoneHours = Math.floor(timeZoneOffset / 60)
  const timeZoneMinutes = timeZoneOffset % 60
  const timeZoneString = `UTC${timeZoneHours >= 0 ? "+" : "-"}${Math.abs(timeZoneHours)
    .toString()
    .padStart(2, "0")}:${Math.abs(timeZoneMinutes).toString().padStart(2, "0")}`

  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">System Time</h2>
        <Clock className="h-5 w-5 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Time</p>
          <p className="text-3xl font-mono text-primary">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">System Uptime</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-mono text-primary">
              {days > 0 ? `${days}d ` : ""}
              {formattedHours}:{formattedMinutes}:{formattedSeconds}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-sm text-muted-foreground">Time Zone: {timeZoneString}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Uptime


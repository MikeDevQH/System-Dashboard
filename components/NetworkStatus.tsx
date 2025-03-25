import type React from "react"
import { Wifi } from "lucide-react"

interface NetworkStatusProps {
  speed: number
  latency: number
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ speed, latency }) => {
  // Convertir velocidad a unidades más legibles
  const formatSpeed = () => {
    if (speed < 1024) {
      return `${speed.toFixed(2)} KB/s`
    } else if (speed < 1024 * 1024) {
      return `${(speed / 1024).toFixed(2)} MB/s`
    } else {
      return `${(speed / 1024 / 1024).toFixed(2)} GB/s`
    }
  }

  // Determinar calidad de la conexión
  const getLatencyQuality = () => {
    if (latency < 50) return "Excellent"
    if (latency < 100) return "Good"
    if (latency < 200) return "Average"
    return "Poor"
  }

  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Network</h2>
        <Wifi className="h-5 w-5 text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Speed</p>
          <p className="text-2xl font-bold text-primary">{formatSpeed()}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Latency</p>
          <p className="text-2xl font-bold text-primary">{latency} ms</p>
          <p className="text-xs text-muted-foreground">{getLatencyQuality()}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Connected</span>
      </div>
    </div>
  )
}

export default NetworkStatus


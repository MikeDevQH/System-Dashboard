import type React from "react"
import { Wifi, Activity, ArrowDown, ArrowUp } from "lucide-react"

interface NetworkStatusProps {
  speed: number
  latency: number
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ speed, latency }) => {
  // Convert speed to more readable units
  const formatSpeed = () => {
    if (speed < 1024) {
      return `${speed.toFixed(2)} KB/s`
    } else if (speed < 1024 * 1024) {
      return `${(speed / 1024).toFixed(2)} MB/s`
    } else {
      return `${(speed / 1024 / 1024).toFixed(2)} GB/s`
    }
  }

  // Determine connection quality
  const getLatencyQuality = () => {
    if (latency < 50) return "Excellent"
    if (latency < 100) return "Good"
    if (latency < 200) return "Average"
    return "Poor"
  }

  // Determine color based on quality
  const getLatencyColor = () => {
    if (latency < 50) return "text-green-500"
    if (latency < 100) return "text-primary"
    if (latency < 200) return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <div className="card p-6 animate-enter h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Network Status</h2>
        <Wifi className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ArrowDown className="h-4 w-4 text-green-500" />
            <p className="text-sm text-muted-foreground">Download Speed</p>
          </div>
          <p className="text-2xl font-bold text-primary">{formatSpeed()}</p>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(speed / 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ArrowUp className="h-4 w-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">Upload Speed</p>
          </div>
          <p className="text-2xl font-bold text-primary">{(speed * 0.3).toFixed(2)} KB/s</p>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((speed * 0.3) / 10, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Latency</p>
          </div>
          <p className="text-2xl font-bold text-primary">{latency} ms</p>
          <p className={`text-sm ${getLatencyColor()}`}>{getLatencyQuality()} Connection</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Active Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkStatus


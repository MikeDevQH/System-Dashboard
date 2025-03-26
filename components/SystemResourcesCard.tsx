"use client"

import { Cpu, MemoryStickIcon as Memory, Server, Layers } from "lucide-react"
import { useEffect, useState } from "react"

interface SystemResourcesCardProps {
  cpuUsage: string
  memoryUsage: string
}

interface SystemInfo {
  cpuModel: string
  cpuCores: number
  cpuThreads: number
  cpuSpeed: number
  memoryTotal: number
  architecture: string
  platform: string
}

export default function SystemResourcesCard({ cpuUsage, memoryUsage }: SystemResourcesCardProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystemInfo = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/system-info")
        if (res.ok) {
          const data = await res.json()
          setSystemInfo(data)
        } else {
          console.error("Failed to fetch system info")
        }
      } catch (error) {
        console.error("Error fetching system info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemInfo()
  }, [])

  return (
    <div className="card p-6 animate-enter h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">System Resources</h2>
      </div>

      <div className="space-y-6">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <h3 className="font-medium">CPU Usage</h3>
            </div>
            <span className="text-2xl font-bold text-primary">{cpuUsage}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                Number.parseFloat(cpuUsage) > 80
                  ? "bg-red-500"
                  : Number.parseFloat(cpuUsage) > 60
                    ? "bg-yellow-500"
                    : "bg-primary"
              }`}
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Memory className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Memory Usage</h3>
            </div>
            <span className="text-2xl font-bold text-primary">{memoryUsage}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                Number.parseFloat(memoryUsage) > 80
                  ? "bg-red-500"
                  : Number.parseFloat(memoryUsage) > 60
                    ? "bg-yellow-500"
                    : "bg-primary"
              }`}
              style={{ width: `${memoryUsage}%` }}
            ></div>
          </div>
        </div>

        {/* System information - only real data from API */}
        {loading ? (
          <div className="mt-4 pt-4 border-t border-border text-center text-muted-foreground">
            Loading system information...
          </div>
        ) : systemInfo ? (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">CPU Model</div>
              <div className="font-medium text-right truncate" title={systemInfo.cpuModel}>
                {systemInfo.cpuModel}
              </div>

              <div className="text-muted-foreground">Architecture</div>
              <div className="font-medium text-right">{systemInfo.architecture}</div>

              <div className="text-muted-foreground">Cores/Threads</div>
              <div className="font-medium text-right">
                {systemInfo.cpuCores}C/{systemInfo.cpuThreads}T
              </div>

              <div className="text-muted-foreground">CPU Speed</div>
              <div className="font-medium text-right">{systemInfo.cpuSpeed} GHz</div>

              <div className="text-muted-foreground">Memory Total</div>
              <div className="font-medium text-right">{systemInfo.memoryTotal} GB</div>

              <div className="text-muted-foreground">Platform</div>
              <div className="font-medium text-right capitalize">{systemInfo.platform}</div>
            </div>

            {/* Memory calculations based on real data */}
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Memory Free</div>
                  <div className="font-medium">
                    {(systemInfo.memoryTotal * (1 - Number(memoryUsage) / 100)).toFixed(1)} GB
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Memory Used</div>
                  <div className="font-medium">
                    {(systemInfo.memoryTotal * (Number(memoryUsage) / 100)).toFixed(1)} GB
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-border text-center text-muted-foreground">
            System information unavailable
          </div>
        )}
      </div>
    </div>
  )
}


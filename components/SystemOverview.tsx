"use client"
import { useEffect, useState } from "react"
import StatCard from "./StatCard"
import DiskList from "./DiskList"
import NetworkStatus from "./NetworkStatus"
import Uptime from "./Uptime"
import ProcessList from "./ProcessList"
import SystemPerformanceChart from "./SystemPerformanceChart"
import { Cpu, MemoryStickIcon as Memory, Server } from "lucide-react"

interface SystemData {
  cpuUsage: string
  memoryUsage: string
  networkSpeed: number
  networkLatency: number
  disks: { name: string; used: number; total: number; type: string }[]
  uptime: number
}

export default function SystemOverview() {
  const [data, setData] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/system")
        const systemData = await res.json()
        setData(systemData)
      } catch (error) {
        console.error("Error fetching system data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Actualiza cada 5s

    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 border-4 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--text)]">Loading system information...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-6 card max-w-md">
          <Server className="h-12 w-12 text-[var(--accent)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">System Data Unavailable</h2>
          <p className="text-[var(--muted)]">
            Unable to retrieve system information. Please check your server connection and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="CPU Usage" value={data.cpuUsage} unit="%" icon={<Cpu className="h-5 w-5" />} />
        <StatCard title="Memory Usage" value={data.memoryUsage} unit="%" icon={<Memory className="h-5 w-5" />} />
        <NetworkStatus speed={data.networkSpeed} latency={data.networkLatency} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemPerformanceChart />
        <DiskList disks={data.disks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessList />
        <Uptime uptime={data.uptime} />
      </div>
    </div>
  )
}


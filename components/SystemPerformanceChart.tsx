"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTheme } from "./ThemeProvider"
import { BarChart2, RefreshCw } from "lucide-react"

interface DataPoint {
  time: string
  cpu: number
  memory: number
  network: number
}

const SystemPerformance = () => {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/system")
      const result = await res.json()

      const newPoint: DataPoint = {
        time: new Date().toLocaleTimeString(),
        cpu: Number.parseFloat(result.cpuUsage),
        memory: Number.parseFloat(result.memoryUsage),
        network: Number.parseFloat((result.networkSpeed / 1024).toFixed(2)), // Convertir a KB/s
      }

      setData((prev) => [...prev.slice(-20), newPoint]) // Mantener solo los últimos 20 datos
    } catch (error) {
      console.error("Error fetching system data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData() // Cargar datos al inicio
    const interval = setInterval(fetchData, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  // Colores según el tema
  const chartColors = {
    cpu: "#3b82f6",
    memory: "#8b5cf6",
    network: "#10b981",
    grid: theme === "light" ? "#e2e8f0" : "#334155",
    text: theme === "light" ? "#1e293b" : "#f1f5f9",
    tooltip: theme === "light" ? "#ffffff" : "#1e293b",
  }

  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">System Performance</h2>
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
          disabled={loading}
          aria-label="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="time" tick={{ fill: chartColors.text }} stroke={chartColors.grid} fontSize={12} />
            <YAxis tick={{ fill: chartColors.text }} stroke={chartColors.grid} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltip,
                borderColor: chartColors.grid,
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: chartColors.text }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: chartColors.text }} />
            <Line
              type="monotone"
              dataKey="cpu"
              name="CPU %"
              stroke={chartColors.cpu}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="memory"
              name="Memory %"
              stroke={chartColors.memory}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="network"
              name="Network KB/s"
              stroke={chartColors.network}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      )}
    </div>
  )
}

export default SystemPerformance


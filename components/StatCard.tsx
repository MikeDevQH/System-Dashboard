import type React from "react"

interface StatCardProps {
  title: string
  value: string
  unit?: string
  icon?: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon }) => {
  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-primary">
        {value} <span className="text-muted-foreground text-lg">{unit}</span>
      </p>
      <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(Number.parseFloat(value), 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

export default StatCard


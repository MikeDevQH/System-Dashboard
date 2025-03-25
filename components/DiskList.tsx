import type React from "react"
import { HardDrive } from "lucide-react"

interface Disk {
  name: string
  used: number
  total: number
  type: string
}

interface DiskListProps {
  disks: Disk[]
}

const DiskList: React.FC<DiskListProps> = ({ disks }) => {
  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Storage</h2>
        <HardDrive className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {disks.map((disk, index) => {
          const usagePercent = ((disk.used / disk.total) * 100).toFixed(2)
          const usageGB = (disk.used / 1024 / 1024 / 1024).toFixed(1)
          const totalGB = (disk.total / 1024 / 1024 / 1024).toFixed(1)

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  {disk.name} <span className="text-muted-foreground">({disk.type})</span>
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {usageGB} GB / {totalGB} GB
                </p>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    Number.parseFloat(usagePercent) > 80
                      ? "bg-red-500"
                      : Number.parseFloat(usagePercent) > 60
                        ? "bg-yellow-500"
                        : "bg-primary"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DiskList


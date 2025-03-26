import type React from "react"
import { HardDrive, AlertCircle, CheckCircle2 } from "lucide-react"

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
  // Calculate total storage metrics
  const totalUsed = disks.reduce((acc, disk) => acc + disk.used, 0)
  const totalCapacity = disks.reduce((acc, disk) => acc + disk.total, 0)
  const totalUsagePercent = totalCapacity > 0 ? ((totalUsed / totalCapacity) * 100).toFixed(2) : "0"
  const totalUsedGB = (totalUsed / 1024 / 1024 / 1024).toFixed(1)
  const totalCapacityGB = (totalCapacity / 1024 / 1024 / 1024).toFixed(1)

  // Get unique file systems from disks
  const fileSystemTypes = [...new Set(disks.map((disk) => disk.type))].join("/")

  return (
    <div className="card p-6 animate-enter h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Storage</h2>
        <HardDrive className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {disks.map((disk, index) => {
          const usagePercent = ((disk.used / disk.total) * 100).toFixed(2)
          const usageGB = (disk.used / 1024 / 1024 / 1024).toFixed(1)
          const totalGB = (disk.total / 1024 / 1024 / 1024).toFixed(1)

          // Determine health status based on usage
          const diskHealth =
            Number(usagePercent) > 90
              ? { status: "Warning", icon: <AlertCircle className="h-3 w-3 text-yellow-500" /> }
              : { status: "Healthy", icon: <CheckCircle2 className="h-3 w-3 text-green-500" /> }

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

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(Number(usagePercent))}% used</span>
                <div className="flex items-center gap-1">
                  {diskHealth.icon}
                  <span>{diskHealth.status}</span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Total storage summary with progress bar */}
        {disks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Storage</span>
              <span className="text-sm text-muted-foreground">
                {totalUsedGB} GB / {totalCapacityGB} GB
              </span>
            </div>

            {/* Total storage progress bar */}
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  Number.parseFloat(totalUsagePercent) > 80
                    ? "bg-red-500"
                    : Number.parseFloat(totalUsagePercent) > 60
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${totalUsagePercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(Number(totalUsagePercent))}% of total capacity used</span>
              <span>
                {disks.length} drive{disks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Additional storage info */}
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
              <div>
                File System: <span className="text-primary">{fileSystemTypes}</span>
              </div>
              <div>
                Mount Points: <span className="text-primary">{disks.length}</span>
              </div>

              {/* Display average disk size */}
              {disks.length > 0 && (
                <div>
                  Avg. Disk Size:{" "}
                  <span className="text-primary">
                    {(totalCapacity / disks.length / 1024 / 1024 / 1024).toFixed(1)} GB
                  </span>
                </div>
              )}

              {/* Display free space */}
              <div>
                Free Space:{" "}
                <span className="text-primary">
                  {(totalCapacity - totalUsed) / 1024 / 1024 / 1024 > 1
                    ? ((totalCapacity - totalUsed) / 1024 / 1024 / 1024).toFixed(1) + " GB"
                    : ((totalCapacity - totalUsed) / 1024 / 1024).toFixed(0) + " MB"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiskList


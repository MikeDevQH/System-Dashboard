import { NextResponse } from "next/server"
import os from "os"
import si from "systeminformation"

export async function GET() {
  try {
    // Get CPU information
    const cpuInfo = await si.cpu()

    // Get memory information
    const memInfo = await si.mem()

    // Format the data
    const systemInfo = {
      cpuModel: cpuInfo.manufacturer + " " + cpuInfo.brand,
      cpuCores: cpuInfo.physicalCores,
      cpuThreads: cpuInfo.cores,
      cpuSpeed: cpuInfo.speed,
      memoryTotal: Math.round(memInfo.total / 1024 / 1024 / 1024), // Convert to GB
      architecture: os.arch(),
      platform: os.platform(),
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    console.error("Error getting system information:", error)
    return NextResponse.json(
      {
        error: "Failed to retrieve system information",
      },
      { status: 500 },
    )
  }
}


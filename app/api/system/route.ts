import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const network = await si.networkStats();
  const disk = await si.fsSize();
  const uptime = si.time().uptime;

  return NextResponse.json({
    cpuUsage: cpu.currentLoad.toFixed(2),
    memoryUsage: ((mem.used / mem.total) * 100).toFixed(2),
    networkSpeed: network[0]?.rx_sec || 0, // Velocidad de descarga en bytes/sec
    networkLatency: network[0]?.ms || 0, // Latencia en ms
    disks: disk.map((d) => ({
      name: d.fs,
      used: d.used,
      total: d.size,
      type: d.type,
    })),
    uptime,
  });
}

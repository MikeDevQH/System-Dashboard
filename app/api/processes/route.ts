import { NextResponse } from "next/server";
import { exec } from "child_process";
import os from "os";

export async function GET() {
  return new Promise((resolve) => {
    let command: string;

    if (os.platform() === "win32") {
      
      command = `powershell -Command "Get-Process | Select-Object Id,ProcessName,CPU,WS,MainWindowTitle | ConvertTo-Json"`;
    } else {
      command = `ps -eo pid,comm,user,%cpu,%mem,stat --no-headers`;
    }

    exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout) => {
      if (error || !stdout) {
        console.error("Error ejecutando comando:", error);
        return resolve(NextResponse.json([], { status: 200 }));
      }

      try {
        let processes = [];

        if (os.platform() === "win32") {
          processes = JSON.parse(stdout).map((proc: any) => ({
            pid: proc.Id || "N/A",
            name: proc.ProcessName || "Desconocido",
            user: "N/A",
            cpu: proc.CPU ? proc.CPU.toFixed(2) : "0",
            memory: proc.WS ? (proc.WS / 1024 / 1024).toFixed(2) : "0",
            status: proc.MainWindowTitle ? "Activo" : "En segundo plano",
          }));
        } else {
          processes = stdout
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
              const parts = line.trim().split(/\s+/);
              return {
                pid: parts[0] || "N/A",
                name: parts[1] || "Desconocido",
                user: parts[2] || "N/A",
                cpu: parts[3] || "0",
                memory: parts[4] || "0",
                status: parts[5] || "N/A",
              };
            });
        }

        return resolve(NextResponse.json(processes, { status: 200 }));
      } catch (parseError) {
        console.error("Error procesando datos:", parseError);
        return resolve(NextResponse.json([], { status: 200 }));
      }
    });
  });
}

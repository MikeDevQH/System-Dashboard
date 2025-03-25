"use client"
import { useEffect, useState } from "react"
import { Cpu, Search, RefreshCw } from "lucide-react"

interface Process {
  pid: string | number
  name: string
  user: string
  cpu: string
  memory: string
  status: string
}

export default function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const processesPerPage = 6

  const fetchProcesses = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/processes")
      if (!res.ok) throw new Error("Error al obtener los procesos")

      const data: Process[] = await res.json()
      setProcesses(data)
    } catch (error) {
      setError("No se pudieron obtener los procesos.")
      console.error("Error al obtener procesos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProcesses() // Carga inicial

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchProcesses, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filtrar procesos por término de búsqueda
  const filteredProcesses = processes.filter(
    (proc) =>
      proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(proc.pid).includes(searchTerm) // Convertir pid a string para evitar errores
  )

  const totalPages = Math.ceil(filteredProcesses.length / processesPerPage)
  const paginatedProcesses = filteredProcesses.slice(
    currentPage * processesPerPage,
    (currentPage + 1) * processesPerPage
  )

  return (
    <div className="card p-6 animate-enter">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Active Processes</h2>
          <Cpu className="h-5 w-5 text-primary" />
        </div>

        <button
          onClick={fetchProcesses}
          className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
          disabled={loading}
          aria-label="Refresh processes"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search processes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(0) // Reset to first page on search
          }}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {filteredProcesses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No matching processes found." : "No processes available."}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left  font-extrabold text-base text-muted-foreground uppercase tracking-wider">
                  PID
                </th>
                <th className="px-6 py-3 text-left  font-extrabold text-base text-muted-foreground uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left  font-extrabold text-base text-muted-foreground uppercase tracking-wider">
                  CPU%
                </th>
                <th className="px-6 py-3 text-left  font-extrabold text-base text-muted-foreground uppercase tracking-wider">
                  Memory
                </th>
                <th className="px-6 py-3 text-left  font-extrabold text-base text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProcesses.map((proc) => (
                <tr key={proc.pid} className="hover:bg-border/20 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono">{proc.pid}</td>
                  <td className="px-6 py-3 text-sm font-medium">{proc.name}</td>
                  <td className="px-6 py-3 text-sm">{proc.cpu}%</td>
                  <td className="px-6 py-3 text-sm">{proc.memory} MB</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        proc.status.toLowerCase().includes("activ")
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-border">
              <button
                className="px-3 py-1 rounded-md border border-border text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="px-3 py-1 rounded-md border border-border text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, HelpCircle, ThumbsDown, ThumbsUp, X } from "lucide-react"
import type { Participacion } from "@/lib/types"

type EstadoFiltro = "pendiente" | "aprobado" | "rechazado"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

const posicionConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  apoyo: { label: "Apoya", icon: ThumbsUp, color: "text-verde-600" },
  no_apoyo: { label: "No apoya", icon: ThumbsDown, color: "text-red-600" },
  necesito_info: { label: "Necesita info", icon: HelpCircle, color: "text-amber-600" },
}

export default function AdminComentariosPage() {
  const [filtro, setFiltro] = useState<EstadoFiltro>("pendiente")
  const [items, setItems] = useState<Participacion[]>([])
  const [error, setError] = useState("")

  async function load() {
    try {
      const res = await fetch("/api/admin/cms?resource=participaciones")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data.filter((p: Participacion) => p.comentario))
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los comentarios")
    }
  }

  useEffect(() => { load() }, [])

  async function cambiarEstado(id: string, nuevoEstado: "aprobado" | "rechazado") {
    const res = await fetch("/api/admin/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "participaciones", id, changes: { estado_comentario: nuevoEstado } }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo moderar el comentario")
    setItems(prev => prev.map(p => p.id === id ? { ...p, estadoComentario: nuevoEstado } : p))
  }

  const comentarios = items.filter(p => p.estadoComentario === filtro)
  const cuentas = useMemo(() => ({
    pendiente: items.filter(p => p.estadoComentario === "pendiente").length,
    aprobado: items.filter(p => p.estadoComentario === "aprobado").length,
    rechazado: items.filter(p => p.estadoComentario === "rechazado").length,
  }), [items])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title mb-2">Moderacion de Comentarios</h1>
        <p className="text-gray-500 text-sm">Revisa y modera los comentarios antes de que aparezcan publicamente en el sitio.</p>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      <div className="flex gap-2 mb-8">
        {(["pendiente", "aprobado", "rechazado"] as EstadoFiltro[]).map(estado => (
          <button key={estado} onClick={() => setFiltro(estado)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            filtro === estado ? estado === "pendiente" ? "bg-amber-500 text-white" : estado === "aprobado" ? "bg-verde-600 text-white" : "bg-red-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          }`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filtro === estado ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}>{cuentas[estado]}</span>
          </button>
        ))}
      </div>

      {comentarios.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p className="font-medium">No hay comentarios {filtro}</p></div>
      ) : (
        <div className="space-y-4">
          {comentarios.map(p => {
            const cfg = posicionConfig[p.posicion]
            const Icon = cfg.icon
            return (
              <div key={p.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-verde-100 rounded-full flex items-center justify-center text-verde-700 text-sm font-bold">{p.nombre.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.nombre}</p>
                        <p className="text-gray-400 text-xs">{p.comuna} - {formatDate(p.fecha)}</p>
                      </div>
                      <span className={`badge text-xs flex items-center gap-1 ml-auto sm:ml-0 ${cfg.color}`}><Icon className="w-3 h-3" />{cfg.label}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 ml-12"><p className="text-gray-700 text-sm leading-relaxed">&ldquo;{p.comentario}&rdquo;</p></div>
                  </div>
                  {filtro === "pendiente" && (
                    <div className="flex gap-2 sm:flex-col sm:w-auto w-full">
                      <button onClick={() => cambiarEstado(p.id, "aprobado")} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-verde-600 hover:bg-verde-700 text-white rounded-xl text-sm font-semibold"><Check className="w-4 h-4" />Aprobar</button>
                      <button onClick={() => cambiarEstado(p.id, "rechazado")} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold"><X className="w-4 h-4" />Rechazar</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

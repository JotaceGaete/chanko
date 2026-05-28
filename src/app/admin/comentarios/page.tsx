"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react"
import { participaciones as partData } from "@/lib/mock-data"

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
  const [estados, setEstados] = useState<Record<string, "pendiente" | "aprobado" | "rechazado">>(
    Object.fromEntries(partData.filter(p => p.comentario).map(p => [p.id, p.estadoComentario]))
  )

  function cambiarEstado(id: string, nuevoEstado: "aprobado" | "rechazado") {
    setEstados(prev => ({ ...prev, [id]: nuevoEstado }))
  }

  const comentarios = partData
    .filter(p => p.comentario && estados[p.id] === filtro)

  const cuentas = {
    pendiente: Object.values(estados).filter(e => e === "pendiente").length,
    aprobado: Object.values(estados).filter(e => e === "aprobado").length,
    rechazado: Object.values(estados).filter(e => e === "rechazado").length,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administración
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title mb-2">Moderación de Comentarios</h1>
        <p className="text-gray-500 text-sm">Revisa y modera los comentarios antes de que aparezcan públicamente en el sitio.</p>
      </div>

      {/* Tab filters */}
      <div className="flex gap-2 mb-8">
        {(["pendiente", "aprobado", "rechazado"] as EstadoFiltro[]).map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              filtro === estado
                ? estado === "pendiente" ? "bg-amber-500 text-white"
                  : estado === "aprobado" ? "bg-verde-600 text-white"
                  : "bg-red-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              filtro === estado ? "bg-white/20" : "bg-gray-100 text-gray-600"
            }`}>
              {cuentas[estado]}
            </span>
          </button>
        ))}
      </div>

      {comentarios.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">No hay comentarios {filtro === "pendiente" ? "pendientes" : filtro === "aprobado" ? "aprobados" : "rechazados"}</p>
        </div>
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
                      <div className="w-9 h-9 bg-verde-100 rounded-full flex items-center justify-center text-verde-700 text-sm font-bold">
                        {p.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.nombre}</p>
                        <p className="text-gray-400 text-xs">{p.comuna} · {formatDate(p.fecha)}</p>
                      </div>
                      <span className={`badge text-xs flex items-center gap-1 ml-auto sm:ml-0 ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 ml-12">
                      <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{p.comentario}&rdquo;</p>
                    </div>
                  </div>
                  {filtro === "pendiente" && (
                    <div className="flex gap-2 sm:flex-col sm:w-auto w-full">
                      <button
                        onClick={() => cambiarEstado(p.id, "aprobado")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-verde-600 hover:bg-verde-700 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => cambiarEstado(p.id, "rechazado")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Rechazar
                      </button>
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

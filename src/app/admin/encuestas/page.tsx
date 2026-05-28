"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Eye, Calendar, ClipboardList } from "lucide-react"
import { encuestas as encuestasData } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminEncuestasPage() {
  const [items, setItems] = useState(encuestasData)

  function toggleActiva(id: string) {
    setItems(prev => prev.map(e => e.id === id ? { ...e, activa: !e.activa } : e))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administración
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestión de Encuestas</h1>
        <button className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nueva encuesta
        </button>
      </div>

      <div className="space-y-4">
        {items.map(encuesta => (
          <div key={encuesta.id} className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${encuesta.activa ? "badge-verde" : "badge-gray"}`}>
                    {encuesta.activa ? "Activa" : "Cerrada"}
                  </span>
                  <span className="badge-gray">{encuesta.preguntas.length} preguntas</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{encuesta.titulo}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{encuesta.descripcion}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Inicio: {formatDate(encuesta.fechaInicio)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Cierre: {formatDate(encuesta.fechaFin)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/encuestas/${encuesta.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Vista previa">
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => toggleActiva(encuesta.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    encuesta.activa
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-verde-100 text-verde-700 hover:bg-verde-200"
                  }`}
                >
                  {encuesta.activa ? "Cerrar" : "Activar"}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

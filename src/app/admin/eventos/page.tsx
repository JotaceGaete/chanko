"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Calendar, MapPin } from "lucide-react"
import { eventos as eventosData } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminEventosPage() {
  const [items, setItems] = useState(eventosData)

  function togglePublicado(id: string) {
    setItems(prev => prev.map(e => e.id === id ? { ...e, publicado: !e.publicado } : e))
  }

  const tipoLabel: Record<string, string> = { presencial: "Presencial", virtual: "Online", hibrido: "Híbrido" }
  const tipoBadge: Record<string, string> = { presencial: "badge-verde", virtual: "badge-tierra", hibrido: "badge-gray" }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administración
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestión de Eventos</h1>
        <button className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nuevo evento
        </button>
      </div>

      <div className="space-y-4">
        {items.map(evento => (
          <div key={evento.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`badge ${tipoBadge[evento.tipo]}`}>{tipoLabel[evento.tipo]}</span>
                  <span className={`badge ${evento.publicado ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>
                    {evento.publicado ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{evento.titulo}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-verde-600" />{formatDate(evento.fecha)} · {evento.hora}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-verde-600" />{evento.lugar}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/eventos/${evento.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </Link>
                <button onClick={() => togglePublicado(evento.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600">
                  {evento.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-verde-500" />}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600">
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

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Newspaper } from "lucide-react"
import { noticias as noticiasData } from "@/lib/mock-data"
import type { Noticia } from "@/lib/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminNoticiasPage() {
  const [items, setItems] = useState(noticiasData)

  function togglePublicada(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, publicada: !n.publicada } : n))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administración
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestión de Noticias</h1>
        <button className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nueva noticia
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: items.length },
          { label: "Publicadas", value: items.filter(n => n.publicada).length },
          { label: "Borradores", value: items.filter(n => !n.publicada).length },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Noticia</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(noticia => (
                <tr key={noticia.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image src={noticia.imagen} alt={noticia.titulo} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{noticia.titulo}</p>
                        <p className="text-gray-400 text-xs">{noticia.autor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="badge-verde text-xs">{noticia.categoria}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {formatDate(noticia.fecha)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${noticia.publicada ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>
                      {noticia.publicada ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/noticias/${noticia.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Vista previa"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => togglePublicada(noticia.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600 transition-colors"
                        title={noticia.publicada ? "Despublicar" : "Publicar"}
                      >
                        {noticia.publicada ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-verde-500" />}
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

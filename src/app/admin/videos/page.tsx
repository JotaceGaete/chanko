"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Play } from "lucide-react"
import { videos as videosData } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminVideosPage() {
  const [items, setItems] = useState(videosData)

  function togglePublicado(id: string) {
    setItems(prev => prev.map(v => v.id === id ? { ...v, publicado: !v.publicado } : v))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administración
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestión de Videos</h1>
        <button className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nuevo video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(video => (
          <div key={video.id} className="card p-4">
            <div className="flex gap-4">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                <Image src={video.thumbnail} alt={video.titulo} fill className="object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="badge-gray text-xs mb-1 inline-block">{video.categoria}</span>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{video.titulo}</h3>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(video.fecha)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`badge text-xs ${video.publicado ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>
                    {video.publicado ? "Publicado" : "Borrador"}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    <button onClick={() => togglePublicado(video.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600">
                      {video.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-verde-500" />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

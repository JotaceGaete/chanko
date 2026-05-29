"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Eye, EyeOff, Play, Plus, Save, Trash2, X } from "lucide-react"
import type { Video } from "@/lib/types"

function extractYoutubeId(value: string) {
  const trimmed = value.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  return [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ].map(pattern => trimmed.match(pattern)?.[1]).find(Boolean) || ""
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminVideosPage() {
  const [items, setItems] = useState<Video[]>([])
  const [editing, setEditing] = useState<Partial<Video> & { youtubeUrl?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const previewId = useMemo(() => extractYoutubeId(editing?.youtubeUrl || editing?.youtubeId || ""), [editing])

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms?resource=videos")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "videos", ...editing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el video")
    } finally {
      setSaving(false)
    }
  }

  async function patch(video: Video, changes: Partial<Video>) {
    const res = await fetch("/api/admin/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "videos", id: video.id, changes }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo actualizar el video")
    setItems(prev => prev.map(item => item.id === video.id ? data : item))
  }

  async function remove(video: Video) {
    if (!confirm(`Archivar "${video.titulo}"?`)) return
    const res = await fetch(`/api/admin/cms?resource=videos&id=${video.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo archivar el video")
    setItems(prev => prev.filter(item => item.id !== video.id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestion de Videos</h1>
        <button onClick={() => setEditing({ titulo: "", descripcion: "", youtubeUrl: "", fecha: new Date().toISOString().slice(0, 10), categoria: "General", publicado: false })} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nuevo video
        </button>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      {editing && (
        <form onSubmit={save} className="card p-5 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{editing.id ? "Editar video" : "Nuevo video"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Titulo" value={editing.titulo || ""} onChange={e => setEditing(v => ({ ...v, titulo: e.target.value }))} required />
            <input className="input-field" placeholder="Categoria" value={editing.categoria || ""} onChange={e => setEditing(v => ({ ...v, categoria: e.target.value }))} required />
            <input className="input-field" type="date" value={editing.fecha || ""} onChange={e => setEditing(v => ({ ...v, fecha: e.target.value }))} required />
            <input className="input-field" placeholder="URL de YouTube" value={editing.youtubeUrl || editing.youtubeId || ""} onChange={e => setEditing(v => ({ ...v, youtubeUrl: e.target.value }))} required />
          </div>
          <textarea className="input-field resize-none" rows={4} placeholder="Descripcion" value={editing.descripcion || ""} onChange={e => setEditing(v => ({ ...v, descripcion: e.target.value }))} required />
          {previewId && (
            <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-gray-900">
              <Image src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="Preview" fill className="object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center"><Play className="w-8 h-8 text-white" /></div>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={Boolean(editing.publicado)} onChange={e => setEditing(v => ({ ...v, publicado: e.target.checked }))} />
            Publicado
          </label>
          <button disabled={saving} className="btn-primary"><Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar video"}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-gray-400 text-sm">Cargando videos...</p> : items.length === 0 ? <p className="text-gray-400 text-sm">No hay videos creados.</p> : items.map(video => (
          <div key={video.id} className="card p-4">
            <div className="flex gap-4">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                <Image src={video.thumbnail} alt={video.titulo} fill className="object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center"><Play className="w-5 h-5 text-white" /></div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="badge-gray text-xs mb-1 inline-block">{video.categoria}</span>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{video.titulo}</h3>
                <p className="text-gray-400 text-xs mt-1">{formatDate(video.fecha)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`badge text-xs ${video.publicado ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>{video.publicado ? "Publicado" : "Borrador"}</span>
                  <div className="flex gap-1 ml-auto">
                    <button onClick={() => patch(video, { publicado: !video.publicado })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600">{video.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-verde-500" />}</button>
                    <button onClick={() => setEditing({ ...video, youtubeUrl: video.youtubeId })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(video)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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

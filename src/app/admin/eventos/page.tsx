"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Edit, Eye, EyeOff, MapPin, Plus, Save, Trash2, X } from "lucide-react"
import type { Evento } from "@/lib/types"

const emptyEvento: Partial<Evento> = {
  titulo: "",
  slug: "",
  descripcion: "",
  imagen: "",
  fecha: new Date().toISOString().slice(0, 10),
  hora: "10:00",
  lugar: "",
  region: "Biobio",
  tipo: "presencial",
  inscripcionUrl: "",
  publicado: false,
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminEventosPage() {
  const [items, setItems] = useState<Evento[]>([])
  const [editing, setEditing] = useState<Partial<Evento> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms?resource=eventos")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los eventos")
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
        body: JSON.stringify({ resource: "eventos", ...editing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el evento")
    } finally {
      setSaving(false)
    }
  }

  async function patch(evento: Evento, changes: Partial<Evento>) {
    const res = await fetch("/api/admin/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "eventos", id: evento.id, changes }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo actualizar el evento")
    setItems(prev => prev.map(item => item.id === evento.id ? data : item))
  }

  async function uploadImage(file: File) {
    if (!editing) return
    setUploading(true)
    setError("")
    try {
      const data = new FormData()
      data.set("file", file)
      data.set("folder", "eventos")
      data.set("previousUrl", editing.imagen || "")
      const res = await fetch("/api/admin/upload", { method: "POST", body: data })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error)
      setEditing(v => ({ ...v, imagen: payload.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  async function remove(evento: Evento) {
    if (!confirm(`Archivar "${evento.titulo}"?`)) return
    const res = await fetch(`/api/admin/cms?resource=eventos&id=${evento.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo archivar el evento")
    setItems(prev => prev.filter(item => item.id !== evento.id))
  }

  const tipoLabel: Record<string, string> = { presencial: "Presencial", online: "Online", virtual: "Online", hibrido: "Hibrido" }
  const tipoBadge: Record<string, string> = { presencial: "badge-verde", online: "badge-tierra", virtual: "badge-tierra", hibrido: "badge-gray" }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestion de Eventos</h1>
        <button onClick={() => setEditing(emptyEvento)} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nuevo evento
        </button>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      {editing && (
        <form onSubmit={save} className="card p-5 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{editing.id ? "Editar evento" : "Nuevo evento"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Titulo" value={editing.titulo || ""} onChange={e => setEditing(v => ({ ...v, titulo: e.target.value }))} required />
            <input className="input-field" placeholder="Slug opcional" value={editing.slug || ""} onChange={e => setEditing(v => ({ ...v, slug: e.target.value }))} />
            <input className="input-field" type="date" value={editing.fecha || ""} onChange={e => setEditing(v => ({ ...v, fecha: e.target.value }))} required />
            <input className="input-field" type="time" value={editing.hora || ""} onChange={e => setEditing(v => ({ ...v, hora: e.target.value }))} required />
            <input className="input-field" placeholder="Lugar o direccion" value={editing.lugar || ""} onChange={e => setEditing(v => ({ ...v, lugar: e.target.value }))} required />
            <input className="input-field" placeholder="Region" value={editing.region || ""} onChange={e => setEditing(v => ({ ...v, region: e.target.value }))} required />
            <select className="input-field" value={editing.tipo || "presencial"} onChange={e => setEditing(v => ({ ...v, tipo: e.target.value as Evento["tipo"] }))}>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="hibrido">Hibrido</option>
            </select>
            <input className="input-field" placeholder="Link externo o inscripcion" value={editing.inscripcionUrl || ""} onChange={e => setEditing(v => ({ ...v, inscripcionUrl: e.target.value }))} />
            <input className="input-field md:col-span-2" placeholder="URL imagen" value={editing.imagen || ""} onChange={e => setEditing(v => ({ ...v, imagen: e.target.value }))} />
          </div>
          <div>
            <label className="label">Subir imagen</label>
            <input className="input-field" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            {uploading && <p className="text-xs text-gray-400 mt-1">Subiendo imagen...</p>}
            {editing.imagen && <p className="text-xs text-gray-400 mt-1 break-all">{editing.imagen}</p>}
            {editing.imagen && (
              <div className="relative mt-3 h-40 max-w-sm rounded-xl overflow-hidden bg-gray-100">
                <Image src={editing.imagen} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          <textarea className="input-field resize-none" rows={5} placeholder="Descripcion" value={editing.descripcion || ""} onChange={e => setEditing(v => ({ ...v, descripcion: e.target.value }))} required />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={Boolean(editing.publicado)} onChange={e => setEditing(v => ({ ...v, publicado: e.target.checked }))} />
            Publicado
          </label>
          <button disabled={saving} className="btn-primary"><Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar evento"}</button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? <div className="text-gray-400 text-sm">Cargando eventos...</div> : items.length === 0 ? <div className="text-gray-400 text-sm">No hay eventos creados.</div> : items.map(evento => (
          <div key={evento.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`badge ${tipoBadge[evento.tipo]}`}>{tipoLabel[evento.tipo]}</span>
                  <span className={`badge ${evento.publicado ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>{evento.publicado ? "Publicado" : "Borrador"}</span>
                </div>
                <h3 className="font-bold text-gray-900">{evento.titulo}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-verde-600" />{formatDate(evento.fecha)} - {evento.hora}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-verde-600" />{evento.lugar}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/eventos/${evento.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-4 h-4" /></Link>
                <button onClick={() => patch(evento, { publicado: !evento.publicado })} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600">{evento.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-verde-500" />}</button>
                <button onClick={() => setEditing(evento)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => remove(evento)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Archivar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

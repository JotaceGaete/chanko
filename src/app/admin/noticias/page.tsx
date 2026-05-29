"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Eye, EyeOff, Plus, Save, Trash2, X } from "lucide-react"
import type { Noticia } from "@/lib/types"

const emptyNoticia: Partial<Noticia> = {
  titulo: "",
  slug: "",
  resumen: "",
  contenido: "",
  bloques: [],
  imagen: "",
  fecha: new Date().toISOString().slice(0, 10),
  categoria: "General",
  autor: "ChankoCiudadano",
  publicada: false,
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminNoticiasPage() {
  const [items, setItems] = useState<Noticia[]>([])
  const [editing, setEditing] = useState<Partial<Noticia> | null>(null)
  const [bloquesJson, setBloquesJson] = useState("[]")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms?resource=noticias")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las noticias")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openForm(item?: Noticia) {
    const value = item || emptyNoticia
    setEditing(value)
    setBloquesJson(JSON.stringify(value.bloques || [], null, 2))
    setError("")
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      let bloques: unknown[] = []
      try {
        const parsed = JSON.parse(bloquesJson || "[]")
        if (!Array.isArray(parsed)) throw new Error()
        bloques = parsed
      } catch {
        throw new Error("Los bloques deben ser un JSON valido con formato de arreglo")
      }
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "noticias", ...editing, bloques }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la noticia")
    } finally {
      setSaving(false)
    }
  }

  async function togglePublicada(noticia: Noticia) {
    setError("")
    const res = await fetch("/api/admin/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "noticias", id: noticia.id, changes: { publicada: !noticia.publicada } }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo cambiar el estado")
    setItems(prev => prev.map(item => item.id === noticia.id ? data : item))
  }

  async function uploadImage(file: File) {
    if (!editing) return
    setUploading(true)
    setError("")
    try {
      const data = new FormData()
      data.set("file", file)
      data.set("folder", "noticias")
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

  async function remove(noticia: Noticia) {
    if (!confirm(`Archivar "${noticia.titulo}"?`)) return
    setError("")
    const res = await fetch(`/api/admin/cms?resource=noticias&id=${noticia.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo archivar la noticia")
    setItems(prev => prev.filter(item => item.id !== noticia.id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestion de Noticias</h1>
        <button onClick={() => openForm()} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nueva noticia
        </button>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

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

      {editing && (
        <form onSubmit={save} className="card p-5 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{editing.id ? "Editar noticia" : "Nueva noticia"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Titulo" value={editing.titulo || ""} onChange={e => setEditing(v => ({ ...v, titulo: e.target.value }))} required />
            <input className="input-field" placeholder="Slug opcional" value={editing.slug || ""} onChange={e => setEditing(v => ({ ...v, slug: e.target.value }))} />
            <input className="input-field" placeholder="Categoria" value={editing.categoria || ""} onChange={e => setEditing(v => ({ ...v, categoria: e.target.value }))} required />
            <input className="input-field" placeholder="Autor" value={editing.autor || ""} onChange={e => setEditing(v => ({ ...v, autor: e.target.value }))} required />
            <input className="input-field" type="date" value={editing.fecha || ""} onChange={e => setEditing(v => ({ ...v, fecha: e.target.value }))} required />
            <input className="input-field" placeholder="URL imagen" value={editing.imagen || ""} onChange={e => setEditing(v => ({ ...v, imagen: e.target.value }))} />
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
          <textarea className="input-field resize-none" rows={3} placeholder="Resumen" value={editing.resumen || ""} onChange={e => setEditing(v => ({ ...v, resumen: e.target.value }))} required />
          <textarea className="input-field resize-none" rows={8} placeholder="Contenido HTML" value={editing.contenido || ""} onChange={e => setEditing(v => ({ ...v, contenido: e.target.value }))} required />
          <textarea className="input-field font-mono text-xs resize-none" rows={5} placeholder="Bloques JSONB []" value={bloquesJson} onChange={e => setBloquesJson(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={Boolean(editing.publicada)} onChange={e => setEditing(v => ({ ...v, publicada: e.target.checked }))} />
            Publicada
          </label>
          <button disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar noticia"}
          </button>
        </form>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Noticia</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td className="px-5 py-8 text-gray-400 text-sm" colSpan={5}>Cargando noticias...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="px-5 py-8 text-gray-400 text-sm" colSpan={5}>No hay noticias creadas.</td></tr>
              ) : items.map(noticia => (
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
                  <td className="px-4 py-4 hidden md:table-cell"><span className="badge-verde text-xs">{noticia.categoria}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">{formatDate(noticia.fecha)}</td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${noticia.publicada ? "bg-verde-100 text-verde-700" : "bg-gray-100 text-gray-500"}`}>
                      {noticia.publicada ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/noticias/${noticia.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => togglePublicada(noticia)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-verde-600">{noticia.publicada ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-verde-500" />}</button>
                      <button onClick={() => openForm(noticia)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => remove(noticia)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Archivar"><Trash2 className="w-4 h-4" /></button>
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

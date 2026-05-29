"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function AdminPortadaPage() {
  const [data, setData] = useState<any>({ config: {}, noticias: [], eventos: [], videos: [] })
  const [form, setForm] = useState({ noticia_id: "", evento_id: "", video_id: "" })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/admin/portada").then(res => res.json()).then(payload => {
      setData(payload)
      setForm({
        noticia_id: payload.config?.noticia_id || "",
        evento_id: payload.config?.evento_id || "",
        video_id: payload.config?.video_id || "",
      })
    }).catch(() => setMessage("No se pudo cargar la configuracion"))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/portada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error)
      setMessage("Portada guardada")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>
      <h1 className="section-title mb-8">Portada</h1>
      {message && <div className="mb-5 bg-verde-50 border border-verde-200 text-verde-700 rounded-xl p-3 text-sm">{message}</div>}
      <form onSubmit={save} className="card p-6 space-y-5">
        <div>
          <label className="label">Noticia destacada</label>
          <select className="input-field" value={form.noticia_id} onChange={e => setForm(v => ({ ...v, noticia_id: e.target.value }))}>
            <option value="">Ultima noticia publicada</option>
            {data.noticias?.map((n: any) => <option key={n.id} value={n.id}>{n.titulo}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Evento destacado</label>
          <select className="input-field" value={form.evento_id} onChange={e => setForm(v => ({ ...v, evento_id: e.target.value }))}>
            <option value="">Proximo evento publicado</option>
            {data.eventos?.map((n: any) => <option key={n.id} value={n.id}>{n.titulo}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Video destacado</label>
          <select className="input-field" value={form.video_id} onChange={e => setForm(v => ({ ...v, video_id: e.target.value }))}>
            <option value="">Ultimo video publicado</option>
            {data.videos?.map((n: any) => <option key={n.id} value={n.id}>{n.titulo}</option>)}
          </select>
        </div>
        <button className="btn-primary" disabled={saving}><Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar portada"}</button>
      </form>
    </div>
  )
}

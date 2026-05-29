"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, Eye, Plus, Save, Trash2, X } from "lucide-react"
import type { Encuesta, PreguntaEncuesta } from "@/lib/types"

const emptyQuestion: PreguntaEncuesta = { id: "", texto: "", tipo: "opcion_multiple", opciones: ["Si", "No"] }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminEncuestasPage() {
  const [items, setItems] = useState<Encuesta[]>([])
  const [editing, setEditing] = useState<Partial<Encuesta> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<Record<string, any[]>>({})

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms?resource=encuestas")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las encuestas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function newSurvey() {
    setEditing({
      titulo: "",
      slug: "",
      descripcion: "",
      fechaInicio: new Date().toISOString().slice(0, 10),
      fechaFin: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      activa: true,
      preguntas: [{ ...emptyQuestion }],
    })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "encuestas", ...editing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la encuesta")
    } finally {
      setSaving(false)
    }
  }

  async function toggleActiva(encuesta: Encuesta) {
    const res = await fetch("/api/admin/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "encuestas", id: encuesta.id, changes: { activa: !encuesta.activa } }),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo actualizar la encuesta")
    setItems(prev => prev.map(item => item.id === encuesta.id ? data : item))
  }

  async function remove(encuesta: Encuesta) {
    if (!confirm(`Archivar "${encuesta.titulo}"?`)) return
    const res = await fetch(`/api/admin/cms?resource=encuestas&id=${encuesta.id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudo archivar la encuesta")
    setItems(prev => prev.filter(item => item.id !== encuesta.id))
  }

  function updateQuestion(index: number, changes: Partial<PreguntaEncuesta>) {
    setEditing(prev => ({
      ...prev,
      preguntas: (prev?.preguntas || []).map((q, i) => i === index ? { ...q, ...changes } : q),
    }))
  }

  async function loadResults(id: string) {
    const res = await fetch(`/api/admin/encuestas/${id}/resultados`)
    const data = await res.json()
    if (!res.ok) return setError(data.error || "No se pudieron cargar los resultados")
    setResults(prev => ({ ...prev, [id]: data }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestion de Encuestas</h1>
        <button onClick={newSurvey} className="btn-primary text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Nueva encuesta
        </button>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      {editing && (
        <form onSubmit={save} className="card p-5 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{editing.id ? "Editar encuesta" : "Nueva encuesta"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Titulo" value={editing.titulo || ""} onChange={e => setEditing(v => ({ ...v, titulo: e.target.value }))} required />
            <input className="input-field" placeholder="Slug opcional" value={editing.slug || ""} onChange={e => setEditing(v => ({ ...v, slug: e.target.value }))} />
            <input className="input-field" type="date" value={editing.fechaInicio || ""} onChange={e => setEditing(v => ({ ...v, fechaInicio: e.target.value }))} required />
            <input className="input-field" type="date" value={editing.fechaFin || ""} onChange={e => setEditing(v => ({ ...v, fechaFin: e.target.value }))} required />
          </div>
          <textarea className="input-field resize-none" rows={3} placeholder="Descripcion" value={editing.descripcion || ""} onChange={e => setEditing(v => ({ ...v, descripcion: e.target.value }))} required />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Preguntas</h3>
              <button type="button" onClick={() => setEditing(v => ({ ...v, preguntas: [...(v?.preguntas || []), { ...emptyQuestion }] }))} className="btn-secondary text-sm py-2 px-3">
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
            {(editing.preguntas || []).map((pregunta, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="grid md:grid-cols-[1fr_180px_auto] gap-3">
                  <input className="input-field" placeholder="Texto de la pregunta" value={pregunta.texto} onChange={e => updateQuestion(index, { texto: e.target.value })} required />
                  <select className="input-field" value={pregunta.tipo} onChange={e => updateQuestion(index, { tipo: e.target.value as PreguntaEncuesta["tipo"], opciones: e.target.value === "escala" ? ["1", "2", "3", "4", "5"] : e.target.value === "texto_libre" ? [] : ["Si", "No"] })}>
                    <option value="opcion_multiple">Opcion unica</option>
                    <option value="escala">Escala</option>
                    <option value="texto_libre">Texto libre</option>
                  </select>
                  <button type="button" onClick={() => setEditing(v => ({ ...v, preguntas: (v?.preguntas || []).filter((_, i) => i !== index) }))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                {pregunta.tipo !== "texto_libre" && (
                  <input className="input-field" placeholder="Opciones separadas por coma" value={(pregunta.opciones || []).join(", ")} onChange={e => updateQuestion(index, { opciones: e.target.value.split(",").map(v => v.trim()).filter(Boolean) })} />
                )}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={Boolean(editing.activa)} onChange={e => setEditing(v => ({ ...v, activa: e.target.checked }))} />
            Activa
          </label>
          <button disabled={saving} className="btn-primary"><Save className="w-4 h-4" />{saving ? "Guardando..." : "Guardar encuesta"}</button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? <p className="text-gray-400 text-sm">Cargando encuestas...</p> : items.length === 0 ? <p className="text-gray-400 text-sm">No hay encuestas creadas.</p> : items.map(encuesta => (
          <div key={encuesta.id} className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${encuesta.activa ? "badge-verde" : "badge-gray"}`}>{encuesta.activa ? "Activa" : "Cerrada"}</span>
                  <span className="badge-gray">{encuesta.preguntas.length} preguntas</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{encuesta.titulo}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{encuesta.descripcion}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Inicio: {formatDate(encuesta.fechaInicio)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Cierre: {formatDate(encuesta.fechaFin)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/encuestas/${encuesta.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-4 h-4" /></Link>
                <button onClick={() => toggleActiva(encuesta)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${encuesta.activa ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-verde-100 text-verde-700 hover:bg-verde-200"}`}>{encuesta.activa ? "Cerrar" : "Activar"}</button>
                <button onClick={() => setEditing(encuesta)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => loadResults(encuesta.id)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">Resultados</button>
                <button onClick={() => remove(encuesta)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {results[encuesta.id] && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                {results[encuesta.id].map(p => (
                  <div key={p.id} className="text-sm">
                    <p className="font-semibold text-gray-800">{p.texto}</p>
                    <p className="text-gray-500">{p.respuestas.length} respuestas registradas</p>
                    {p.tipo !== "texto_libre" && p.opciones.map((opcion: string) => (
                      <p key={opcion} className="text-gray-500">{opcion}: {p.respuestas.filter((r: string) => r === opcion).length}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

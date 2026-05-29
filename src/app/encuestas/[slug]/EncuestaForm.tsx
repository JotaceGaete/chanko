"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Send } from "lucide-react"
import type { Encuesta } from "@/lib/types"
import Turnstile from "@/components/Turnstile"

export default function EncuestaForm({ encuesta }: { encuesta: Encuesta }) {
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/encuestas/${encuesta.slug}/respuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEnviado(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar tus respuestas")
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-verde-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-verde-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Gracias por participar</h2>
        <p className="text-gray-500 mb-8">Tu respuesta fue registrada.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/encuestas" className="btn-secondary">Ver mas encuestas</Link>
          <Link href="/apoya" className="btn-primary">Apoya la Iniciativa</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/encuestas" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver a Encuestas
        </Link>
      </div>

      <div className="mb-8">
        <span className="badge-verde mb-3 inline-block">Encuesta activa</span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{encuesta.titulo}</h1>
        <p className="text-gray-500 leading-relaxed">{encuesta.descripcion}</p>
      </div>

      {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {encuesta.preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="font-semibold text-gray-900 mb-4"><span className="text-verde-600 mr-2">{index + 1}.</span>{pregunta.texto}</p>

            {pregunta.tipo === "opcion_multiple" && pregunta.opciones && (
              <div className="space-y-3">
                {pregunta.opciones.map(opcion => (
                  <label key={opcion} className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer hover:bg-verde-50 has-[:checked]:border-verde-500 has-[:checked]:bg-verde-50 border-gray-200">
                    <input type="radio" name={pregunta.id} value={opcion} onChange={e => setRespuestas(prev => ({ ...prev, [pregunta.id]: e.target.value }))} className="w-4 h-4 text-verde-600 accent-verde-600" />
                    <span className="text-gray-700 text-sm">{opcion}</span>
                  </label>
                ))}
              </div>
            )}

            {pregunta.tipo === "escala" && pregunta.opciones && (
              <div className="flex gap-2">
                {pregunta.opciones.map(opcion => (
                  <label key={opcion} className="flex-1 text-center cursor-pointer">
                    <input type="radio" name={pregunta.id} value={opcion} onChange={e => setRespuestas(prev => ({ ...prev, [pregunta.id]: e.target.value }))} className="sr-only" />
                    <div className={`w-full py-3 rounded-xl border-2 font-bold text-sm ${respuestas[pregunta.id] === opcion ? "bg-verde-600 border-verde-600 text-white" : "border-gray-200 text-gray-500 hover:border-verde-400 hover:text-verde-700"}`}>{opcion}</div>
                  </label>
                ))}
              </div>
            )}

            {pregunta.tipo === "texto_libre" && (
              <textarea name={pregunta.id} rows={4} placeholder="Escribe tu respuesta aqui..." onChange={e => setRespuestas(prev => ({ ...prev, [pregunta.id]: e.target.value }))} className="input-field resize-none" />
            )}
          </div>
        ))}

        <div className="bg-verde-50 rounded-2xl p-5 border border-verde-100 text-sm text-verde-800">
          <strong className="block mb-1">Aviso de privacidad</strong>
          Tus respuestas son anonimas y se utilizaran unicamente para fines estadisticos.
        </div>

        <Turnstile onVerify={setTurnstileToken} />

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4">
          <Send className="w-5 h-5" />
          {loading ? "Enviando..." : "Enviar mis respuestas"}
        </button>
      </form>
    </div>
  )
}

import Link from "next/link"
import { Users, ThumbsUp, ThumbsDown, HelpCircle, ChevronRight, MessageSquare } from "lucide-react"
import { estadisticas } from "@/lib/mock-data"
import ResultadosCharts from "./ResultadosCharts"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
}

const posicionLabel: Record<string, string> = {
  apoyo: "Apoya",
  no_apoyo: "No apoya",
  necesito_info: "Necesita más info",
}

const posicionColor: Record<string, string> = {
  apoyo: "bg-verde-100 text-verde-800",
  no_apoyo: "bg-red-100 text-red-700",
  necesito_info: "bg-amber-100 text-amber-700",
}

export default function ResultadosPage() {
  const { total, apoyo, noApoyo, necesitaInfo, porComuna, porFecha, comentariosAprobados } = estadisticas

  const pctApoyo = Math.round((apoyo / total) * 100)
  const pctNoApoyo = Math.round((noApoyo / total) * 100)
  const pctNecesitaInfo = 100 - pctApoyo - pctNoApoyo

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Estadísticas de Participación</h1>
        <p className="text-gray-500">Resultados actualizados de la consulta ciudadana sobre la protección de los humedales del Biobío.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-verde-700" />
            </div>
            <span className="badge-verde">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{total.toLocaleString("es-CL")}</div>
          <p className="text-gray-500 text-sm mt-1">participaciones registradas</p>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-verde-700" />
            </div>
            <span className="badge-verde">{pctApoyo}%</span>
          </div>
          <div className="text-3xl font-bold text-verde-700">{apoyo.toLocaleString("es-CL")}</div>
          <p className="text-gray-500 text-sm mt-1">apoyan la iniciativa</p>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="badge-red">{pctNoApoyo}%</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{noApoyo.toLocaleString("es-CL")}</div>
          <p className="text-gray-500 text-sm mt-1">no apoyan la iniciativa</p>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="badge bg-amber-100 text-amber-700">{pctNecesitaInfo}%</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">{necesitaInfo.toLocaleString("es-CL")}</div>
          <p className="text-gray-500 text-sm mt-1">necesitan más información</p>
        </div>
      </div>

      {/* Charts */}
      <ResultadosCharts
        pctApoyo={pctApoyo}
        pctNoApoyo={pctNoApoyo}
        pctNecesitaInfo={pctNecesitaInfo}
        porComuna={porComuna}
        porFecha={porFecha}
      />

      {/* Comments */}
      {comentariosAprobados.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-verde-600" />
            <h2 className="text-xl font-bold text-gray-900">Voces ciudadanas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {comentariosAprobados.map(c => (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{c.nombre}</p>
                    <p className="text-gray-400 text-xs">{c.comuna}</p>
                  </div>
                  <span className={`badge text-xs ${posicionColor[c.posicion]}`}>
                    {posicionLabel[c.posicion]}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{c.comentario}&rdquo;</p>
                <p className="text-gray-300 text-xs mt-3">{formatDate(c.fecha)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-14 bg-verde-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">¿Aún no has participado?</h2>
        <p className="text-verde-200 mb-6">Tu voz es parte de estas estadísticas. Agrega tu posición y contribuye a este proceso ciudadano.</p>
        <Link href="/apoya" className="inline-flex items-center gap-2 bg-white text-verde-800 hover:bg-verde-50 font-semibold px-8 py-4 rounded-xl transition-colors shadow-md">
          <ChevronRight className="w-5 h-5" />
          Apoya la Iniciativa
        </Link>
      </div>
    </div>
  )
}

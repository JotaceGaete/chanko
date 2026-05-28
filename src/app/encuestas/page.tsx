import Link from "next/link"
import { Calendar, ChevronRight, CheckCircle, Clock } from "lucide-react"
import { encuestas } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
}

export default function EncuestasPage() {
  const activas = encuestas.filter(e => e.activa)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Encuestas Ciudadanas</h1>
        <p className="text-gray-500">Participa en nuestras encuestas y ayúdanos a entender mejor las necesidades y opiniones de la comunidad.</p>
      </div>

      {activas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No hay encuestas activas en este momento</p>
          <p className="text-sm mt-1">Vuelve pronto para participar en próximas encuestas.</p>
        </div>
      )}

      <div className="space-y-5">
        {activas.map(encuesta => (
          <div key={encuesta.id} className="card p-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-verde">Activa</span>
                  <span className="text-sm text-gray-400">{encuesta.preguntas.length} preguntas</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{encuesta.titulo}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{encuesta.descripcion}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-verde-600" />
                    Desde {formatDate(encuesta.fechaInicio)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-verde-600" />
                    Hasta el {formatDate(encuesta.fechaFin)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href={`/encuestas/${encuesta.slug}`} className="btn-primary">
                  <ChevronRight className="w-5 h-5" />
                  Participar
                </Link>
              </div>
            </div>

            {/* Preview questions */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Vista previa de preguntas</p>
              <ul className="space-y-2">
                {encuesta.preguntas.slice(0, 2).map((p, i) => (
                  <li key={p.id} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-verde-400 flex-shrink-0 mt-0.5" />
                    <span>{i + 1}. {p.texto}</span>
                  </li>
                ))}
                {encuesta.preguntas.length > 2 && (
                  <li className="text-sm text-gray-400 pl-6">+ {encuesta.preguntas.length - 2} más...</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

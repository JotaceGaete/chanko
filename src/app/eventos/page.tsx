import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Video, Users, ExternalLink } from "lucide-react"
import { eventos } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
}

const tipoLabel: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Online",
  hibrido: "Híbrido",
}

const tipoBadge: Record<string, string> = {
  presencial: "badge-verde",
  virtual: "badge-tierra",
  hibrido: "badge-gray",
}

export default function EventosPage() {
  const publicados = eventos.filter(e => e.publicado)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Eventos</h1>
        <p className="text-gray-500">Actividades, talleres, marchas y webinars sobre la protección de los humedales del Biobío.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["Todos", "Presencial", "Online", "Híbrido"].map(f => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              f === "Todos"
                ? "bg-verde-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-verde-400 hover:text-verde-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {publicados.map(evento => {
          const fechaObj = new Date(evento.fecha)
          const dia = fechaObj.getDate()
          const mes = fechaObj.toLocaleDateString("es-CL", { month: "short" }).toUpperCase()

          return (
            <div key={evento.id} className="card flex flex-col md:flex-row overflow-hidden group">
              {/* Date indicator */}
              <div className="md:hidden bg-verde-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-verde-700">{dia}</div>
                  <div className="text-verde-600 text-xs font-semibold">{mes}</div>
                </div>
                <span className={`badge ${tipoBadge[evento.tipo]}`}>{tipoLabel[evento.tipo]}</span>
              </div>

              {/* Image */}
              <div className="relative h-52 md:h-auto md:w-64 flex-shrink-0 overflow-hidden">
                <Image
                  src={evento.imagen}
                  alt={evento.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Desktop date overlay */}
                <div className="hidden md:flex absolute top-4 left-4 bg-white rounded-xl shadow-md p-3 flex-col items-center min-w-[60px]">
                  <span className="text-2xl font-bold text-verde-700">{dia}</span>
                  <span className="text-verde-600 text-xs font-semibold">{mes}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="hidden md:block mb-3">
                    <span className={`badge ${tipoBadge[evento.tipo]}`}>{tipoLabel[evento.tipo]}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{evento.titulo}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{evento.descripcion}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-verde-600 flex-shrink-0" />
                    <span>{formatDate(evento.fecha)} · {evento.hora} hrs.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {evento.tipo === "virtual" ? <Video className="w-4 h-4 text-verde-600 flex-shrink-0" /> : <MapPin className="w-4 h-4 text-verde-600 flex-shrink-0" />}
                    <span>{evento.lugar} · {evento.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <Link href={`/eventos/${evento.slug}`} className="btn-primary text-sm py-2.5 px-5">
                    Ver detalles
                  </Link>
                  {evento.inscripcionUrl && (
                    <a href={evento.inscripcionUrl} className="btn-secondary text-sm py-2.5 px-5">
                      <ExternalLink className="w-4 h-4" />
                      Inscribirse
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

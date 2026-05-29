import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, ChevronRight, Clock, ExternalLink, MapPin, Video } from "lucide-react"
import { getEvento } from "@/lib/cms"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const evento = await getEvento(params.slug).catch(() => null)
  if (!evento) return {}
  return {
    title: `${evento.titulo} | ChankoCiudadano`,
    description: evento.descripcion,
    openGraph: {
      title: evento.titulo,
      description: evento.descripcion,
      images: [{ url: evento.imagen, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: evento.titulo,
      description: evento.descripcion,
      images: [evento.imagen],
    },
  }
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const evento = await getEvento(params.slug).catch(() => null)
  if (!evento) notFound()

  const isOnline = evento.tipo === "online" || evento.tipo === "virtual"
  const tipoLabel = evento.tipo === "presencial" ? "Presencial" : isOnline ? "Online" : "Hibrido"
  const tipoBadge = evento.tipo === "presencial" ? "badge-verde" : isOnline ? "badge-tierra" : "badge-gray"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/eventos" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver a Eventos
        </Link>
      </div>

      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
        <Image src={evento.imagen} alt={evento.titulo} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <span className={`badge ${tipoBadge} mb-2 inline-block`}>{tipoLabel}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{evento.titulo}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre el evento</h2>
          <p className="text-gray-600 leading-relaxed">{evento.descripcion}</p>

          {!isOnline && (
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Ubicacion</h3>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 border border-gray-200">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{evento.lugar}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-verde-50 rounded-2xl p-6 border border-verde-100">
            <h3 className="font-bold text-verde-900 mb-4">Informacion del evento</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-verde-600 flex-shrink-0 mt-0.5" />
                <p className="font-semibold text-gray-800 capitalize">{formatDate(evento.fecha)}</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-verde-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{evento.hora} hrs.</p>
              </div>
              <div className="flex items-start gap-3">
                {isOnline ? <Video className="w-5 h-5 text-verde-600 flex-shrink-0 mt-0.5" /> : <MapPin className="w-5 h-5 text-verde-600 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-gray-700">{evento.lugar}</p>
                  <p className="text-gray-400 text-xs">{evento.region}</p>
                </div>
              </div>
            </div>

            {evento.inscripcionUrl ? (
              <a href={evento.inscripcionUrl} className="btn-primary w-full justify-center mt-5">
                <ExternalLink className="w-4 h-4" />
                Inscribirse al evento
              </a>
            ) : (
              <p className="mt-5 text-xs text-verde-700 bg-verde-100 rounded-xl p-3 text-center">Sin inscripcion previa. Entrada libre.</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Te importa este tema? Suma tu voz a la ciudadania.</p>
            <Link href="/apoya" className="btn-secondary text-sm w-full justify-center">
              <ChevronRight className="w-4 h-4" />
              Apoya la Iniciativa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

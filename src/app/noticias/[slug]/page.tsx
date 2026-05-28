import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Share2, ChevronRight } from "lucide-react"
import { noticias } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric", month: "long", year: "numeric"
  })
}

export function generateStaticParams() {
  return noticias.map(n => ({ slug: n.slug }))
}

export default function NoticiaPage({ params }: { params: { slug: string } }) {
  const noticia = noticias.find(n => n.slug === params.slug)
  if (!noticia) notFound()

  const relacionadas = noticias.filter(n => n.id !== noticia.id && n.publicada).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/noticias" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver a Noticias
        </Link>
      </div>

      <article>
        {/* Header */}
        <span className="badge-verde mb-4 inline-block">{noticia.categoria}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">{noticia.titulo}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-verde-600" />{noticia.autor}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-verde-600" />{formatDate(noticia.fecha)}</span>
          <button className="flex items-center gap-1.5 ml-auto hover:text-verde-600 transition-colors">
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </div>

        {/* Hero image */}
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
          <Image
            src={noticia.imagen}
            alt={noticia.titulo}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Summary */}
        <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 bg-verde-50 border-l-4 border-verde-500 p-5 rounded-r-xl">
          {noticia.resumen}
        </p>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>p]:mb-5"
          dangerouslySetInnerHTML={{ __html: noticia.contenido }}
        />
      </article>

      {/* CTA */}
      <div className="mt-12 bg-verde-50 rounded-2xl p-8 text-center border border-verde-100">
        <h3 className="text-xl font-bold text-verde-900 mb-2">¿Te importa este tema?</h3>
        <p className="text-verde-700 mb-5">Suma tu voz a la ciudadanía del Biobío y expresa tu posición sobre la protección de los humedales.</p>
        <Link href="/apoya" className="btn-primary">
          <ChevronRight className="w-5 h-5" />
          Apoya la Iniciativa
        </Link>
      </div>

      {/* Related */}
      {relacionadas.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Otras noticias relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relacionadas.map(n => (
              <Link key={n.id} href={`/noticias/${n.slug}`} className="card group">
                <div className="relative h-36 overflow-hidden">
                  <Image src={n.imagen} alt={n.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <span className="badge-verde mb-1.5 inline-block text-xs">{n.categoria}</span>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{n.titulo}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

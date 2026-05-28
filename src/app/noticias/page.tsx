import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User } from "lucide-react"
import { noticias } from "@/lib/mock-data"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric", month: "long", year: "numeric"
  })
}

const categorias = ["Todas", ...Array.from(new Set(noticias.map(n => n.categoria)))]

export default function NoticiasPage() {
  const publicadas = noticias.filter(n => n.publicada)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title mb-2">Noticias</h1>
        <p className="text-gray-500">Mantente informado sobre la situación de los humedales del Biobío y las acciones ciudadanas en curso.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === "Todas"
                ? "bg-verde-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-verde-400 hover:text-verde-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured article */}
      {publicadas[0] && (
        <Link href={`/noticias/${publicadas[0].slug}`} className="card group flex flex-col md:flex-row mb-8 overflow-hidden">
          <div className="relative h-56 md:h-auto md:w-1/2 flex-shrink-0">
            <Image
              src={publicadas[0].imagen}
              alt={publicadas[0].titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-7 flex flex-col justify-center">
            <span className="badge-verde mb-3 inline-block">{publicadas[0].categoria}</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">{publicadas[0].titulo}</h2>
            <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3">{publicadas[0].resumen}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{publicadas[0].autor}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(publicadas[0].fecha)}</span>
            </div>
            <span className="mt-4 text-verde-600 font-semibold text-sm flex items-center gap-1">
              Leer artículo completo <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicadas.slice(1).map(noticia => (
          <Link key={noticia.id} href={`/noticias/${noticia.slug}`} className="card group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={noticia.imagen}
                alt={noticia.titulo}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <span className="badge-verde mb-2 inline-block">{noticia.categoria}</span>
              <h3 className="font-bold text-gray-900 mb-2 leading-snug line-clamp-2">{noticia.titulo}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{noticia.resumen}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{noticia.autor}</span>
                <span>{formatDate(noticia.fecha)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

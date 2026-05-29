import Image from "next/image"
import { Play, Calendar } from "lucide-react"
import { listVideos } from "@/lib/cms"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
}

export default async function VideosPage() {
  const publicados = await listVideos().catch(() => [])
  const categorias = ["Todos", ...Array.from(new Set(publicados.map(v => v.categoria)))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-2">Videos</h1>
        <p className="text-gray-500">Documentales, entrevistas y registros sobre los humedales del Biobío y la acción ciudadana.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === "Todos"
                ? "bg-verde-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-verde-400 hover:text-verde-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured video */}
      {publicados[0] && (
        <div className="card mb-8 overflow-hidden group cursor-pointer">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-56 md:h-64 md:w-1/2 overflow-hidden bg-gray-900 flex-shrink-0">
              <Image
                src={publicados[0].thumbnail}
                alt={publicados[0].titulo}
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-verde-600 transition-colors shadow-xl">
                  <Play className="w-9 h-9 text-verde-700 group-hover:text-white ml-1.5" />
                </div>
              </div>
              <span className="absolute top-4 left-4 badge-verde">Destacado</span>
            </div>
            <div className="p-7 flex flex-col justify-center">
              <span className="badge-gray mb-3 inline-block">{publicados[0].categoria}</span>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{publicados[0].titulo}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{publicados[0].descripcion}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(publicados[0].fecha)}
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${publicados[0].youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 self-start"
              >
                <Play className="w-4 h-4" />
                Ver en YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicados.length === 0 && <p className="text-gray-400 text-sm">No hay videos publicados por ahora.</p>}
        {publicados.slice(1).map(video => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card group cursor-pointer"
          >
            <div className="relative h-44 overflow-hidden bg-gray-900">
              <Image
                src={video.thumbnail}
                alt={video.titulo}
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-verde-600 transition-colors shadow-lg">
                  <Play className="w-6 h-6 text-verde-700 group-hover:text-white ml-1" />
                </div>
              </div>
              <span className="absolute top-3 left-3 badge-gray">{video.categoria}</span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">{video.titulo}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-3">{video.descripcion}</p>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(video.fecha)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

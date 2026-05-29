import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, ThumbsUp, MapPin, Calendar, Play, ChevronRight, Leaf, Shield, BarChart3 } from "lucide-react"
import { getEstadisticas, getPortadaConfig, listEventos, listNoticias, listVideos } from "@/lib/cms"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function Home() {
  const [noticias, eventos, videos, estadisticas, portada] = await Promise.all([
    listNoticias().catch(() => []),
    listEventos().catch(() => []),
    listVideos().catch(() => []),
    getEstadisticas().catch(() => ({ total: 0, apoyo: 0, noApoyo: 0, necesitaInfo: 0, porComuna: [], porFecha: [], comentariosAprobados: [] })),
    getPortadaConfig().catch(() => ({ noticia_id: "", evento_id: "", video_id: "" })),
  ])
  const promote = <T extends { id: string }>(items: T[], id?: string) => id ? [...items].sort((a, b) => (a.id === id ? -1 : b.id === id ? 1 : 0)) : items
  const featuredNoticias = promote(noticias, portada.noticia_id).slice(0, 3)
  const upcomingEventos = promote(eventos, portada.evento_id).slice(0, 2)
  const featuredVideos = promote(videos, portada.video_id).slice(0, 3)
  const pctApoyo = estadisticas.total ? Math.round((estadisticas.apoyo / estadisticas.total) * 100) : 0

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/hero-humedal/1400/900"
            alt="Humedales del Biobío"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-verde-900/90 via-verde-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <span className="badge-verde mb-4 inline-block">Región del Biobío · Chile</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Protejamos los<br />
              <span className="text-verde-300">Humedales</span><br />
              del Biobío
            </h1>
            <p className="text-verde-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Más de 300 hectáreas de humedales costeros están en riesgo. Únete a la ciudadanía del Biobío para defender estos ecosistemas vitales para nuestra biodiversidad, nuestro agua y nuestro futuro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/apoya" className="btn-primary text-base py-4 px-8 justify-center sm:justify-start">
                <ChevronRight className="w-5 h-5" />
                Apoya la Iniciativa
              </Link>
              <Link href="/noticias" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 justify-center sm:justify-start">
                <ArrowRight className="w-5 h-5" />
                Leer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-verde-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Users className="w-7 h-7 text-verde-200 flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold">{estadisticas.total.toLocaleString("es-CL")}</div>
                <div className="text-verde-200 text-sm">participaciones ciudadanas</div>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <ThumbsUp className="w-7 h-7 text-verde-200 flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold">{pctApoyo}%</div>
                <div className="text-verde-200 text-sm">de apoyo ciudadano</div>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <MapPin className="w-7 h-7 text-verde-200 flex-shrink-0" />
              <div>
                <div className="text-2xl font-bold">{estadisticas.porComuna.length}+</div>
                <div className="text-verde-200 text-sm">comunas representadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About initiative */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-verde mb-3 inline-block">La Iniciativa</span>
              <h2 className="section-title mb-4">¿Por qué importa proteger nuestros humedales?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Los humedales costeros del Biobío son uno de los ecosistemas más valiosos y amenazados de Chile. Albergan más de 80 especies de aves, regulan inundaciones, filtran el agua y almacenan carbono en sus suelos.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Un proyecto industrial amenaza con destruir más de 300 hectáreas de estos humedales sin una evaluación ambiental adecuada. Pedimos que la ciudadanía sea escuchada.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Leaf, label: "80+ especies de aves documentadas" },
                  { icon: Shield, label: "300 há. de humedales en riesgo" },
                  { icon: BarChart3, label: "5x más carbono que bosque tropical" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-verde-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-verde-700" />
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://picsum.photos/seed/initiative/700/500"
                alt="Humedales del Biobío"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Noticias */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Últimas Noticias</h2>
            <Link href="/noticias" className="text-verde-600 hover:text-verde-700 font-medium text-sm flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNoticias.map(noticia => (
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
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{noticia.resumen}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{noticia.autor}</span>
                    <span>{formatDate(noticia.fecha)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Próximos Eventos</h2>
            <Link href="/eventos" className="text-verde-600 hover:text-verde-700 font-medium text-sm flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEventos.map(evento => (
              <Link key={evento.id} href={`/eventos/${evento.slug}`} className="card flex group overflow-hidden">
                <div className="relative w-36 sm:w-48 flex-shrink-0">
                  <Image
                    src={evento.imagen}
                    alt={evento.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className={`badge mb-2 inline-block ${evento.tipo === "online" || evento.tipo === "virtual" ? "badge-gray" : "badge-verde"}`}>
                      {evento.tipo === "presencial" ? "Presencial" : evento.tipo === "online" || evento.tipo === "virtual" ? "Online" : "Hibrido"}
                    </span>
                    <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{evento.titulo}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-verde-600" />
                      {formatDate(evento.fecha)} · {evento.hora}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-verde-600" />
                      <span className="line-clamp-1">{evento.lugar}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Videos</h2>
            <Link href="/videos" className="text-verde-600 hover:text-verde-700 font-medium text-sm flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVideos.map(video => (
              <Link key={video.id} href="/videos" className="card group">
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
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">{video.titulo}</h3>
                  <p className="text-gray-400 text-xs mt-1">{formatDate(video.fecha)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-verde-700 to-verde-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Leaf className="w-12 h-12 text-verde-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu voz importa</h2>
          <p className="text-verde-200 text-lg mb-8 max-w-xl mx-auto">
            Más de {estadisticas.total} ciudadanos ya han expresado su posición. Agrega la tuya y contribuye a esta importante decisión colectiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/apoya" className="inline-flex items-center gap-2 bg-white text-verde-800 hover:bg-verde-50 font-semibold px-8 py-4 rounded-xl transition-all duration-200 justify-center shadow-lg">
              <ChevronRight className="w-5 h-5" />
              Apoya la Iniciativa
            </Link>
            <Link href="/resultados" className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 justify-center">
              <BarChart3 className="w-5 h-5" />
              Ver estadísticas
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

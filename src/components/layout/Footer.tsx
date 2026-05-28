import Link from "next/link"
import { Leaf, Globe, Rss, Mail, ExternalLink, Share2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-verde-900 text-verde-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-verde-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">ChankoCiudadano</span>
            </div>
            <p className="text-verde-200 text-sm leading-relaxed max-w-xs">
              Plataforma de participación ciudadana para la protección de los humedales costeros de la región del Biobío.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Share2, Rss, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-verde-800 hover:bg-verde-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Red social"
                >
                  <Icon className="w-4 h-4 text-verde-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Plataforma</h3>
            <ul className="space-y-2">
              {[
                { href: "/noticias", label: "Noticias" },
                { href: "/eventos", label: "Eventos" },
                { href: "/videos", label: "Videos" },
                { href: "/encuestas", label: "Encuestas" },
                { href: "/resultados", label: "Estadísticas" },
                { href: "/apoya", label: "Apoya la Iniciativa" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-verde-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contacto@chanko.cl" className="text-verde-300 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contacto@chanko.cl
                </a>
              </li>
              <li className="text-verde-300 text-sm">Concepción, Región del Biobío</li>
            </ul>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="border-t border-verde-800 mt-10 pt-6">
          <div className="bg-verde-800 rounded-xl p-4 mb-6 text-sm text-verde-200">
            <p className="font-semibold text-verde-100 mb-1">Privacidad y uso de datos</p>
            <p>
              Los datos personales recopilados en esta plataforma (nombre, comuna, correo electrónico y RUT) son utilizados
              exclusivamente para validar la participación ciudadana en esta campaña. El <strong className="text-white">RUT y el correo electrónico
              son confidenciales y nunca serán publicados ni compartidos con terceros</strong>. Los comentarios son moderados
              antes de aparecer públicamente. Al participar, aceptas nuestra política de privacidad.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-verde-400 text-sm">© 2024 ChankoCiudadano. Todos los derechos reservados.</p>
            <p className="text-verde-500 text-xs">Prototipo de validación de concepto — sin datos reales</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

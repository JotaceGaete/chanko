"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, Menu, X, ChevronRight } from "lucide-react"
import clsx from "clsx"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/eventos", label: "Eventos" },
  { href: "/videos", label: "Videos" },
  { href: "/encuestas", label: "Encuestas" },
  { href: "/resultados", label: "Resultados" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-verde-700">
            <div className="w-8 h-8 bg-verde-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">ChankoCiudadano</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-verde-50 text-verde-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/apoya"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
            >
              <ChevronRight className="w-4 h-4" />
              Apoya la Iniciativa
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
          <div className="max-w-7xl mx-auto px-4 pt-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-verde-50 text-verde-700"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/apoya"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                <ChevronRight className="w-4 h-4" />
                Apoya la Iniciativa
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

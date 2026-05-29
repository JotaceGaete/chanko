import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ChankoCiudadano | Protejamos los Humedales del Biobio",
  description: "Plataforma de participacion ciudadana para la proteccion de los humedales costeros de la region del Biobio, Chile.",
  keywords: "humedales, biobio, medio ambiente, participacion ciudadana, conservacion",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "ChankoCiudadano",
    title: "ChankoCiudadano | Protejamos los Humedales del Biobio",
    description: "Participacion ciudadana para proteger los humedales costeros del Biobio.",
    images: [{ url: "https://picsum.photos/seed/hero-humedal/1200/630", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChankoCiudadano | Protejamos los Humedales del Biobio",
    description: "Participacion ciudadana para proteger los humedales costeros del Biobio.",
    images: ["https://picsum.photos/seed/hero-humedal/1200/630"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

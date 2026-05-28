import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChankoCiudadano | Protejamos los Humedales del Biobío",
  description: "Plataforma de participación ciudadana para la protección de los humedales costeros de la región del Biobío, Chile.",
  keywords: "humedales, biobio, medio ambiente, participación ciudadana, conservación",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Justicia Verde - Denuncias Ambientales",
  description: "Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

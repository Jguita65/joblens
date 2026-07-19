import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "JobLens — Analizador de sesgos en ofertas de empleo",
  description:
    "Detecta lenguaje sesgado o excluyente en descripciones de puestos y reescríbelo de forma inclusiva.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

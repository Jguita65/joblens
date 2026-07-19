import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "JobLens — Inclusividad y ATS para selección de personal",
  description:
    "Detecta sesgos en ofertas de empleo, reescríbelas de forma inclusiva y comprueba la compatibilidad ATS entre una oferta y un CV.",
};

// Runs before paint to apply the saved theme and avoid a flash of the wrong one.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('joblens:theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

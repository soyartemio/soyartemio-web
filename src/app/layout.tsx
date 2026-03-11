import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://soyartemio.com'),
  title: {
    default: "Artemio | Consultoría Estratégica en IA y Arquitectura Cloud",
    template: "%s | SoyArtemio"
  },
  description: "Ayudo a empresas a transformar sus operaciones con arquitecturas basadas en Inteligencia Artificial y Soberanía Tecnológica.",
  openGraph: {
    title: "Artemio | Consultoría Estratégica en IA",
    description: "Transformando negocios mediante IA, automatización y arquitecturas tecnológicas robustas.",
    url: "https://soyartemio.com",
    siteName: "SoyArtemio",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: "Artemio | Estratega de IA",
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://soyartemio.com/#person",
      "name": "Artemio",
      "jobTitle": "Estratega de Inteligencia Artificial & Arquitecto Cloud",
      "url": "https://soyartemio.com",
      "sameAs": [
        "https://linkedin.com/in/artemio"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://soyartemio.com/#organization",
      "name": "SoyArtemio Consulting",
      "url": "https://soyartemio.com",
      "founder": {
        "@id": "https://soyartemio.com/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

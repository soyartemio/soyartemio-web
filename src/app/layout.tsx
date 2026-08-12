import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SoyArtemio | Menos caos operativo. Más control.",
    template: "%s | SoyArtemio"
  },
  description: "Encuentro dónde tu empresa pierde tiempo y dinero, y construyo contigo una forma más simple de operar.",
  openGraph: {
    title: "SoyArtemio | Menos caos operativo. Más control.",
    description: "No necesitas otro software. Necesitas una operación que funcione.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_MX",
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
    title: "SoyArtemio | Menos caos operativo. Más control.",
    description: "Encuentro lo que frena tu operación y construyo contigo una forma más simple de trabajar.",
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      "name": "Artemio",
      "jobTitle": "Consultor de operaciones e inteligencia artificial",
      "url": SITE_URL,
      "sameAs": [
        "https://www.linkedin.com/in/soyartemio/"
      ]
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "SoyArtemio Consulting",
      "url": SITE_URL,
      "founder": {
        "@id": `${SITE_URL}/#person`
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      "name": "Consultoría de IA operativa para empresas",
      "url": SITE_URL,
      "provider": {
        "@id": `${SITE_URL}/#organization`
      },
      "areaServed": "MX",
      "serviceType": [
        "Consultoría de inteligencia artificial",
        "Automatización de procesos",
        "Arquitectura de datos e IA",
        "Implementación de agentes de IA"
      ],
      "description": "Diagnóstico, automatización e implementación para empresas que quieren ahorrar tiempo, ordenar su información y operar con más control."
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué recibo en el diagnóstico gratuito?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En 30 minutos revisamos el principal cuello de botella, las herramientas del equipo y el trabajo que se repite. Al final definimos un siguiente paso claro y qué no conviene automatizar todavía."
          }
        },
        {
          "@type": "Question",
          "name": "¿Tengo que cambiar todas mis herramientas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Primero aprovechamos lo que ya funciona y sólo reemplazamos o conectamos lo que duplica trabajo, encierra datos o cuesta más de lo que aporta."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto tarda una implementación de IA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Depende del alcance. Normalmente empezamos con una mejora concreta que pueda probarse en semanas, sin esperar meses para saber si funciona."
          }
        }
      ]
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
        {/* Estilos de S1gnal. Van aquí y no en el componente para que el panel
            nunca se pinte sin CSS. */}
        <link rel="stylesheet" href="/voz/voice-widget.css" />
        <link rel="stylesheet" href="/voz/soyartemio.css?v=20260812" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

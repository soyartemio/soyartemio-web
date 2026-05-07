import type { Metadata } from "next";
import ConceptExperience from "./concept/ConceptExperience";

export const metadata: Metadata = {
  title: "Arquitectura de IA Operativa | SoyArtemio",
  description:
    "Convierte la IA en infraestructura operativa propia: automatización, control de datos y menos renta de software para empresas que quieren operar con margen.",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "SoyArtemio | Arquitectura de IA Operativa",
    description:
      "Deja de usar la IA como un juguete. Construye sistemas propios que automaticen tu operación, protejan tus datos y reduzcan rentas de software.",
    url: "https://soyartemio.com",
    siteName: "SoyArtemio",
    locale: "es_MX",
    type: "website",
  },
};

export default function Home() {
  return <ConceptExperience />;
}

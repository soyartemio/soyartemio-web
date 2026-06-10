import type { Metadata } from "next";
import ConceptExperience from "./concept/ConceptExperience";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
    title: `${SITE_NAME} | Arquitectura de IA Operativa`,
    description:
      "Deja de usar la IA como un juguete. Construye sistemas propios que automaticen tu operación, protejan tus datos y reduzcan rentas de software.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
};

export default function Home() {
  return <ConceptExperience />;
}

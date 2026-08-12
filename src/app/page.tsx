import type { Metadata } from "next";
import ConceptExperience from "./concept/ConceptExperience";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consultoría de IA y automatización para empresas",
  description:
    "Encuentro dónde tu empresa pierde tiempo y dinero, y construyo contigo una forma más simple de operar. Diagnóstico gratuito de 30 minutos.",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: `${SITE_NAME} | Menos caos operativo. Más control.`,
    description:
      "No necesitas otro software. Necesitas una operación que funcione.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
};

export default function Home() {
  return <ConceptExperience />;
}

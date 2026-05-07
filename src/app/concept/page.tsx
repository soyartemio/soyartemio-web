import type { Metadata } from "next";
import ConceptExperience from "./ConceptExperience";

export const metadata: Metadata = {
  title: "Concepto Hero | SoyArtemio",
  description:
    "Propuesta visual editorial para SoyArtemio: IA aplicada como infraestructura operativa propia, con propiedad de datos y ahorro en rentas de software.",
  alternates: {
    canonical: "/concept",
    languages: {
      es: "/concept",
      en: "/en/concept",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConceptPage() {
  return <ConceptExperience />;
}

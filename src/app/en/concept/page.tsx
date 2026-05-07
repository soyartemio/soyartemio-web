import type { Metadata } from "next";
import ConceptExperience from "@/app/concept/ConceptExperience";

export const metadata: Metadata = {
  title: "AI Operating Architecture | SoyArtemio",
  description:
    "AI strategy and implementation for companies that want owned operating systems, data control, and less software rent.",
  alternates: {
    canonical: "/en/concept",
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

export default function EnglishConceptPage() {
  return <ConceptExperience locale="en" />;
}

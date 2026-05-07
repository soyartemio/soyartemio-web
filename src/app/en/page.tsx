import type { Metadata } from "next";
import ConceptExperience from "@/app/concept/ConceptExperience";

export const metadata: Metadata = {
  title: "AI Operating Architecture | SoyArtemio",
  description:
    "Turn AI into owned operating infrastructure: automation, data control, and less software rent for companies that want better margins.",
  alternates: {
    canonical: "/en",
    languages: {
      es: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "SoyArtemio | AI Operating Architecture",
    description:
      "Stop using AI like a toy. Build owned systems that automate your operation, protect your data, and reduce software rent.",
    url: "https://soyartemio.com/en",
    siteName: "SoyArtemio",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishHome() {
  return <ConceptExperience locale="en" />;
}

import type { Metadata } from "next";
import ConceptExperience from "@/app/concept/ConceptExperience";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
    title: `${SITE_NAME} | AI Operating Architecture`,
    description:
      "Stop using AI like a toy. Build owned systems that automate your operation, protect your data, and reduce software rent.",
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishHome() {
  return <ConceptExperience locale="en" />;
}

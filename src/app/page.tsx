import dynamic from 'next/dynamic';

// Next.js App Router Strict Rule: `ssr: false` cannot be used in a Server Component directly.
// We import a client-only wrapper that handles the 3D Canvas
import CanvasWrapper from "@/components/3d/CanvasWrapper";

import Hero from "@/components/ui/hero/Hero";
import MethodART from "@/components/ui/method/MethodART";
import BioSection from "@/components/ui/bio/BioSection";
import ImpactSection from "@/components/ui/impact/ImpactSection";
import Portfolio from "@/components/ui/portfolio/Portfolio";
import LeadMagnet from "@/components/ui/leadmagnet/LeadMagnet";
import SaasCalculator from "@/components/ui/calculator/SaasCalculator";
import Footer from "@/components/ui/footer/Footer";
import VideoManifest from "@/components/ui/video/VideoManifest";

export const metadata = {
  title: "Artemio | Consultoría de IA y Soberanía Tecnológica",
  description: "Reemplaza SaaS costosos y automatiza tu empresa con Inteligencia Artificial alojada en tu propio Workspace. Recupera el control operativo.",
  alternates: {
    canonical: 'https://soyartemio.com',
  },
};


export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 3D R3F Layer con z-index negativo en config nativa */}
      <CanvasWrapper />

      {/* Scrollable Container Layer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <Hero />
        <VideoManifest />
        <MethodART />
        <ImpactSection />
        <Portfolio />
        <BioSection />
        <LeadMagnet />
        <SaasCalculator />
        <Footer />
      </div>
    </main>
  );
}

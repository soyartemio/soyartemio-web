import Background3D from "@/components/3d/Background3D";
import Hero from "@/components/ui/hero/Hero";
import MethodART from "@/components/ui/method/MethodART";
import BioSection from "@/components/ui/bio/BioSection";
import ImpactSection from "@/components/ui/impact/ImpactSection";
import Portfolio from "@/components/ui/portfolio/Portfolio";
import LeadMagnet from "@/components/ui/leadmagnet/LeadMagnet";
import Footer from "@/components/ui/footer/Footer";
import VideoManifest from "@/components/ui/video/VideoManifest";

export const metadata = {
  title: "SoyArtemio | Consultoría Estratégica de IA y Soberanía Tecnológica",
  description: "Ayudo a empresas a reemplazar SaaS costosos con sistemas basados en IA dentro de ecosistemas propios (Google Workspace). Elimina CAPEX y recupera el control de tu operación.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 3D R3F Layer con z-index negativo en config nativa */}
      <Background3D />

      {/* Scrollable Container Layer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <Hero />
        <VideoManifest />
        <MethodART />
        <ImpactSection />
        <Portfolio />
        <BioSection />
        <LeadMagnet />
        <Footer />
      </div>
    </main>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, X, ChevronRight, Activity, Database, Zap } from "lucide-react";

type Project = {
    id: string;
    title: string;
    clientType: string;
    tag: string;
    image: string;
    caos: string;
    arquitectura: string;
    impacto: string;
    impactoHighlight: string;
};

const projects: Project[] = [
    {
        id: "aegis",
        title: "Proyecto Aegis",
        clientType: "Aseguradora Top 10",
        tag: "Automatización de Siniestros",
        image: "/assets/mockup-insurance.png",
        caos: "El equipo perdía más de 60 horas a la semana clasificando pólizas y evaluando siniestros manualmente a través de correos dispersos y sistemas heredados rotos.",
        arquitectura: "Se desplegó un Agente de IA Privado capaz de leer, estructurar y resumir documentos PDF (pólizas/reclamos) conectándolos directamente a los servidores seguros (On-Premise) de la aseguradora, sin exponer datos a APIs públicas.",
        impacto: "Reducción del 85% en tiempos de cotización y resolución de siniestros. La dependencia humana en clasificación de papel fue erradicada por completo.",
        impactoHighlight: "-85% Tiempo de Resolución"
    },
    {
        id: "terra",
        title: "Proyecto Terra",
        clientType: "Desarrolladora Inmobiliaria",
        tag: "CRM Predictivo In-House",
        image: "/assets/mockup-realestate.png",
        caos: "Dependencia absoluta de un CRM comercial genérico que costaba miles de dólares en rentas mensuales, pero que era rígido e incapaz de adaptarse al sofisticado embudo de ventas High-Ticket de la firma.",
        arquitectura: "Construimos un CRM Híbrido sobre su infraestructura (Google Workspace/Cloud) con un módulo de Machine Learning predictivo que asigna una probabilidad de cierre basándose en el comportamiento histórico del lead.",
        impacto: "Ahorro directo de $15,000 USD anuales en licencias de software, y un incremento medible del 35% en la tasa de cierre global gracias a la priorización inteligente de prospectos.",
        impactoHighlight: "$15k Ahorro Anual (SaaS)"
    },
    {
        id: "nexus",
        title: "Proyecto Nexus",
        clientType: "Líder en Logística",
        tag: "Control de Flotas con IA",
        image: "/assets/mockup-logistics.png",
        caos: "Flotas de transporte pesadas y rutas ineficientes gestionadas casi ciegamente a través de múltiples hojas de cálculo, generando retrasos en entregas y altos costos operativos.",
        arquitectura: "Desarrollo de un Centro de Control Dinámico (Command Center). Integramos su telemetría existente con algoritmos de IA en tiempo real para sugerencias de enrutamiento basadas en tráfico, clima y urgencia, en una interfaz futurista Liquid Glass.",
        impacto: "Optimización feroz del ruteo que resultó en un 22% de ahorro en costos de combustible mensual y visibilidad gerencial total sin intermediarios tecnológicos.",
        impactoHighlight: "-22% Costo de Combustible"
    },
    {
        id: "synthetix",
        title: "Proyecto Synthetix",
        clientType: "Agencia de Marketing",
        tag: "Gestor de Proyectos IA",
        image: "/assets/mockup-marketing.png",
        caos: "Sangrado de capital. Pagaban licencias premium de Monday.com (mes con mes) para 40 colaboradores y docenas de clientes invitados, volviendo la herramienta un pasivo financiero gigante.",
        arquitectura: "Reemplazamos Monday.com construyendo Tableros Kanban in-house (Self-Hosted), equipados con Asistentes de Copywriting Nativos que leen el contexto de la tarjeta y redactan anuncios sin salir de la plataforma.",
        impacto: "100% de erradicación de rentas por gestores de proyectos de terceros. El pipeline creativo se automatizó, acelerando la entrega de campañas en un 40%.",
        impactoHighlight: "0$ Pagos en Licencias"
    }
];

export default function Portfolio() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Bloquear scroll cuando el modal está abierto
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedProject]);

    return (
        <section id="portfolio" className="relative py-32 px-4 w-full bg-brand-dark/50">
            <div className="max-w-7xl mx-auto z-10 relative">

                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-sm font-bold tracking-wider uppercase mb-6"
                    >
                        Portafolio Inmersivo
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md"
                    >
                        Casos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-primary">Éxito en Acción</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Ejemplos reales de cómo empresas de alto nivel recuperaron su soberanía tecnológica, reemplazaron software arrendado y escalaron usando IA en su propia infraestructura.
                    </motion.p>
                </div>

                {/* Grid de Tarjetas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedProject(project)}
                            className="glass-panel group overflow-hidden cursor-pointer hover:border-brand-cyan/50 transition-all duration-500 h-[450px] md:h-[500px] flex flex-col relative"
                        >
                            {/* Hover Glow Feroz */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/0 to-brand-primary/0 group-hover:from-brand-cyan/10 group-hover:to-brand-primary/10 transition-colors duration-500 z-0"></div>

                            {/* Imagen de Fondo / Mockup */}
                            <div className="relative w-full flex-1 overflow-hidden border-b border-white/5 bg-black/50">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-top opacity-60 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out"
                                />
                                {/* Overlay de Degradado */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent"></div>

                                {/* Badge de Industria */}
                                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs text-brand-cyan font-bold tracking-wide">
                                    {project.clientType}
                                </div>
                            </div>

                            {/* Información Inferior */}
                            <div className="p-8 relative z-10 bg-[#0a0a0c]/80 backdrop-blur-md shrink-0">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
                                            {project.tag}
                                        </p>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal Inmersivo (Liquid Glass) */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 md:p-8">
                            {/* Backdrop Dark */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProject(null)}
                                className="absolute inset-0 bg-[#000000]/80 backdrop-blur-xl"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl! ring-1 ring-white/20"
                            >
                                {/* Botón Cerrar (Sticky Mobile, Aboslute Desktop) */}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-cyan hover:text-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Izquierda: Imagen Completa */}
                                <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-white/10 bg-black">
                                    <Image
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        fill
                                        className="object-cover object-left-top opacity-80"
                                    />
                                    {/* Sutil gradiente para integrar con el panel */}
                                    <div className="absolute inset-0 md:bg-gradient-to-r bg-gradient-to-t from-transparent via-transparent to-[#0a0a0c]/90"></div>
                                </div>

                                {/* Derecha: Narrativa de Impacto */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#0a0a0c]/80 backdrop-blur-2xl">
                                    <div className="mb-8">
                                        <div className="inline-block px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/30 rounded-full text-brand-cyan text-xs font-bold mb-4 tracking-widest">
                                            {selectedProject.clientType.toUpperCase()}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{selectedProject.title}</h3>
                                        <p className="text-brand-primary font-medium">{selectedProject.tag}</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Bloque: El Caos */}
                                        <div>
                                            <h4 className="flex items-center gap-2 text-white font-bold text-lg mb-2">
                                                <Activity className="w-5 h-5 text-red-400" />
                                                El Caos (Antes)
                                            </h4>
                                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                                {selectedProject.caos}
                                            </p>
                                        </div>

                                        {/* Bloque: La Arquitectura */}
                                        <div>
                                            <h4 className="flex items-center gap-2 text-white font-bold text-lg mb-2">
                                                <Database className="w-5 h-5 text-brand-cyan" />
                                                La Arquitectura
                                            </h4>
                                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                                {selectedProject.arquitectura}
                                            </p>
                                        </div>

                                        {/* Bloque: El Impacto Feroz */}
                                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full"></div>
                                            <h4 className="flex items-center gap-2 text-white font-bold text-lg mb-2 relative z-10">
                                                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                                                El Impacto Feroz
                                            </h4>
                                            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4 relative z-10">
                                                {selectedProject.impacto}
                                            </p>
                                            <div className="inline-flex items-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f4c025] to-yellow-200 tracking-tighter drop-shadow-lg p-1 relative z-10">
                                                {selectedProject.impactoHighlight}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to Action Integrado */}
                                    <div className="mt-12 pt-8 border-t border-white/10 hidden xl:block">
                                        <a href="#auditoria" onClick={(e) => {
                                            setSelectedProject(null);
                                            setTimeout(() => {
                                                document.getElementById('auditoria')?.scrollIntoView({ behavior: 'smooth' });
                                            }, 300);
                                        }} className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <p className="text-white font-bold">¿Quieres resultados similares?</p>
                                                <p className="text-gray-500 text-sm">Haz la auditoría gratuita de 2 mins.</p>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-brand-cyan group-hover:translate-x-2 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}

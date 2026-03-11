"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Calendar, Layers, ShieldCheck } from "lucide-react";
import { MouseEvent } from "react";

export default function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    const springTransition: any = {
        type: "spring",
        damping: 25,
        stiffness: 120,
        mass: 1,
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: springTransition }
    };

    return (
        <header className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20 pb-16">
            <div className="max-w-4xl mx-auto w-full z-10 relative">

                {/* Panel Liquid Glass con Spotlight Effect */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    onMouseMove={handleMouseMove}
                    className="glass-panel p-6 md:p-14 text-center mt-12 md:mt-0 bg-brand-dark/40 relative group overflow-hidden"
                >
                    {/* Spotlight Glow Layer */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    800px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255, 255, 255, 0.15),
                                    transparent 80%
                                )
                            `,
                        }}
                    />
                    {/* Borde brillante reactivo */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    400px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255, 255, 255, 0.8),
                                    transparent 40%
                                )
                            `,
                            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: '100% 100%'
                        }}
                    />

                    {/* Content Wrapper for z-index protection against highlight */}
                    <div className="relative z-10">
                        {/* Badge Trust Signal */}
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 bg-black/40 mb-6 md:mb-8 backdrop-blur-md shadow-xl">
                            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            <span className="text-[10px] md:text-xs font-semibold tracking-wider text-gray-200 uppercase">Adiós Suscripciones. Hola Soberanía Tecnológica.</span>
                        </motion.div>

                        {/* H1 - Titular de Autoridad */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 md:mb-6 leading-tight drop-shadow-lg"
                        >
                            Automatiza tu Operación.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-primary drop-shadow-md">
                                Sé Dueño de tu Software.
                            </span>
                        </motion.h1>

                        {/* H2 - Subtítulo / Problema-Solución */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-gray-100 font-medium mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
                        >
                            Reemplazamos tu stack infinito de SaaS (Monday, Odoo, Pipedrive) con sistemas híbridos de IA que corren nativamente sobre tu infraestructura (Google Workspace, AWS, Azure).
                            <strong className="text-white font-bold ml-1 block mt-2 sm:inline sm:mt-0 bg-black/40 sm:bg-transparent px-2 py-1 sm:p-0 rounded">Integración total. Cero rentas mensuales.</strong>
                        </motion.p>

                        {/* Botones / CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.a
                                href="https://calendly.com/soyartemio/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300"
                            >
                                Diseñar mi Arquitectura
                                <ArrowRight className="w-5 h-5" />
                            </motion.a>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    document.getElementById('impacto')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 bg-transparent text-white font-medium px-8 py-4 rounded-xl hover:border-white/40 transition-all duration-300"
                            >
                                Ver Casos de Éxito
                            </motion.button>
                        </motion.div>
                        <motion.div variants={itemVariants} className="mt-4 text-center min-h-[24px]">
                            <span className="inline-block px-3 py-1 border text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full transition-colors duration-500 bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                Auditoría inicial gratuita (30 min)
                            </span>
                        </motion.div>

                        {/* Trust Indicators Internos */}
                        <motion.div variants={itemVariants} className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-12 text-xs md:text-sm text-gray-300 font-medium">
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full sm:bg-transparent sm:p-0">
                                <ShieldCheck className="w-4 h-4 text-brand-cyan drop-shadow" /> Contrato de Propiedad Intelectual
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full sm:bg-transparent sm:p-0">
                                <Layers className="w-4 h-4 text-brand-primary drop-shadow" /> Sin Límite de Usuarios
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full sm:bg-transparent sm:p-0">
                                <Calendar className="w-4 h-4 text-brand-accent drop-shadow" /> en semanas, no en meses.
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}

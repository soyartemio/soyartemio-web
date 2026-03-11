"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { MouseEvent } from "react";

export default function BioSection() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section id="bio" className="relative py-20 px-4 w-full">
            <motion.div
                className="max-w-6xl mx-auto glass-panel overflow-hidden md:p-0 relative group"
                onMouseMove={handleMouseMove}
            >
                {/* Spotlight Glow Layer */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                800px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />
                {/* Borde reactivo de cristal */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                400px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.4),
                                transparent 40%
                            )
                        `,
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        WebkitMaskSize: '100% 100%'
                    }}
                />

                <article className="grid grid-cols-1 md:grid-cols-2 relative z-10">

                    {/* Contenido / Texto */}
                    <div className="p-8 md:p-16 flex flex-col justify-center order-2 md:order-1 relative z-10 w-full">
                        {/* Micro-etiqueta superior */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block text-brand-primary font-bold mb-4 tracking-wider text-xs md:text-sm uppercase"
                        >
                            EL CONSULTOR DETRÁS DE LA PANTALLA
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-extrabold text-white mb-6 drop-shadow-md"
                        >
                            Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-primary">Artemio.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base drop-shadow"
                        >
                            <p>
                                2026 no espera a nadie. Mientras lees esto, tu competencia no está contratando personal, está integrando arquitecturas inteligentes.
                            </p>
                            <p>
                                Yo no soy un gurú, soy el <strong className="text-white">arquitecto</strong> que conecta tu caos operativo con sistemas eficientes que realmente te pertenecen.
                            </p>
                        </motion.div>

                        {/* KPIS o Métricas Visuales */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-4 md:gap-6 items-center mt-10"
                        >
                            <div className="text-center px-5 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm shadow-inner flex flex-col justify-center">
                                <span className="block text-2xl md:text-3xl font-black text-white drop-shadow">2026</span>
                                <span className="text-[10px] md:text-xs text-brand-cyan tracking-wider uppercase font-semibold mt-1">Visión Futura</span>
                            </div>
                            <div className="text-center px-5 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm shadow-inner flex flex-col justify-center">
                                <span className="block text-2xl md:text-3xl font-black text-white drop-shadow">100%</span>
                                <span className="text-[10px] md:text-xs text-brand-primary tracking-wider uppercase font-semibold mt-1">Compromiso Total</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Espacio para la Imagen (Con gradientes simulando "cristal" fusionándose) */}
                    {/* Al ser Agnostic, pondremos un placeholder Premium hasta tener la foto exportada */}
                    <div className="relative min-h-[400px] md:min-h-full order-1 md:order-2 bg-brand-dark/50 flex items-center justify-center overflow-hidden">

                        {/* Blob decorativo de fondo */}
                        <div className="absolute w-[150%] h-[150%] bg-gradient-radial from-brand-primary/20 to-transparent blur-3xl opacity-50 -z-10 animate-pulse"></div>

                        {/* Imagen Placeholder / O imagen real de Artemio - Mantenemos object cover y posición top */}
                        <div className="absolute inset-0 w-full h-full mix-blend-luminosity opacity-80 z-0">
                            {/*  Descomenta para agregar la foto real cuando se levante el entorno en Localhost
                            <Image 
                                src="/assets/miimagen.jpg" 
                                alt="Artemio - Arquitecto Cloud y Consultor de IA"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'top' }}
                                priority
                            /> 
                           */}
                            <div className="w-full h-full bg-gradient-to-br from-brand-dark via-gray-900 to-black flex items-center justify-center text-white/10 font-bold text-xl uppercase tracking-widest">
                                <Image
                                    src="/assets/miimagen.jpg"
                                    alt="Artemio - Consultor Estratégico de IA y Soberanía Tecnológica"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    fill
                                    className="object-cover object-top opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                                    unoptimized // Temporal en lo que exportamos
                                />
                                {/* Gradientes superpuestos para fusionar imagen con el borde Liquid Glass */}
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-dark/90 to-transparent z-10"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 to-transparent md:block hidden z-10"></div>
                            </div>
                        </div>
                    </div>
                </article>
            </motion.div>
        </section>
    );
}

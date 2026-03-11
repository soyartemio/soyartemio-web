"use client";

import { motion } from "framer-motion";
import { Activity, Map, Zap } from "lucide-react";

const steps = [
    {
        id: "A",
        title: "Analizar (La Radiografía)",
        description: "Antes de instalar nada, entiendo tu negocio. Identificamos cuellos de botella reales y datos desaprovechados. Sin diagnóstico no hay receta.",
        icon: <Activity className="w-8 h-8 text-brand-primary" />,
        color: "from-brand-primary/20 to-transparent",
        borderColor: "border-brand-primary/30",
    },
    {
        id: "R",
        title: "Rutas (El Diseño)",
        description: "Diseño la arquitectura personalizada. Seleccionamos las herramientas exactas (ni más, ni menos) y creamos el plan de implementación paso a paso.",
        icon: <Map className="w-8 h-8 text-brand-cyan" />,
        color: "from-brand-cyan/20 to-transparent",
        borderColor: "border-brand-cyan/30",
    },
    {
        id: "T",
        title: "Transformar (El Piloto)",
        description: "Implementación acompañada. No te dejo solo con el software; capacito a tu equipo para que la tecnología trabaje para ellos, y no al revés.",
        icon: <Zap className="w-8 h-8 text-brand-accent" />,
        color: "from-brand-accent/20 to-transparent",
        borderColor: "border-brand-accent/30",
    }
];

export default function MethodART() {
    return (
        <section id="metodo" className="relative py-24 md:py-32 px-4 w-full">
            <div className="max-w-6xl mx-auto z-10 relative">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm"
                    >
                        <span className="text-xs font-semibold tracking-widest text-brand-cyan uppercase">Metodología Comprobada</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md"
                    >
                        El Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-cyan">A.R.T.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        No improvisamos. Usamos un sistema de 3 fases para asegurar que la inversión en IA tenga sentido para TU realidad operativa.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
                    {/* Línea conectora (visible solo en desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"></div>

                    {steps.map((step, index) => (
                        <motion.article
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 120,
                                mass: 1,
                                delay: index * 0.15
                            }}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="glass-panel p-8 rounded-3xl relative overflow-hidden group flex flex-col items-center md:items-start text-center md:text-left h-full"
                        >
                            {/* Gradiente de fondo al hover para darle "vida" */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                            {/* Ícono Circular */}
                            <div className={`w-16 h-16 rounded-2xl border ${step.borderColor} bg-brand-dark/50 shadow-inner flex items-center justify-center mb-8 relative z-10 backdrop-blur-md`}>
                                {step.icon}
                            </div>

                            {/* Letra de Fondo Gigante */}
                            <div className="absolute -right-4 -bottom-4 text-[150px] font-black text-white/[0.03] select-none pointer-events-none leading-none">
                                {step.id}
                            </div>

                            {/* Contenido */}
                            <div className="relative z-10 flex-grow">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 drop-shadow-sm">{step.title}</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{step.description}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

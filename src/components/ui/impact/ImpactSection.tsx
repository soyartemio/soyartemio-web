"use client";

import { motion } from "framer-motion";
import { Clock, Database, Handshake, TrendingUp } from "lucide-react";

const impacts = [
    {
        title: "Recuperación de Tiempo",
        description: "Automatización de tareas repetitivas para liberar a tu equipo.",
        icon: <Clock className="w-8 h-8 text-brand-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />,
    },
    {
        title: "Control de Datos",
        description: "Dejar de adivinar y empezar a decidir con información unificada.",
        icon: <Database className="w-8 h-8 text-brand-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />,
    },
    {
        title: "Compromiso Total",
        description: "No soy un ticket de soporte. Soy tu socio estratégico durante toda la implementación.",
        icon: <Handshake className="w-8 h-8 text-brand-accent drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />,
    },
    {
        title: "Escalabilidad",
        description: "Capacidad de atender a más clientes con la misma estructura.",
        icon: <TrendingUp className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]" />,
    }
];

export default function ImpactSection() {
    return (
        <section id="impacto" className="relative py-24 px-4 w-full overflow-hidden">
            {/* Iluminación de fondo focalizada */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>

            <div className="max-w-6xl mx-auto z-10 relative">

                <div className="text-center mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md"
                    >
                        ¿Qué Puedes <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Esperar?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Sin promesas mágicas. Estos son los resultados tangibles de una buena estrategia.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {impacts.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: index * 0.1
                            }}
                            whileHover={{ y: -5 }}
                            className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group bg-black/20 hover:bg-black/40 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 tracking-wide">{item.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

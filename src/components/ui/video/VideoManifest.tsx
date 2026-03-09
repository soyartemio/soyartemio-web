"use client";

import { motion } from "framer-motion";

export default function VideoManifest() {
    return (
        <section id="manifiesto" className="relative py-24 px-4 w-full overflow-hidden">
            {/* Ambient Background Focus */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-[100%] pointer-events-none -z-10 animate-pulse"></div>

            <div className="max-w-5xl mx-auto z-10 relative">
                <div className="text-center mb-10 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 mb-6 backdrop-blur-sm"
                    >
                        <span className="text-xs font-semibold tracking-widest text-brand-primary uppercase">El Manifiesto 2026</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md"
                    >
                        ¿Por qué <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-cyan">Soberanía Tecnológica?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Descubre cómo dejar de pagar infinitas licencias de SaaS y dominar tus propios datos usando Inteligencia Artificial.
                    </motion.p>
                </div>

                {/* Video Glass Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="glass-panel p-2 md:p-3 rounded-3xl"
                >
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-dark relative shadow-inner">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/LIA_Yg6uVLI?rel=0&modestbranding=1"
                            title="Manifiesto SoyArtemio 2026"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator } from "lucide-react";

export default function SaasCalculator() {
    const [empleados, setEmpleados] = useState<number>(50);

    // Lógica: Total = (Empleados * $20 USD * 12 meses)
    // Asumiendo un mix de licencias promedio de $20 USD por usuario/mes
    const dineroTirado = empleados * 20 * 12;

    return (
        <section className="relative py-20 px-4 w-full flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl w-full glass-panel p-8 md:p-12 relative overflow-hidden"
            >
                {/* Glow de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10 text-center mb-8">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-red-500/20 mb-4 border border-red-500/30">
                        <Calculator className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                        Calculadora de <span className="text-red-400">Impuesto SaaS</span>
                    </h2>
                    <p className="text-gray-300">
                        Descubre cuánto "dinero tirado a la basura" estás pagando anualmente por rentar software (Monday, Notion, CRMs) en lugar de ser el dueño de tu infraestructura.
                    </p>
                </div>

                <div className="space-y-8 relative z-10">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-lg font-bold text-white">Número de Colaboradores / Licencias</label>
                            <span className="text-2xl font-black text-brand-cyan bg-white/5 px-4 py-1 rounded-lg border border-white/10">{empleados}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            step="5"
                            value={empleados}
                            onChange={(e) => setEmpleados(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>10</span>
                            <span>500+</span>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 text-center shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>

                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Fuga de Capital Anual (Aprox)</p>
                        <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-lg tracking-tighter">
                            ${dineroTirado.toLocaleString()} USD
                        </div>
                        <p className="text-sm text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                            Cálculo basado en un promedio conservador de $20 USD mensuales por usuario en ecosistemas SaaS fragmentados. Dinero que podrías estar inyectando en márgenes operativos.
                        </p>
                    </div>

                    <div className="pt-4 text-center">
                        <a
                            href="https://calendly.com/soyartemio/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block w-full md:w-auto bg-brand-cyan text-black font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
                        >
                            Frenar la Fuga. Integrar IA In-House.
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

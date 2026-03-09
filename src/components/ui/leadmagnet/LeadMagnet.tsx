"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

const questions = [
    {
        id: 1,
        question: "¿Dónde reside el conocimiento y la operativa crítica de tu empresa?",
        options: [
            { text: "En herramientas SaaS rentadas (Notion, Monday, etc.)", type: "saas" },
            { text: "En infraestructura propia (Nube privada o base interna)", type: "self" }
        ]
    },
    {
        id: 2,
        question: "¿Sientes que pagas licencias mensuales por software que tu equipo usa a menos del 20% de su capacidad?",
        options: [
            { text: "Sí, es una fuga de capital constante", type: "saas" },
            { text: "No, aprovechamos cada herramienta al máximo", type: "self" }
        ]
    },
    {
        id: 3,
        question: "Si hoy cayeran los servidores de tus proveedores de software, ¿tu operación comercial se detendría por completo?",
        options: [
            { text: "Sí, parálisis total. Dependemos de ellos", type: "saas" },
            { text: "No, tenemos el control y respaldos propios", type: "self" }
        ]
    }
];

export default function LeadMagnet() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    // Calcula qué porcentaje de respuestas indican dependencia a SaaS
    const saasScore = answers.filter(a => a === "saas").length;

    const handleAnswer = (type: string) => {
        const newAnswers = [...answers, type];
        setAnswers(newAnswers);

        // Mueve al siguiente paso después de un pequeño delay para mostrar el click y ser fluido (Nivel Apple)
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 300);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers([]);
    };

    return (
        <section id="auditoria" className="relative py-24 px-4 w-full">
            <div className="max-w-3xl mx-auto z-10 relative">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 md:p-12 overflow-hidden relative"
                >
                    {/* Glow de fondo */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-brand-primary/10 via-brand-cyan/10 to-brand-accent/10 opacity-30 blur-2xl transition-opacity duration-1000 -z-10 animate-spin-slow pointer-events-none"></div>

                    {/* Encabezado del Quiz */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                            Auditoría de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-primary">Soberanía AI</span>
                        </h2>
                        {currentStep < questions.length && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {questions.map((q, idx) => (
                                    <div key={q.id} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" : idx < currentStep ? "w-4 bg-brand-primary/50" : "w-4 bg-white/20"}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contenedor Animado de Preguntas */}
                    <div className="relative min-h-[250px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {currentStep < questions.length ? (
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    <h3 className="text-lg md:text-xl font-medium text-white mb-6 text-center leading-relaxed drop-shadow">
                                        {questions[currentStep].question}
                                    </h3>

                                    <div className="space-y-3">
                                        {questions[currentStep].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(option.type)}
                                                className="w-full text-left p-4 md:p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-brand-cyan/50 transition-all duration-300 group flex items-center justify-between"
                                            >
                                                <span className="text-sm md:text-base text-gray-200 group-hover:text-white transition-colors">
                                                    {option.text}
                                                </span>
                                                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-cyan group-hover:bg-brand-cyan/20 transition-all shrink-0 ml-4">
                                                    <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-brand-cyan transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center w-full"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cyan/20 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                        <ShieldCheck className="w-8 h-8 text-brand-cyan" />
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        Diagnóstico Completado
                                    </h3>

                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 mt-4 backdrop-blur-md">
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                            {saasScore >= 2
                                                ? "Tu operativa actual depende peligrosamente de infraestructura rentada. Estás perdiendo capital mensual en licencias subutilizadas y cediendo el control de tus datos. Es hora de migrar a sistemas propios y recuperar el control."
                                                : saasScore === 1
                                                    ? "Tienes un nivel mixto. Aunque mantienes cierto control, todavía hay fugas de capital en licencias recurrentes que podrían consolidarse en herramientas propias impulsadas por IA."
                                                    : "¡Excelente! Mantienes buen control sobre tu infraestructura. El siguiente paso es automatizar los cuellos de botella operativos mediante Agentes de IA nativos para exponenciar tu rentabilidad."}
                                        </p>
                                    </div>

                                    <motion.a
                                        href="https://calendly.com/soyartemio/30min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center justify-center gap-3 bg-white text-brand-dark font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 w-full sm:w-auto"
                                    >
                                        <span>Agendar Sesión de Estrategia</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.a>

                                    <button
                                        onClick={resetQuiz}
                                        className="mt-8 block w-full text-xs font-semibold text-brand-cyan/60 hover:text-brand-cyan transition-colors"
                                    >
                                        Repetir Diagnóstico
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    // Detectar scroll para aplicar Glassmorphism solo cuando no está en el top
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    // Intersection Observer para la burbuja activa
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -80% 0px", // Detecta una sección cuando cruza el 20% superior de la pantalla
            threshold: 0
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observar todas las secciones principales
        const sections = document.querySelectorAll("section[id]");
        sections.forEach(sec => observer.observe(sec));

        return () => {
            sections.forEach(sec => observer.unobserve(sec));
            observer.disconnect();
        };
    }, []);

    const navLinks = [
        { name: "Manifiesto", href: "#manifiesto" },
        { name: "El Método A.R.T.", href: "#metodo" },
        { name: "Impacto", href: "#impacto" },
        { name: "Consultor", href: "#bio" },
    ];

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        e.preventDefault();
        setMobileMenuOpen(false); // Cerrar menú en móvil
        const element = document.querySelector(href);
        if (element) {
            // Ajustamos el offset para que el header sticky no tape el título de la sección
            const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="flex justify-center w-full relative z-[100]">
            {/* Desktop & Sticky Header - Refactored as a Floating Island */}
            <header
                className={`fixed top-4 md:top-6 transition-all duration-500 z-50 w-[calc(100%-2rem)] max-w-5xl`}
            >
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className={`grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 md:px-6 md:py-3 rounded-full transition-all duration-500 shadow-2xl ${scrolled
                        ? "bg-[#0a0a0a]/70 backdrop-blur-2xl border border-white/10"
                        : "bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/5"
                        }`}
                >
                    {/* Logo */}
                    <a
                        href="#"
                        onClick={(e) => handleScrollTo(e, 'body')}
                        className="z-50 relative flex items-center shrink-0 justify-self-start"
                    >
                        <Image
                            src="/assets/logo-soya.png"
                            alt="SoyArtemio Logo"
                            width={130}
                            height={32}
                            className="w-24 md:w-32 h-auto drop-shadow-md brightness-0 invert opacity-100 hover:opacity-80 transition-opacity"
                            priority
                        />
                    </a>

                    {/* Desktop Nav - Centered & Premium */}
                    <nav className="hidden md:flex items-center gap-1 md:gap-2 relative justify-self-center">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.substring(1);

                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleScrollTo(e, link.href)}
                                    className={`relative px-4 py-2 text-[13px] tracking-wide font-semibold transition-colors duration-300 z-10 rounded-full ${isActive ? "text-white" : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    {/* Texto del Botón */}
                                    <span className="relative z-10">{link.name}</span>

                                    {/* Burbuja Animada (Framer Motion) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-bubble"
                                            className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-inner -z-0"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* CTA Desktop - Right aligned */}
                    <div className="hidden md:flex shrink-0 justify-self-end">
                        <a
                            href="https://calendly.com/soyartemio/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-black border border-brand-cyan/30 text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                        >
                            Agendar Sesión
                        </a>
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="md:hidden text-white p-2 z-50 focus:outline-none justify-self-end col-start-3"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 drop-shadow" /> : <Menu className="w-5 h-5 drop-shadow" />}
                    </button>
                </motion.div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="fixed inset-4 md:hidden z-40 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-3xl flex flex-col items-center justify-center pt-10 shadow-2xl"
                    >
                        <nav className="flex flex-col items-center gap-6 w-full px-8">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 + 0.1 }}
                                    onClick={(e) => handleScrollTo(e, link.href)}
                                    className="text-2xl font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </motion.a>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="w-16 h-px bg-white/20 my-4"
                            ></motion.div>

                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                href="https://calendly.com/soyartemio/30min"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full text-center bg-brand-cyan text-black text-lg font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            >
                                Agendar Sesión
                            </motion.a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

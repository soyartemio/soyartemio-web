"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 pt-16 pb-8 px-4 w-full bg-brand-dark/80 backdrop-blur-3xl overflow-hidden mt-12">

            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-cyan/5 blur-[100px] rounded-[100%] pointer-events-none -z-10"></div>

            <div className="max-w-6xl mx-auto flex flex-col items-center">

                {/* Logo O Texto */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <Image
                        src="/assets/logo-soya.png"
                        alt="SoyArtemio Logo"
                        width={200}
                        height={50}
                        className="w-auto h-8 md:h-10 drop-shadow-md brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                    />
                </motion.div>

                {/* Enlaces y Copy */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-gray-400 mb-12">
                    <a href="#metodo" className="hover:text-white transition-colors duration-200">El Método</a>
                    <a href="#impacto" className="hover:text-white transition-colors duration-200">Impacto</a>
                    <a href="#bio" className="hover:text-white transition-colors duration-200">Consultor</a>
                    <a href="https://calendly.com/soyartemio/30min" target="_blank" rel="noreferrer" className="text-brand-cyan hover:text-brand-primary transition-colors duration-200">Agendar Sesión</a>
                    <a href="https://www.linkedin.com/in/soyartemio/" target="_blank" rel="noreferrer" className="hover:text-[#0a66c2] transition-colors duration-200">LinkedIn</a>
                    <a href="mailto:yo@soyartemio.me" className="hover:text-white transition-colors duration-200">yo@soyartemio.me</a>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                <div className="text-xs text-center text-gray-600 flex flex-col items-center justify-center gap-2">
                    <p>© {new Date().getFullYear()} SoyArtemio. Consultoría Estratégica.</p>
                    <p>Liquid Glass Architecture by Antigravity Agents.</p>
                </div>
            </div>

            {/* Tawk.to Script Inyectado (Solo Cliente) */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                        s1.async=true;
                        s1.src='https://embed.tawk.to/68e9d6758c23bb194e60d502/1j78mrehp';
                        s1.charset='UTF-8';
                        s1.setAttribute('crossorigin','*');
                        s0.parentNode.insertBefore(s1,s0);
                        })();
                    `,
                }}
            />
        </footer>
    );
}

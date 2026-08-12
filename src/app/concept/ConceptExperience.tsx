"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import VoiceAgent from "../../components/ui/voice/VoiceAgent";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Database,
  DatabaseZap,
  Handshake,
  Layers3,
  LockKeyhole,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Locale = "es" | "en";

const icons = {
  strategy: Route,
  training: Bot,
  custom: Layers3,
  implementation: Handshake,
  time: Clock,
  data: Database,
  savings: CircleDollarSign,
};

const baseLayerClasses = [
  "mx-auto w-[61.8%] border-[#b8954f] bg-[#2b2417]",
  "mx-auto w-[78.6%] border-[#56b6b2] bg-[#102b2b]",
  "w-full border-[#7d8fd6] bg-[#151d3b]",
];

/*
 * Sistema macro de proporción: 10 → 16 → 26 → 42 → 68 → 110.
 * Las composiciones de dos columnas usan 0.618fr / 1fr; los controles
 * conservan incrementos táctiles de 8, 12, 16 y 24 cuando la usabilidad manda.
 */

const content = {
  es: {
    nav: {
      diagnosis: "Diagnóstico",
      blueprint: "Cómo funciona",
      savings: "Calculadora",
      cta: "Agendar diagnóstico",
      localeHref: "/en/concept",
      localeLabel: "EN",
    },
    mobile: {
      eyebrow: "Para empresas cansadas de operar a mano",
      heroTitle: "Deja de usar la IA como un juguete.",
      heroBody: "No necesitas otro software. Entro a tu empresa, encuentro qué roba tiempo y dinero, y construyo contigo una forma más simple de operar.",
      primaryCta: "Diagnóstico de 30 min",
      secondaryCta: "Calcular lo que pierdo",
      receiptLabel: "Antes / Después",
      receiptTitle: "Menos caos. Más control.",
      receiptNote: "Una solución hecha alrededor de tu empresa.",
      offerEyebrow: "Así te ayudo",
      offerTitle: "Cuatro formas de salir del problema.",
      offerBody: "Empezamos por lo que más tiempo, dinero o control te está costando.",
      methodEyebrow: "Cómo lo resolvemos",
      methodTitle: "Del problema a una forma mejor de trabajar.",
      methodSteps: [
        "Encontramos la fuga.",
        "Resolvemos lo prioritario.",
        "Tu equipo lo adopta.",
      ],
      calculatorEyebrow: "Haz la cuenta",
      calculatorTitle: "¿Cuánto te cuesta seguir igual?",
      calculatorBody: "Ajusta tres variables. Te doy una señal para decidir, no una promesa.",
      calculatorResult: "Costo anual estimado",
      calculatorCta: "Encontrar por dónde empezar",
      bioEyebrow: "Soy Artemio",
      bioTitle: "Primero entiendo. Luego construyo.",
      bioBody: "Entro al problema contigo y me quedo hasta que la solución funcione.",
    },
    hero: {
      eyebrow: "Para empresas cansadas de operar a mano",
      title: "Deja de usar la IA como un juguete.",
      body: "No necesitas otro software. Entro a tu empresa, encuentro qué está robando tiempo y dinero, y construyo contigo una forma más simple de operar.",
      primaryCta: "Agendar diagnóstico",
      secondaryCta: "Calcular lo que pierdo al año",
      auditNote: "30 min · sin costo · sales con el siguiente paso claro.",
      outcomes: [
        "Detectamos dónde se atasca el trabajo.",
        "Decidimos qué conviene automatizar y qué no.",
        "Construimos primero lo que más alivio genera.",
      ],
      proofStrip: [
        { label: "Diagnóstico", title: "Encuentra el problema", body: "Antes de gastar en herramientas.", href: "#diagnostico" },
        { label: "Automatización", title: "Quita trabajo manual", body: "Sin romper lo que ya funciona.", href: "#propiedad" },
        { label: "Información", title: "Ordena tus datos", body: "Para decidir sin perseguir reportes.", href: "#acta" },
        { label: "Ahorro", title: "Recupera presupuesto", body: "Menos rentas, más control.", href: "#calculadora" },
      ],
    },
    act: {
      eyebrow: "Resultado del diagnóstico",
      title: "Tu operación deja de depender de parches",
      input: "Lo que hoy duele",
      working: "Lo que resolvemos",
      generated: "Lo que cambia",
      result: "Resultado",
      lockIn: "dependencias",
      resultBody: "de herramientas que no puedes controlar",
      dataTitle: "Tu información",
      dataBody: "ordenada y bajo tu control",
      systemTitle: "Tu forma de trabajar",
      systemBody: "convertida en un sistema simple",
      supportTitle: "Mi acompañamiento",
      supportBody: "hasta que tu equipo lo use",
      savingsLine: "Lo que hoy se desperdicia puede financiar una mejor forma de operar.",
      savingsBadge: "Presupuesto recuperado",
      transformations: [
        { before: "Rentas de software", after: "Herramientas propias" },
        { before: "Datos regados", after: "Información en orden" },
        { before: "Trabajo repetitivo", after: "Procesos automáticos" },
      ],
      workSteps: [
        "Entendiendo cómo trabajan",
        "Encontrando fugas",
        "Priorizando qué resolver",
        "Armando el plan",
      ],
    },
    services: {
      eyebrow: "Lo que construimos juntos",
      title: "Cuatro formas de salir del problema.",
      cards: [
        {
          icon: icons.strategy,
          title: "Diagnóstico y plan",
          subtitle: "Encuentra dónde empezar y qué no comprar.",
          body: "Reviso tu operación, detecto los cuellos de botella y te dejo una ruta clara.",
        },
        {
          icon: icons.training,
          title: "Capacitación para tu equipo",
          subtitle: "La IA deja de depender de una sola persona.",
          body: "Tu equipo aprende a usarla con criterio, seguridad y casos reales de su trabajo.",
        },
        {
          icon: icons.custom,
          title: "Sistemas hechos para tu empresa",
          subtitle: "Automatizamos lo que realmente estorba.",
          body: "Construyo herramientas alrededor de tus procesos, no al revés.",
        },
        {
          icon: icons.implementation,
          title: "Implementación completa",
          subtitle: "Te acompaño hasta que funcione todos los días.",
          body: "Del primer módulo a la adopción: construimos, probamos y mejoramos contigo.",
        },
      ],
    },
    useCases: {
      eyebrow: "Dónde suele doler",
      title: "Lo que hoy te quita tiempo puede dejar de hacerlo.",
      body: "Normalmente empezamos donde el equipo persigue información, repite tareas o deja seguimientos a medias.",
      cases: [
        {
          icon: Database,
          title: "Reportes sin persecución",
          body: "Junta información de hojas, correos y sistemas sin pedirla una y otra vez.",
        },
        {
          icon: Bot,
          title: "Atención y seguimiento",
          body: "Responde, clasifica y da seguimiento con reglas claras.",
        },
        {
          icon: Route,
          title: "Ventas sin cabos sueltos",
          body: "Evita que oportunidades, recordatorios y entregas se pierdan entre equipos.",
        },
        {
          icon: ShieldCheck,
          title: "Procesos con reglas claras",
          body: "Define quién revisa, quién decide y hasta dónde puede avanzar cada automatización.",
        },
      ],
    },
    process: {
      eyebrow: "Cómo trabajamos",
      title: "Primero entendemos el problema. Luego lo resolvemos.",
      steps: [
        {
          number: "01",
          title: "Encontramos la fuga",
          body: "Vemos dónde se pierde tiempo, dinero o control.",
        },
        {
          number: "02",
          title: "Elegimos la prioridad",
          body: "Definimos qué resolver primero y qué puede esperar.",
        },
        {
          number: "03",
          title: "Construimos contigo",
          body: "Implementamos una pieza útil y la probamos en el trabajo real.",
        },
        {
          number: "04",
          title: "Tu equipo la adopta",
          body: "Acompaño el uso hasta que la mejora se vuelve parte de la operación.",
        },
      ],
    },
    calculator: {
      eyebrow: "Haz la cuenta",
      title: "Mide cuánto te cuesta seguir igual.",
      body: "Suma el gasto en herramientas y el tiempo que tu equipo pierde en tareas repetitivas.",
      toolsLabel: "Gasto mensual en herramientas",
      hoursLabel: "Horas de trabajo repetitivo por semana",
      rateLabel: "Costo por hora del equipo",
      monthlyLeak: "Costo mensual de seguir igual",
      yearlyLeak: "Costo anual estimado",
      note: "En el diagnóstico revisamos qué parte sí se puede recuperar y por dónde conviene empezar.",
      cta: "Encontrar la fuga",
    },
    blueprint: {
      eyebrow: "Cómo se sostiene",
      title: "Primero ordenamos. Después automatizamos.",
      body: "La tecnología entra al final. Antes dejamos claro qué información importa, cómo debe fluir el trabajo y quién conserva el control.",
      metrics: [
        { icon: icons.time, title: "Tiempo para el equipo", body: "Menos tareas repetidas y más capacidad para resolver." },
        { icon: icons.data, title: "Información confiable", body: "Los datos dejan de vivir repartidos en correos y hojas." },
        { icon: icons.savings, title: "Gasto mejor aprovechado", body: "El presupuesto se dirige a lo que la empresa realmente necesita." },
      ],
      layers: [
        { number: "03", title: "Reglas y control", body: "Permisos, revisión y límites claros.", label: "CONTROL" },
        { number: "02", title: "Procesos que avanzan solos", body: "Seguimientos y tareas que dejan de depender de recordatorios.", label: "FLUJO" },
        { number: "01", title: "Información en orden", body: "Una base confiable para trabajar y decidir.", label: "BASE" },
      ],
    },
    bio: {
      imageAlt: "Artemio, consultor estratégico de IA y arquitectura operativa",
      label: "Soy Artemio",
      cardTitle: "Consultor para empresas que necesitan volver a tener control.",
      eyebrow: "Quién te acompaña",
      title: "Primero entiendo tu operación. Luego construyo.",
      body: "No llego con software prefabricado. Entro contigo al problema, encuentro qué lo está causando y me quedo hasta que la solución funcione para tu equipo.",
      cta: "Agendar diagnóstico gratuito",
    },
    manifesto: {
      eyebrow: "Manifiesto operativo",
      title: "No eres usuario de tu operación. Eres dueño.",
      p1: "No necesitas comprar más tecnología esperando que algo cambie. Necesitas una forma de trabajar diseñada alrededor de tu empresa.",
      p2: "Mi trabajo es encontrar lo que hoy te frena, construir la solución contigo y dejar a tu equipo con más tiempo, margen y control.",
      cta: "Encontrar mi siguiente paso",
    },
    faq: {
      eyebrow: "Antes de empezar",
      title: "Las dudas que conviene resolver antes de empezar.",
      items: [
        {
          question: "¿Qué recibo en el diagnóstico gratuito?",
          answer: "En 30 minutos revisamos el principal cuello de botella, las herramientas que usa tu equipo y el trabajo que hoy se repite. Al final te digo por dónde empezaría, qué no automatizaría todavía y si tiene sentido que trabajemos juntos. Sin obligación.",
        },
        {
          question: "¿Tengo que cambiar todas mis herramientas?",
          answer: "No. Primero aprovechamos lo que ya funciona. Sólo reemplazamos o conectamos lo que hoy duplica trabajo, encierra datos o cuesta más de lo que aporta.",
        },
        {
          question: "¿Cuánto tarda una implementación?",
          answer: "Depende del alcance. Normalmente empezamos con una mejora concreta que pueda probarse en semanas, sin esperar meses para saber si funciona.",
        },
        {
          question: "¿Necesito tener mis datos perfectamente ordenados?",
          answer: "No. Parte del trabajo es encontrar qué información importa, ordenarla y dejar una base confiable para que el sistema funcione.",
        },
      ],
    },
    whatsapp: {
      label: "Resolver duda por WhatsApp",
      title: "Dudas rápidas",
      body: "Cuéntame qué está frenando a tu equipo.",
      message:
        "Hola Artemio, vengo de tu página. Quiero contarte qué está frenando a mi equipo y saber por dónde empezar.",
    },
    footer: {
      tagline:
        "Encuentro lo que frena tu operación y construyo contigo una forma más simple de trabajar.",
      navTitle: "Secciones",
      contactTitle: "Contacto",
      cta: "Agendar diagnóstico gratuito",
      rights: "Todos los derechos reservados.",
      origin: "Hecho en México.",
    },
  },
  en: {
    nav: {
      diagnosis: "Diagnosis",
      blueprint: "How it works",
      savings: "Calculator",
      cta: "Book diagnosis",
      localeHref: "/concept",
      localeLabel: "ES",
    },
    mobile: {
      eyebrow: "For companies tired of manual work",
      heroTitle: "Stop using AI like a toy.",
      heroBody: "You do not need more software. I enter your company, find what is draining time and money, and build a simpler way to operate with you.",
      primaryCta: "30-minute diagnosis",
      secondaryCta: "Calculate what I lose",
      receiptLabel: "Before / After",
      receiptTitle: "Less chaos. More control.",
      receiptNote: "A solution built around your company.",
      offerEyebrow: "How I help",
      offerTitle: "Four ways out of the problem.",
      offerBody: "We start with what is costing you the most time, money, or control.",
      methodEyebrow: "How we solve it",
      methodTitle: "From the problem to a better way of working.",
      methodSteps: [
        "We find the leak.",
        "We solve the priority.",
        "Your team adopts it.",
      ],
      calculatorEyebrow: "Run the numbers",
      calculatorTitle: "What does staying the same cost you?",
      calculatorBody: "Adjust three variables. This is a signal for your decision, not a promise.",
      calculatorResult: "Estimated yearly cost",
      calculatorCta: "Find where to start",
      bioEyebrow: "I am Artemio",
      bioTitle: "First I understand. Then I build.",
      bioBody: "I enter the problem with you and stay until the solution works.",
    },
    hero: {
      eyebrow: "For companies tired of manual work",
      title: "Stop using AI like a toy.",
      body: "You do not need more software. I enter your company, find what is draining time and money, and build a simpler way to operate with you.",
      primaryCta: "Book a diagnosis",
      secondaryCta: "Calculate my yearly loss",
      auditNote: "30 min · free · leave with a clear next step.",
      outcomes: [
        "We find where work gets stuck.",
        "We decide what is worth automating and what is not.",
        "We build what creates the most relief first.",
      ],
      proofStrip: [
        { label: "Diagnosis", title: "Find the problem", body: "Before spending on tools.", href: "#diagnostico" },
        { label: "Automation", title: "Remove manual work", body: "Without breaking what works.", href: "#propiedad" },
        { label: "Information", title: "Organize your data", body: "Decide without chasing reports.", href: "#acta" },
        { label: "Savings", title: "Recover budget", body: "Less rent, more control.", href: "#calculadora" },
      ],
    },
    act: {
      eyebrow: "Your diagnosis outcome",
      title: "Your operation stops depending on patches",
      input: "What hurts today",
      working: "What we solve",
      generated: "What changes",
      result: "Result",
      lockIn: "dependencies",
      resultBody: "on tools you cannot control",
      dataTitle: "Your information",
      dataBody: "organized and under your control",
      systemTitle: "Your way of working",
      systemBody: "turned into a simple system",
      supportTitle: "My support",
      supportBody: "until your team actually uses it",
      savingsLine: "What is wasted today can fund a better way to operate.",
      savingsBadge: "Recovered budget",
      transformations: [
        { before: "Software rent", after: "Your own tools" },
        { before: "Scattered data", after: "Organized information" },
        { before: "Repetitive work", after: "Automated processes" },
      ],
      workSteps: [
        "Understanding how you work",
        "Finding the leaks",
        "Choosing what to solve",
        "Building the plan",
      ],
    },
    services: {
      eyebrow: "What we build together",
      title: "Four ways out of the problem.",
      cards: [
        {
          icon: icons.strategy,
          title: "Diagnosis and plan",
          subtitle: "Find where to start and what not to buy.",
          body: "I review your operation, find the bottlenecks, and leave you with a clear path.",
        },
        {
          icon: icons.training,
          title: "Training for your team",
          subtitle: "AI stops depending on one person.",
          body: "Your team learns to use it safely and sensibly through examples from their real work.",
        },
        {
          icon: icons.custom,
          title: "Systems built for your company",
          subtitle: "We automate what actually gets in the way.",
          body: "I build tools around your processes, not the other way around.",
        },
        {
          icon: icons.implementation,
          title: "Full implementation",
          subtitle: "I stay until it works every day.",
          body: "From the first module to adoption, we build, test, and improve it together.",
        },
      ],
    },
    useCases: {
      eyebrow: "Where it usually hurts",
      title: "What takes your time today does not have to tomorrow.",
      body: "We usually start where teams chase information, repeat tasks, or lose track of follow-ups.",
      cases: [
        {
          icon: Database,
          title: "Reports without chasing",
          body: "Bring together information from sheets, email, and systems without asking for it again and again.",
        },
        {
          icon: Bot,
          title: "Service and follow-up",
          body: "Respond, classify, and follow up under clear rules.",
        },
        {
          icon: Route,
          title: "Sales without loose ends",
          body: "Keep opportunities, reminders, and deliveries from getting lost between teams.",
        },
        {
          icon: ShieldCheck,
          title: "Processes with clear rules",
          body: "Define who reviews, who decides, and how far each automation can go.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "First we understand the problem. Then we solve it.",
      steps: [
        {
          number: "01",
          title: "Find the leak",
          body: "We see where time, money, or control is being lost.",
        },
        {
          number: "02",
          title: "Choose the priority",
          body: "We decide what to solve first and what can wait.",
        },
        {
          number: "03",
          title: "Build it with you",
          body: "We implement one useful piece and test it in real work.",
        },
        {
          number: "04",
          title: "Your team adopts it",
          body: "I support the rollout until the improvement becomes part of daily operations.",
        },
      ],
    },
    calculator: {
      eyebrow: "Run the numbers",
      title: "Measure what staying the same costs you.",
      body: "Add up tool spending and the time your team loses to repetitive work.",
      toolsLabel: "Monthly tool spending",
      hoursLabel: "Hours of repetitive work per week",
      rateLabel: "Team hourly cost",
      monthlyLeak: "Monthly cost of staying the same",
      yearlyLeak: "Estimated yearly cost",
      note: "In the diagnosis, we check how much can actually be recovered and where to begin.",
      cta: "Find the leak",
    },
    blueprint: {
      eyebrow: "How it holds together",
      title: "First we organize. Then we automate.",
      body: "Technology comes last. First we clarify what information matters, how work should move, and who stays in control.",
      metrics: [
        { icon: icons.time, title: "Time for your team", body: "Fewer repeated tasks and more room to solve problems." },
        { icon: icons.data, title: "Reliable information", body: "Data stops living across scattered email and sheets." },
        { icon: icons.savings, title: "Better use of budget", body: "Spending goes toward what the company actually needs." },
      ],
      layers: [
        { number: "03", title: "Rules and control", body: "Permissions, review, and clear boundaries.", label: "CONTROL" },
        { number: "02", title: "Processes that move on their own", body: "Follow-ups and tasks that stop depending on reminders.", label: "FLOW" },
        { number: "01", title: "Organized information", body: "A reliable base for working and deciding.", label: "BASE" },
      ],
    },
    bio: {
      imageAlt: "Artemio, AI strategy consultant and operating architecture specialist",
      label: "I am Artemio",
      cardTitle: "Consultant for companies that need control again.",
      eyebrow: "Who works with you",
      title: "First I understand your operation. Then I build.",
      body: "I do not arrive with off-the-shelf software. I enter the problem with you, find its cause, and stay until the solution works for your team.",
      cta: "Book a free diagnosis",
    },
    manifesto: {
      eyebrow: "Operating manifesto",
      title: "You are not a user of your operation. You own it.",
      p1: "You do not need to buy more technology hoping something changes. You need a way of working designed around your company.",
      p2: "My work is to find what holds you back, build the solution with you, and leave your team with more time, margin, and control.",
      cta: "Find my next step",
    },
    faq: {
      eyebrow: "Before we begin",
      title: "The questions worth answering before we start.",
      items: [
        {
          question: "What do I get from the free diagnosis?",
          answer: "In 30 minutes, we review your main bottleneck, the tools your team uses, and the work being repeated. I tell you where I would start, what I would not automate yet, and whether working together makes sense. No obligation.",
        },
        {
          question: "Do I have to replace all my tools?",
          answer: "No. We use what already works first. We only replace or connect what duplicates work, traps your data, or costs more than it contributes.",
        },
        {
          question: "How long does implementation take?",
          answer: "It depends on scope. We usually start with a concrete improvement that can be tested in weeks instead of waiting months to learn whether it works.",
        },
        {
          question: "Does my information need to be perfectly organized?",
          answer: "No. Part of the work is finding what matters, organizing it, and creating a reliable base for the system.",
        },
      ],
    },
    whatsapp: {
      label: "Ask on WhatsApp",
      title: "Quick questions",
      body: "Tell me what is slowing your team down.",
      message:
        "Hi Artemio, I came from your website. I want to tell you what is slowing my team down and ask where to start.",
    },
    footer: {
      tagline:
        "I find what is holding your operation back and build a simpler way to work with you.",
      navTitle: "Sections",
      contactTitle: "Contact",
      cta: "Book a free diagnosis",
      rights: "All rights reserved.",
      origin: "Made in Mexico.",
    },
  },
} as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/*
 * Una sola curva para todo el sitio.
 *
 * Es expo.out: sale rápido y frena largo. Que TODO use la misma es la mitad de
 * la diferencia entre una página que parece animada y una que parece dirigida
 * — el ojo detecta la incoherencia de easings aunque no sepa nombrarla.
 */
const EASE = [0.16, 1, 0.3, 1] as const;

/** Secuencia de entrada del hero. Los hijos llegan en orden, no todos juntos. */
const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.2 } },
};

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/*
 * Las reglas se dibujan solas antes de que llegue el texto.
 *
 * La marca dice "arquitectura": empezar por trazar la retícula y después
 * colocar el contenido encima es el gesto de un plano levantándose. Cuesta dos
 * líneas y es lo que se recuerda de la entrada.
 */
const drawX = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.15, ease: EASE } },
};
const drawY = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1.4, ease: EASE, delay: 0.25 } },
};

/**
 * Titular con máscara por palabra: cada palabra sube desde detrás de su propio
 * recorte en vez de aparecer con opacidad. Es el gesto que separa un titular
 * animado de uno que sólo se enciende.
 *
 * El `pb`/`-mb` existe porque el recorte cortaría las colas de la j y la g.
 */
function MaskedWords({ text, delay = 0.12 }: { text: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <>{text}</>;

  return (
    <span aria-hidden="true">
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.24em] inline-block overflow-hidden pb-[0.16em] align-bottom -mb-[0.16em]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.82, ease: EASE, delay: delay + index * 0.045 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Wordmark 04 · Terminal — brand board v01.
 * El dominio es la marca; el cursor de bloque es el unico elemento propio.
 * Spec: output/brandkit/spec-brandkit.md
 */
function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-label="soyartemio.me"
      className={`flex items-baseline font-mono text-[15px] font-semibold leading-none tracking-[-0.02em] sm:text-[17px] ${
        inverted ? "text-[#f4f0e8]" : "text-[#171717]"
      }`}
    >
      soyartemio
      <span className={inverted ? "text-[#b8954f]" : "text-[#7a6030]"}>.me</span>
      <span
        aria-hidden="true"
        className="ml-[0.11em] inline-block h-[0.84em] w-[0.52em] bg-[#b8954f] motion-safe:animate-[brand-caret_1.15s_steps(1)_infinite]"
      />
    </span>
  );
}

function AnimatedDataAct({ locale }: { locale: Locale }) {
  const prefersReducedMotion = useReducedMotion();
  const copy = content[locale].act;
  const ownershipRows: Array<{ title: string; body: string; Icon: LucideIcon }> = [
    { title: copy.dataTitle, body: copy.dataBody, Icon: DatabaseZap },
    { title: copy.systemTitle, body: copy.systemBody, Icon: ShieldCheck },
    { title: copy.supportTitle, body: copy.supportBody, Icon: Handshake },
  ];

  return (
    <div className="relative min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-none">
      <div className="absolute -right-6 top-8 hidden h-[540px] w-[540px] rounded-full border border-[#171717]/10 xl:block" />
        <motion.div
          id="acta"
          initial={{ opacity: 0, y: 28, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-[calc(100vw-2.5rem)] max-w-2xl overflow-hidden border border-[#171717] bg-[#fbf7ef] p-4 shadow-[10px_10px_0_#171717] sm:w-full md:p-6 md:shadow-[18px_18px_0_#171717]"
      >
        <motion.div
          className="absolute left-0 top-0 h-1 w-1/3 bg-gradient-to-r from-transparent via-[#b8954f] to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 3.2, repeat: prefersReducedMotion ? 0 : Infinity, ease: "linear" }}
        />

        <div className="flex items-center justify-between border-b border-[#171717] pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#171717]/50">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-normal text-[#171717]">
              {copy.title}
            </h2>
          </div>
          <motion.div
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-13 w-13 items-center justify-center rounded-full bg-[#171717] text-[#f4f0e8]"
          >
            <LockKeyhole className="h-6 w-6" />
          </motion.div>
        </div>

        <div className="relative grid min-w-0 gap-4 py-[26px] md:grid-cols-[0.618fr_1fr_0.618fr]">
          <motion.div
            aria-hidden="true"
            className="absolute left-[18%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-[#b8954f] to-transparent md:block"
            initial={{ width: "0%" }}
            animate={{ width: "64%" }}
            transition={{ duration: 1.7, repeat: prefersReducedMotion ? 0 : Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative min-w-0 border border-[#171717]/20 bg-[#f4f0e8] p-4"
          >
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#171717]/45">
              <ScanLine className="h-3.5 w-3.5" />
              {copy.input}
            </p>
            <div className="mt-4 space-y-3">
              {copy.transformations.map((item) => (
                <div key={item.before} className="flex items-center justify-between gap-3 border-b border-[#171717]/10 pb-2 last:border-b-0">
                  <span className="text-sm font-bold text-[#171717]/55 line-through decoration-[#b8954f] decoration-2">
                    {item.before}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8954f]" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative min-w-0 overflow-hidden border border-[#171717] bg-[#171717] p-4 text-[#f4f0e8]"
          >
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#f4f0e8_1px,transparent_1px),linear-gradient(90deg,#f4f0e8_1px,transparent_1px)] [background-size:22px_22px]" />
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#b8954f]/25 to-transparent"
              animate={prefersReducedMotion ? undefined : { y: ["-30%", "260%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b8954f]">
                  {copy.working}
                </p>
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#56b6b2]"
                  animate={prefersReducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
              </div>
              <div className="space-y-2">
                {copy.workSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    className="flex min-w-0 items-center gap-2 text-xs font-bold text-[#f4f0e8]/70"
                    animate={prefersReducedMotion ? undefined : { opacity: [0.42, 1, 0.42] }}
                    transition={{ duration: 2.4, delay: index * 0.35, repeat: Infinity }}
                  >
                    <span className="text-[#56b6b2]">0{index + 1}</span>
                    <span className="min-w-0 break-words">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="relative min-w-0 border border-[#171717]/20 bg-[#f4f0e8] p-4"
          >
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#7a6030]">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.generated}
            </p>
            <div className="mt-4 space-y-3">
              {copy.transformations.map((item) => (
                <div key={item.after} className="flex items-center gap-2 border-b border-[#171717]/10 pb-2 last:border-b-0">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#7a6030]" />
                  <span className="text-sm font-black text-[#171717]">{item.after}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-[0.618fr_1fr]">
          <div className="border border-[#171717] bg-[#171717] p-5 text-[#f4f0e8]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b8954f]">
              {copy.result}
            </p>
            <div className="mt-5 flex items-end gap-3">
              <motion.p
                className="text-6xl font-black leading-none tracking-normal"
                animate={prefersReducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                0
              </motion.p>
              <p className="pb-2 text-xs font-black uppercase tracking-[0.2em] text-[#f4f0e8]/45">
                {copy.lockIn}
              </p>
            </div>
            <p className="mt-2 text-sm font-bold text-[#f4f0e8]/70">
              {copy.resultBody}
            </p>
          </div>

          <div className="grid gap-3 border border-[#171717]/20 p-4">
            {ownershipRows.map(({ title, body, Icon }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9dfcb]">
                  <Icon className="h-5 w-5 text-[#171717]" />
                </div>
                <div>
                  <p className="text-sm font-black">{title}</p>
                  <p className="text-xs font-semibold text-[#171717]/55">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="ahorro" className="mt-4 flex flex-col gap-3 border-t border-[#171717] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-6 w-6 text-[#7a6030]" />
            <p className="text-sm font-black">
              {copy.savingsLine}
            </p>
          </div>
          <span className="w-max rounded-full bg-[#b8954f] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#171717]">
            {copy.savingsBadge}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function BlueprintPyramid({ locale }: { locale: Locale }) {
  const copy = content[locale].blueprint;

  return (
    <section id="propiedad" className="relative overflow-hidden bg-[#090b0c] px-5 py-[68px] text-[#f4f0e8] md:px-10 md:py-[110px]">
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-[#f4f0e8]/10" />
      <div className="relative mx-auto grid max-w-7xl gap-[42px] xl:grid-cols-[0.618fr_1fr] xl:gap-[68px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.7 }}>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#b8954f]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-[16ch] text-[clamp(2.625rem,5vw,4.25rem)] font-black leading-[0.92] tracking-[-0.025em]">
            {copy.title}
          </h2>
          <p className="mt-[26px] max-w-[42ch] text-lg font-medium leading-relaxed text-[#f4f0e8]/68">
            {copy.body}
          </p>
          <div className="mt-[42px] grid gap-4">
            {copy.metrics.map((item) => (
              <div key={item.title} className="flex gap-4 border-t border-[#f4f0e8]/12 pt-5">
                <item.icon className="mt-1 h-5 w-5 shrink-0 text-[#b8954f]" />
                <div>
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-[#f4f0e8]/55">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-x-8 bottom-0 h-32 bg-[#56b6b2]/20 blur-3xl" />
          <div className="relative space-y-4">
            {copy.layers.map((layer, index) => (
              <motion.article
                key={layer.number}
                initial={{ opacity: 0, y: 42, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`${baseLayerClasses[index]} relative overflow-hidden rounded-[18px] border p-[26px] shadow-2xl`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_32%)]" />
                <div className="relative flex items-center gap-6">
                  <p className="text-5xl font-black text-white/22">{layer.number}</p>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-black">{layer.title}</h3>
                    <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-white/58">{layer.body}</p>
                  </div>
                  <span className="hidden rounded-full border border-white/18 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/72 sm:inline-block">
                    {layer.label}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid({ locale }: { locale: Locale }) {
  const copy = content[locale].services;

  return (
    <section id="diagnostico" className="relative bg-[#0f1010] px-5 py-[68px] text-white md:px-10 md:py-[110px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(184,149,79,0.13),transparent_32%),radial-gradient(circle_at_78%_58%,rgba(86,182,178,0.10),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.7 }} className="mb-[42px] max-w-[68rem]">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#56b6b2]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-[18ch] text-[clamp(2.625rem,4.8vw,4.25rem)] font-black leading-[0.94] tracking-[-0.025em]">
            {copy.title}
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {copy.cards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group relative min-h-[260px] overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.04] p-[26px] transition duration-500 hover:border-[#56b6b2]/50 hover:bg-white/[0.065]"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background-image:linear-gradient(120deg,transparent,rgba(86,182,178,0.12),transparent)]" />
              <div className="relative">
                <div className="mb-[26px] flex h-[42px] w-[42px] items-center justify-center border border-white/15 bg-white/[0.04] text-[#56b6b2]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[26px] font-black leading-tight">{card.title}</h3>
                <p className="mt-2 text-base font-medium text-white/78 md:text-lg">{card.subtitle}</p>
                <div className="my-5 h-px bg-white/12" />
                <p className="max-w-2xl text-sm font-medium leading-relaxed text-white/55 md:text-base">{card.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection({ locale }: { locale: Locale }) {
  const copy = content[locale].useCases;

  return (
    <section className="bg-[#f4f0e8] px-5 py-[68px] md:px-10 md:py-[110px]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-[42px] border-y border-[#171717]/15 py-[42px] lg:grid-cols-[0.618fr_1fr] lg:gap-[68px] lg:py-[68px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65 }}
          >
            <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#7a6030]">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-[16ch] text-[clamp(2.625rem,4.6vw,4.25rem)] font-black leading-[0.94] tracking-[-0.025em]">
              {copy.title}
            </h2>
            <p className="mt-[26px] max-w-[42ch] text-lg font-medium leading-relaxed text-[#171717]/64">
              {copy.body}
            </p>
          </motion.div>

          <div className="border-y border-[#171717]/18">
            {copy.cases.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group relative grid min-h-[160px] gap-4 border-b border-[#171717]/18 py-[26px] last:border-b-0 sm:grid-cols-[42px_0.618fr_1fr] sm:items-start sm:gap-[26px]"
              >
                <span className="absolute inset-y-0 left-0 w-0 bg-[#171717] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full motion-reduce:transition-none" />
                <div className="relative flex h-10 w-10 items-center justify-center border border-[#171717] text-[#171717] transition-colors duration-300 group-hover:border-[#b8954f] group-hover:text-[#b8954f]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7a6030] transition-colors duration-300 group-hover:text-[#b8954f]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-black transition-colors duration-300 group-hover:text-[#f4f0e8]">{item.title}</h3>
                </div>
                <p className="relative text-sm font-semibold leading-relaxed text-[#171717]/58 transition-colors duration-300 group-hover:text-[#f4f0e8]/62 sm:pt-6">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ locale }: { locale: Locale }) {
  const copy = content[locale].process;

  return (
    <section className="bg-[#f4f0e8] px-5 pb-[68px] md:px-10 md:pb-[110px]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#7a6030]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-[18ch] text-[clamp(2.625rem,4.8vw,4.25rem)] font-black leading-[0.94] tracking-[-0.025em]">
            {copy.title}
          </h2>
        </motion.div>

        <div className="mt-[42px] grid border-t border-[#171717]/15 md:grid-cols-4">
          {copy.steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="min-h-[260px] border-b border-[#171717]/15 py-[26px] md:border-b-0 md:border-r md:px-[16px] md:last:border-r-0"
            >
              <p className="text-sm font-black tracking-[0.22em] text-[#7a6030]">{step.number}</p>
              <h3 className="mt-[26px] text-[26px] font-black leading-tight">{step.title}</h3>
              <p className="mt-4 max-w-[26ch] text-sm font-semibold leading-relaxed text-[#171717]/58">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function SavingsCalculator({ locale }: { locale: Locale }) {
  const copy = content[locale].calculator;
  const [monthlySaas, setMonthlySaas] = useState(4500);
  const [weeklyHours, setWeeklyHours] = useState(28);
  const [hourlyCost, setHourlyCost] = useState(35);

  const monthlyLeak = useMemo(
    () => monthlySaas + weeklyHours * hourlyCost * 4.33,
    [monthlySaas, weeklyHours, hourlyCost]
  );
  const yearlyLeak = monthlyLeak * 12;

  return (
    <section id="calculadora" className="bg-[#171717] px-5 py-[68px] text-[#f4f0e8] md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-7xl gap-[42px] lg:grid-cols-[0.618fr_1fr] lg:items-start lg:gap-[68px]">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65 }}
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#56b6b2]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-[16ch] text-[clamp(2.625rem,5vw,4.25rem)] font-black leading-[0.92] tracking-[-0.025em]">
            {copy.title}
          </h2>
          <p className="mt-[26px] max-w-[42ch] text-lg font-medium leading-relaxed text-[#f4f0e8]/62">
            {copy.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="border border-[#f4f0e8]/18 bg-[#f4f0e8] p-[26px] text-[#171717] shadow-[16px_16px_0_#56b6b2]"
        >
          <div className="grid gap-[26px]">
            {[
              { label: copy.toolsLabel, value: monthlySaas, min: 0, max: 30000, step: 250, setValue: setMonthlySaas },
              { label: copy.hoursLabel, value: weeklyHours, min: 0, max: 120, step: 1, setValue: setWeeklyHours },
              { label: copy.rateLabel, value: hourlyCost, min: 5, max: 150, step: 5, setValue: setHourlyCost },
            ].map((control) => (
              <label key={control.label} className="grid gap-3">
                <span className="flex items-end justify-between gap-4">
                  <span className="text-sm font-black">{control.label}</span>
                  <input
                    type="number"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={control.value}
                    onChange={(event) => control.setValue(Number(event.target.value))}
                    className="h-10 w-28 border border-[#171717]/25 bg-white px-3 text-right text-sm font-black outline-none focus:border-[#171717]"
                  />
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(event) => control.setValue(Number(event.target.value))}
                  className="w-full accent-[#171717]"
                />
              </label>
            ))}
          </div>

          <div className="mt-[42px] grid gap-4 border-t border-[#171717] pt-[26px] sm:grid-cols-[0.618fr_1fr]">
            <div className="bg-[#171717] p-5 text-[#f4f0e8]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f4f0e8]/48">
                {copy.monthlyLeak}
              </p>
              <p className="mt-4 text-4xl font-black leading-none tracking-normal">
                {formatCurrency(monthlyLeak, locale)}
              </p>
            </div>
            <div className="border border-[#171717]/20 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#171717]/48">
                {copy.yearlyLeak}
              </p>
              <p className="mt-4 text-4xl font-black leading-none tracking-normal">
                {formatCurrency(yearlyLeak, locale)}
              </p>
            </div>
          </div>

          <div className="mt-[26px] flex flex-col gap-4 border-t border-[#171717]/15 pt-[26px] sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm font-semibold leading-relaxed text-[#171717]/58">{copy.note}</p>
            <a
              href="https://calendly.com/soyartemio/30min"
              className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#171717] px-5 py-3 text-sm font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]"
            >
              {copy.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MobileHero({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <section className="relative overflow-hidden bg-[#f4f0e8] px-5 pb-[68px] pt-[26px] md:hidden">
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(#171717_1px,transparent_1px),linear-gradient(90deg,#171717_1px,transparent_1px)] [background-size:42px_42px]" />
      <nav className="relative z-10 flex items-center justify-between border-b border-[#171717]/15 pb-4">
        <Link href="/" className="shrink-0">
          <BrandMark />
        </Link>
        <Link
          href={copy.nav.localeHref}
          className="rounded-full border border-[#171717]/25 px-3 py-2 text-[10px] font-black text-[#171717]/70"
        >
          {copy.nav.localeLabel}
        </Link>
      </nav>

      <div className="relative z-10 pt-[68px]">
        <p className="inline-flex border-y border-[#171717]/20 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#7a6030]">
          {copy.mobile.eyebrow}
        </p>
        <h1 className="mt-[26px] max-w-[9ch] text-[clamp(3.15rem,15vw,4.25rem)] font-black leading-[0.84] tracking-[-0.055em]">
          {copy.mobile.heroTitle}
        </h1>
        <p className="mt-[26px] max-w-[32ch] text-base font-semibold leading-relaxed text-[#171717]/68">
          {copy.mobile.heroBody}
        </p>

        <div className="mt-[42px] grid gap-3">
          <a
            href="https://calendly.com/soyartemio/30min"
            className="inline-flex min-h-14 items-center justify-between rounded-full bg-[#171717] px-[26px] text-base font-black text-[#f4f0e8]"
          >
            {copy.mobile.primaryCta}
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#calculadora-mobile"
            className="inline-flex min-h-14 items-center justify-between rounded-full border border-[#171717]/25 px-[26px] text-sm font-black text-[#171717]"
          >
            {copy.mobile.secondaryCta}
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#171717]/48">
          {copy.hero.auditNote}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.18, ease: EASE }}
          className="mt-[68px] border border-[#171717] bg-[#fbf7ef] p-[26px] shadow-[10px_10px_0_#171717]"
        >
          <div className="border-b border-[#171717] pb-[26px]">
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#7a6030]">
              {copy.mobile.receiptLabel}
            </p>
            <h2 className="mt-4 max-w-[11ch] text-[42px] font-black leading-[0.9] tracking-[-0.04em]">
              {copy.mobile.receiptTitle}
            </h2>
          </div>

          <div className="divide-y divide-[#171717]/15">
            {copy.act.transformations.map((item) => (
              <div key={item.before} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4">
                <span className="text-xs font-bold leading-tight text-[#171717]/42 line-through decoration-[#b8954f] decoration-2">
                  {item.before}
                </span>
                <ArrowRight className="h-4 w-4 text-[#7a6030]" />
                <span className="text-right text-sm font-black leading-tight">{item.after}</span>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between border-t border-[#171717] pt-[26px]">
            <p className="max-w-[18ch] text-xs font-bold leading-relaxed text-[#171717]/55">
              {copy.mobile.receiptNote}
            </p>
            <div className="text-right">
              <p className="text-[42px] font-black leading-none">0</p>
              <p className="mt-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#171717]/45">{copy.act.lockIn}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MobileOffer({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <section id="oferta-mobile" className="bg-[#0f1010] px-5 py-[68px] text-[#f4f0e8] md:hidden">
      <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#56b6b2]">
        {copy.mobile.offerEyebrow}
      </p>
      <h2 className="mt-4 max-w-[9ch] text-[42px] font-black leading-[0.9] tracking-[-0.04em]">
        {copy.mobile.offerTitle}
      </h2>
      <p className="mt-[26px] max-w-[30ch] text-base font-medium leading-relaxed text-[#f4f0e8]/58">
        {copy.mobile.offerBody}
      </p>

      <div className="mt-[42px] border-y border-[#f4f0e8]/15">
        {copy.services.cards.map((card) => (
          <article key={card.title} className="grid grid-cols-[42px_1fr] gap-4 border-b border-[#f4f0e8]/12 py-[26px] last:border-b-0">
            <div className="flex h-[42px] w-[42px] items-center justify-center border border-[#56b6b2]/45 text-[#56b6b2]">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">{card.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#f4f0e8]/48">{card.subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-[68px]">
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#b8954f]">
          {copy.mobile.methodEyebrow}
        </p>
        <h3 className="mt-4 max-w-[12ch] text-[26px] font-black leading-tight">
          {copy.mobile.methodTitle}
        </h3>
        <ol className="mt-[26px] border-t border-[#f4f0e8]/15">
          {copy.mobile.methodSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-[26px] border-b border-[#f4f0e8]/12 py-4">
              <span className="font-mono text-[10px] font-black text-[#b8954f]">0{index + 1}</span>
              <span className="text-base font-black">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MobileSavingsCalculator({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const [monthlySaas, setMonthlySaas] = useState(4500);
  const [weeklyHours, setWeeklyHours] = useState(28);
  const [hourlyCost, setHourlyCost] = useState(35);

  const yearlyLeak = useMemo(
    () => (monthlySaas + weeklyHours * hourlyCost * 4.33) * 12,
    [monthlySaas, weeklyHours, hourlyCost]
  );

  const controls = [
    { label: copy.calculator.toolsLabel, value: monthlySaas, display: formatCurrency(monthlySaas, locale), min: 0, max: 30000, step: 250, setValue: setMonthlySaas },
    { label: copy.calculator.hoursLabel, value: weeklyHours, display: `${weeklyHours} h`, min: 0, max: 120, step: 1, setValue: setWeeklyHours },
    { label: copy.calculator.rateLabel, value: hourlyCost, display: `${formatCurrency(hourlyCost, locale)} / h`, min: 5, max: 150, step: 5, setValue: setHourlyCost },
  ];

  return (
    <section id="calculadora-mobile" className="bg-[#f4f0e8] px-5 py-[68px] md:hidden">
      <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#7a6030]">
        {copy.mobile.calculatorEyebrow}
      </p>
      <h2 className="mt-4 max-w-[11ch] text-[42px] font-black leading-[0.9] tracking-[-0.04em]">
        {copy.mobile.calculatorTitle}
      </h2>
      <p className="mt-[26px] max-w-[30ch] text-base font-medium leading-relaxed text-[#171717]/58">
        {copy.mobile.calculatorBody}
      </p>

      <div className="mt-[42px] border border-[#171717] bg-[#fbf7ef] p-[26px] shadow-[10px_10px_0_#56b6b2]">
        <div className="grid gap-[26px]">
          {controls.map((control) => (
            <label key={control.label} className="grid gap-3">
              <span className="flex items-end justify-between gap-4">
                <span className="max-w-[18ch] text-xs font-black leading-tight">{control.label}</span>
                <span className="shrink-0 font-mono text-xs font-black text-[#7a6030]">{control.display}</span>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(event) => control.setValue(Number(event.target.value))}
                className="w-full accent-[#171717]"
              />
            </label>
          ))}
        </div>

        <div className="mt-[42px] bg-[#171717] p-[26px] text-[#f4f0e8]">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#b8954f]">
            {copy.mobile.calculatorResult}
          </p>
          <p className="mt-4 text-[42px] font-black leading-none tracking-[-0.035em]">
            {formatCurrency(yearlyLeak, locale)}
          </p>
        </div>

        <a
          href="https://calendly.com/soyartemio/30min"
          className="mt-[26px] inline-flex min-h-14 w-full items-center justify-between rounded-full bg-[#171717] px-[26px] text-sm font-black text-[#f4f0e8]"
        >
          {copy.mobile.calculatorCta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function MobileBio({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <section className="bg-[#f4f0e8] px-5 py-[68px] md:hidden">
      <div className="grid grid-cols-[0.618fr_1fr] items-stretch gap-[26px] border-y border-[#171717]/15 py-[42px]">
        <div className="relative min-h-[210px] overflow-hidden border border-[#171717] bg-[#171717]">
          <Image
            src="/assets/miimagen.jpg"
            alt={copy.bio.imageAlt}
            fill
            sizes="38vw"
            className="object-cover object-top grayscale"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/65 to-transparent" />
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#7a6030]">
              {copy.mobile.bioEyebrow}
            </p>
            <h2 className="mt-4 text-[26px] font-black leading-[0.95] tracking-[-0.035em]">
              {copy.mobile.bioTitle}
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#171717]/58">
              {copy.mobile.bioBody}
            </p>
          </div>
          <a href="https://calendly.com/soyartemio/30min" className="mt-[26px] inline-flex items-center gap-2 text-sm font-black">
            {copy.mobile.primaryCta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ locale }: { locale: Locale }) {
  const copy = content[locale].faq;

  return (
    <section className="bg-[#f4f0e8] px-5 py-[68px] md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-7xl gap-[42px] lg:grid-cols-[0.618fr_1fr] lg:gap-[68px]">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#7a6030]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-[16ch] text-[clamp(2.625rem,4.6vw,4.25rem)] font-black leading-[0.94] tracking-[-0.025em]">
            {copy.title}
          </h2>
        </div>
        <div className="divide-y divide-[#171717]/15 border-y border-[#171717]/15">
          {copy.items.map((item) => (
            <details key={item.question} className="group py-[26px]">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-xl font-black leading-tight">
                {item.question}
                <span className="mt-1 text-[#7a6030] transition group-open:rotate-90">
                  <ChevronRight className="h-5 w-5" />
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-[#171717]/62">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const links = [
    { href: "#diagnostico", label: copy.nav.diagnosis },
    { href: "#propiedad", label: copy.nav.blueprint },
    { href: "#calculadora", label: copy.nav.savings },
  ];

  return (
    <footer className="bg-[#171717] px-5 py-[68px] text-[#f4f0e8] md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-[42px] border-b border-[#f4f0e8]/15 pb-[42px] md:grid-cols-[1fr_0.382fr_0.618fr] md:gap-[68px]">
          <div>
            <BrandMark inverted />
            <p className="mt-[26px] max-w-[42ch] text-sm font-medium leading-relaxed text-[#f4f0e8]/60">
              {copy.footer.tagline}
            </p>
            <a
              href="https://calendly.com/soyartemio/30min"
              className="mt-[26px] inline-flex items-center gap-3 rounded-full bg-[#f4f0e8] px-[26px] py-4 text-sm font-black text-[#171717] transition hover:bg-white"
            >
              {copy.footer.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <nav aria-label={copy.footer.navTitle} className="hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b8954f]">
              {copy.footer.navTitle}
            </p>
            <ul className="mt-5 grid gap-3 text-sm font-semibold text-[#f4f0e8]/65">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-[#f4f0e8]">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={copy.nav.localeHref} className="transition hover:text-[#f4f0e8]">
                  {copy.nav.localeLabel}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b8954f]">
              {copy.footer.contactTitle}
            </p>
            <ul className="mt-5 grid gap-3 text-sm font-semibold text-[#f4f0e8]/65">
              <li>
                <a href="mailto:yo@soyartemio.me" className="font-mono transition hover:text-[#f4f0e8]">
                  yo@soyartemio.me
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/soyartemio/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#f4f0e8]"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-[26px] text-xs font-semibold text-[#f4f0e8]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SoyArtemio. {copy.footer.rights}
          </p>
          <p>{copy.footer.origin}</p>
        </div>
      </div>
    </footer>
  );
}

export default function ConceptExperience({ locale = "es" }: { locale?: Locale }) {
  const copy = content[locale];
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#171717]">
      <MobileHero locale={locale} />

      <section className="relative hidden min-h-screen overflow-hidden px-5 py-6 md:block md:px-10">
        <motion.div
          variants={drawX}
          initial="hidden"
          animate="visible"
          className="absolute inset-x-0 top-0 h-px origin-left bg-[#171717]/20"
        />
        <motion.div
          variants={drawY}
          initial="hidden"
          animate="visible"
          className="absolute inset-y-0 left-[52%] hidden w-px origin-top bg-[#171717]/10 xl:block"
        />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-b border-[#171717]/15 pb-5">
          <Link href="/" className="shrink-0 transition opacity-95 hover:opacity-70">
            <BrandMark />
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#171717]/60 md:flex">
            <a href="#diagnostico" className="transition hover:text-[#171717]">
              {copy.nav.diagnosis}
            </a>
            <a href="#propiedad" className="transition hover:text-[#171717]">
              {copy.nav.blueprint}
            </a>
            <a href="#calculadora" className="transition hover:text-[#171717]">
              {copy.nav.savings}
            </a>
          </div>
          <Link
            href={copy.nav.localeHref}
            className="hidden rounded-full border border-[#171717]/25 px-3 py-2 text-xs font-black text-[#171717]/70 transition hover:border-[#171717] hover:text-[#171717] md:inline-flex"
          >
            {copy.nav.localeLabel}
          </Link>
          <a
            href="https://calendly.com/soyartemio/30min"
            className="hidden rounded-full bg-[#171717] px-5 py-2 text-sm font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b] sm:inline-flex"
          >
            {copy.nav.cta}
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl min-w-0 items-center gap-[42px] py-[42px] md:py-[68px] xl:min-h-[calc(100vh-84px)] xl:grid-cols-[0.618fr_1fr] xl:gap-[68px]">
          <motion.div variants={sequence} initial="hidden" animate="visible" className="min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-none">
            <motion.div variants={rise} className="mb-7 inline-flex max-w-full items-center gap-3 border-y border-[#171717]/20 py-2 pr-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#171717]/70 sm:pr-4 sm:text-xs sm:tracking-[0.28em]">
              <motion.span
                className="h-2 w-2 shrink-0 rounded-full bg-[#b8954f]"
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="whitespace-nowrap">{copy.hero.eyebrow}</span>
            </motion.div>

            {/*
              El tamaño se calcula contra la COLUMNA, no contra el viewport: con
              10vw el titular medía 139px dentro de una columna de 640 y se
              partía en cinco renglones. El tracking se cierra a −0.03em porque
              a este cuerpo el espaciado por defecto se ve suelto.
            */}
            <h1 className="max-w-[21rem] text-[clamp(2.625rem,5.6vw,5.5rem)] font-black leading-[0.9] tracking-[-0.035em] text-balance text-[#171717] sm:max-w-[15ch]">
              <span className="sr-only">{copy.hero.title}</span>
              <MaskedWords text={copy.hero.title} />
            </h1>

            <motion.p variants={rise} className="mt-[26px] max-w-[21rem] text-[clamp(1rem,1.5vw,1.3125rem)] font-medium leading-snug text-[#2f2f2f] sm:max-w-[42ch]">
              {copy.hero.body}
            </motion.p>

            <motion.div variants={rise} className="mt-[42px] flex flex-col gap-3 sm:flex-row">
              {/* El relleno entra por la izquierda en vez de cambiar de color de
                  golpe: un botón que se llena se siente construido. */}
              <a
                href="https://calendly.com/soyartemio/30min"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#171717] px-[26px] py-4 text-base font-black text-[#f4f0e8] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-[#b8954f] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
                <span className="relative transition-colors duration-300 group-hover:text-[#171717]">{copy.hero.primaryCta}</span>
                <ArrowRight className="relative h-5 w-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[#171717]" />
              </a>
              <a
                href="#calculadora"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#171717]/30 px-[26px] py-4 text-base font-black text-[#171717] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#171717] motion-reduce:hover:translate-y-0"
              >
                {copy.hero.secondaryCta}
              </a>
            </motion.div>
            <motion.p variants={rise} className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#171717]/48">
              {copy.hero.auditNote}
            </motion.p>

            <motion.div variants={rise} className="mt-[42px] grid max-w-[21rem] gap-4 border-l border-[#171717]/20 pl-[26px] sm:max-w-[68ch]">
              {copy.hero.outcomes.map((item) => (
                <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-[#171717]/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7a6030]" />
                  {item}
                </p>
              ))}
            </motion.div>
          </motion.div>

          <AnimatedDataAct locale={locale} />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl border-y border-[#171717]/15 md:grid-cols-4">
          {copy.hero.proofStrip.map((item, index) => (
            /* La tinta sube desde abajo en vez de encenderse de golpe: el hover
               tiene dirección, y esa dirección es la que se siente cara. */
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: EASE, delay: 0.62 + index * 0.075 }}
              className="group relative grid min-h-[110px] content-between overflow-hidden border-b border-[#171717]/15 px-0 py-[26px] text-[#171717] md:border-b-0 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#171717] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 motion-reduce:transition-none" />
              <span className="relative flex items-center justify-between gap-4 px-0 text-[11px] font-black uppercase tracking-[0.24em] text-[#171717]/45 transition-colors duration-300 group-hover:text-[#b8954f] md:px-1">
                <span>{String(index + 1).padStart(2, "0")} / {item.label}</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
              </span>
              <span className="relative md:px-1">
                <span className="block text-lg font-black leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-[#f4f0e8]">{item.title}</span>
                <span className="mt-2 block text-sm font-semibold leading-snug text-[#171717]/55 transition-colors duration-300 group-hover:text-[#f4f0e8]/60">{item.body}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      <div className="hidden md:block">
        <ServiceGrid locale={locale} />
        <UseCasesSection locale={locale} />
        <ProcessSection locale={locale} />
        <SavingsCalculator locale={locale} />
        <BlueprintPyramid locale={locale} />

        <section className="bg-[#f4f0e8] px-5 py-[68px] md:px-10 md:py-[110px]">
          <div className="mx-auto grid max-w-7xl gap-[42px] border-y border-[#171717]/15 py-[42px] md:grid-cols-[0.618fr_1fr] md:items-center md:gap-[68px] md:py-[68px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative h-[336px] overflow-hidden border border-[#171717] bg-[#171717] md:h-[420px]"
            >
              <Image
                src="/assets/miimagen.jpg"
                alt={copy.bio.imageAlt}
                fill
                sizes="36vw"
                className="object-cover object-top grayscale"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-[#f4f0e8]">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b8954f]">{copy.bio.label}</p>
                <p className="mt-2 text-xl font-black">{copy.bio.cardTitle}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#7a6030]">{copy.bio.eyebrow}</p>
              <h2 className="max-w-[16ch] text-[clamp(2.625rem,5vw,4.25rem)] font-black leading-[0.92] tracking-[-0.025em]">
                {copy.bio.title}
              </h2>
              <p className="mt-[26px] max-w-[42ch] text-lg font-medium leading-relaxed text-[#171717]/68">
                {copy.bio.body}
              </p>
              <div className="mt-[42px] flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://calendly.com/soyartemio/30min"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#171717] px-[26px] py-4 text-base font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]"
                >
                  {copy.bio.cta}
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="mailto:yo@soyartemio.me"
                  className="inline-flex items-center justify-center rounded-full border border-[#171717]/30 px-[26px] py-4 text-base font-black text-[#171717] transition hover:border-[#171717]"
                >
                  yo@soyartemio.me
                </a>
                <a
                  href="https://www.linkedin.com/in/soyartemio/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#171717]/30 px-[26px] py-4 text-base font-black text-[#171717] transition hover:border-[#171717]"
                >
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <MobileOffer locale={locale} />
      <MobileSavingsCalculator locale={locale} />
      <MobileBio locale={locale} />

      <section className="relative overflow-hidden bg-[#b8954f] px-5 py-[68px] text-[#171717] md:px-10 md:py-[110px]">
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(#171717_1px,transparent_1px),linear-gradient(90deg,#171717_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full border border-[#171717]/15" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-7 text-xs font-black uppercase tracking-[0.34em] text-[#171717]/62">{copy.manifesto.eyebrow}</p>
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.72, ease: EASE }}
            className="max-w-[16ch] text-[clamp(4.25rem,9vw,8.875rem)] font-black leading-[0.82] tracking-[-0.055em]"
          >
            {copy.manifesto.title}
          </motion.h2>
          <div className="mt-[68px] grid gap-[26px] border-t border-[#171717]/25 pt-[26px] md:grid-cols-[0.382fr_0.618fr_1fr] md:gap-[42px]">
            <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#171717]/58">SOYARTEMIO / 01</p>
            <p className="text-lg font-bold leading-relaxed text-[#171717]/75">{copy.manifesto.p1}</p>
            <div>
              <p className="hidden text-lg font-bold leading-relaxed text-[#171717]/75 md:block">{copy.manifesto.p2}</p>
              <a href="https://calendly.com/soyartemio/30min" className="group mt-[26px] inline-flex w-max items-center gap-3 rounded-full bg-[#171717] px-[26px] py-4 text-base font-black text-[#f4f0e8] transition hover:bg-[#071312]">
                {copy.manifesto.cta}
                <Zap className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <FaqSection locale={locale} />
      <SiteFooter locale={locale} />
      <VoiceAgent locale={locale} />
    </main>
  );
}

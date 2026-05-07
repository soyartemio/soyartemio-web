"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
  MessageCircle,
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
  "mx-auto w-[64%] border-[#b8954f] bg-[#2b2417]",
  "mx-auto w-[82%] border-[#56b6b2] bg-[#102b2b]",
  "w-full border-[#7d8fd6] bg-[#151d3b]",
];

const content = {
  es: {
    nav: {
      diagnosis: "Diagnóstico",
      blueprint: "Blueprint",
      savings: "Ahorro",
      cta: "Agendar auditoría",
      localeHref: "/en/concept",
      localeLabel: "EN",
    },
    hero: {
      eyebrow: "IA aplicada a margen, datos y operación",
      title: "Deja de usar la IA como un juguete.",
      body: "Conviértela en infraestructura operativa propia: sistemas de IA que automatizan tu operación, protegen tus datos y reemplazan rentas de software por activos que sí te pertenecen.",
      primaryCta: "Agendar auditoría gratuita",
      secondaryCta: "Calcular lo que dejo de rentar",
      outcomes: [
        "Dejas de pagar rentas por herramientas que no controlas.",
        "Tus datos, procesos y automatizaciones viven en un sistema propio.",
        "Te acompaño desde el diagnóstico hasta que tu equipo lo usa.",
      ],
      proofStrip: [
        { label: "Diagnóstico", title: "Dónde se fuga margen", body: "Mapa claro antes de construir.", href: "#diagnostico" },
        { label: "Automatización", title: "Qué puede trabajar solo", body: "Flujos reales, no demos.", href: "#propiedad" },
        { label: "Propiedad de datos", title: "Qué vuelve a ser tuyo", body: "Activos internos bajo control.", href: "#acta" },
        { label: "Ahorro SaaS", title: "Qué dejas de rentar", body: "Rentas convertidas en sistema.", href: "#ahorro" },
      ],
    },
    act: {
      eyebrow: "Acta de propiedad operativa",
      title: "Tu empresa deja de rentar su operación",
      input: "Entrada detectada",
      working: "IA trabajando",
      generated: "Acta generada",
      result: "Resultado",
      lockIn: "lock-in",
      resultBody: "rentas innecesarias como base de crecimiento",
      dataTitle: "Tus datos",
      dataBody: "ordenados, consultables y bajo tu control",
      systemTitle: "Tu sistema",
      systemBody: "hecho alrededor de cómo trabaja tu equipo",
      supportTitle: "Mi acompañamiento",
      supportBody: "diagnóstico, implementación y adopción real",
      savingsLine: "El ahorro no es el final. Es el presupuesto para construir propiedad.",
      savingsBadge: "Margen recuperado",
      transformations: [
        { before: "Rentas de software", after: "Activos internos" },
        { before: "Datos regados", after: "Fuente de verdad" },
        { before: "Trabajo repetitivo", after: "Agentes operando" },
      ],
      workSteps: [
        "Leyendo operación actual",
        "Detectando fugas SaaS",
        "Cruzando datos y procesos",
        "Generando arquitectura propia",
      ],
    },
    services: {
      eyebrow: "Lo que construimos juntos",
      title: "Del caos operativo a un sistema que trabaja contigo.",
      cards: [
        {
          icon: icons.strategy,
          title: "Estrategia y Consultoría IA",
          subtitle: "Del concepto inicial al mapa de implementación.",
          body: "Evaluación tecnológica, recomendaciones estratégicas y próximos pasos claros para que la IA tenga sentido en tu operación.",
        },
        {
          icon: icons.training,
          title: "Capacitación IA Interna",
          subtitle: "Tu equipo entiende, adopta y aplica la tecnología.",
          body: "Workshops, mejores prácticas y guía práctica para que la IA no dependa de una sola persona ni se quede como experimento.",
        },
        {
          icon: icons.custom,
          title: "Soluciones IA a Medida",
          subtitle: "Sistemas inteligentes para tus requisitos reales.",
          body: "Desde agentes conversacionales hasta automatización de flujos, construidos alrededor de tu contexto y tus datos.",
        },
        {
          icon: icons.implementation,
          title: "Implementación de Proyectos",
          subtitle: "Ejecución completa, de arquitectura a despliegue.",
          body: "Sistemas listos para producción con monitoreo, soporte y mejora continua para que la operación realmente cambie.",
        },
      ],
    },
    blueprint: {
      eyebrow: "Arquitectura, no espectáculo",
      title: "La IA seria se construye por capas.",
      body: "No empezamos con una herramienta. Empezamos con tus datos, tus procesos y tus decisiones repetidas. Luego diseñamos la inteligencia que las conecta.",
      metrics: [
        { icon: icons.time, title: "Tiempo recuperado", body: "Automatización de tareas repetitivas para liberar capacidad del equipo." },
        { icon: icons.data, title: "Datos bajo control", body: "Información unificada para dejar de adivinar y empezar a decidir." },
        { icon: icons.savings, title: "Rentas convertidas", body: "El ahorro deja de ser recorte y se vuelve presupuesto para construir activos." },
      ],
      layers: [
        { number: "03", title: "Validación, confianza y control", body: "Auditoría, permisos, trazabilidad y reglas para que la IA trabaje con criterio operativo.", label: "CONTROL" },
        { number: "02", title: "Marco operativo de IA", body: "Agentes, automatizaciones, memoria, evaluaciones y flujos que conectan decisiones con ejecución.", label: "OPERACIÓN" },
        { number: "01", title: "Fundación de datos propios", body: "Información unificada, conocimiento interno, procesos críticos y fuentes de verdad bajo tu dominio.", label: "PROPIEDAD" },
      ],
    },
    bio: {
      imageAlt: "Artemio, consultor estratégico de IA y arquitectura operativa",
      label: "Soy Artemio",
      cardTitle: "Arquitecto de IA para operaciones que necesitan control.",
      eyebrow: "Quién te acompaña",
      title: "No soy un proveedor de software. Soy el arquitecto que entra contigo al caos.",
      body: "Mi trabajo es entender cómo opera tu empresa, detectar dónde se pierde tiempo, margen y control, y convertirlo en sistemas de IA propios que tu equipo pueda usar todos los días.",
      cta: "Agendar auditoría gratuita",
    },
    manifesto: {
      eyebrow: "Manifiesto operativo",
      title: "No eres usuario de tu operación. Eres dueño.",
      p1: "La IA no se compra como suscripción y se espera que haga magia. Se diseña alrededor de tus flujos, tus datos y tus decisiones.",
      p2: "Mi trabajo es entrar contigo al caos operativo, encontrar dónde se pierde tiempo, margen y control, y convertirlo en una arquitectura que tu equipo pueda usar todos los días.",
      cta: "Empezar con diagnóstico",
    },
    whatsapp: {
      label: "Resolver duda por WhatsApp",
      title: "Dudas rápidas",
      body: "Te respondo sobre IA, datos propios y ahorro SaaS.",
      message:
        "Hola Artemio, vengo de tu página. Quiero resolver una duda sobre cómo convertir IA en infraestructura operativa propia.",
    },
  },
  en: {
    nav: {
      diagnosis: "Diagnosis",
      blueprint: "Blueprint",
      savings: "Savings",
      cta: "Book audit",
      localeHref: "/concept",
      localeLabel: "ES",
    },
    hero: {
      eyebrow: "AI applied to margin, data, and operations",
      title: "Stop using AI like a toy.",
      body: "Turn it into owned operating infrastructure: AI systems that automate your operation, protect your data, and replace software rent with assets your company actually owns.",
      primaryCta: "Book a free audit",
      secondaryCta: "Calculate what I stop renting",
      outcomes: [
        "You stop paying rent for tools you do not control.",
        "Your data, processes, and automations live inside your own system.",
        "I work with you from diagnosis until your team uses it in production.",
      ],
      proofStrip: [
        { label: "Diagnosis", title: "Where margin leaks", body: "A clear map before building.", href: "#diagnostico" },
        { label: "Automation", title: "What can work alone", body: "Real workflows, not demos.", href: "#propiedad" },
        { label: "Data ownership", title: "What becomes yours", body: "Internal assets under control.", href: "#acta" },
        { label: "SaaS savings", title: "What you stop renting", body: "Rent turned into systems.", href: "#ahorro" },
      ],
    },
    act: {
      eyebrow: "Operating ownership deed",
      title: "Your company stops renting its operation",
      input: "Detected input",
      working: "AI working",
      generated: "Deed generated",
      result: "Result",
      lockIn: "lock-in",
      resultBody: "unnecessary software rent as a growth foundation",
      dataTitle: "Your data",
      dataBody: "organized, searchable, and under your control",
      systemTitle: "Your system",
      systemBody: "built around how your team actually works",
      supportTitle: "My support",
      supportBody: "diagnosis, implementation, and real adoption",
      savingsLine: "Savings are not the end. They are the budget to build ownership.",
      savingsBadge: "Recovered margin",
      transformations: [
        { before: "Software rent", after: "Internal assets" },
        { before: "Scattered data", after: "Source of truth" },
        { before: "Repetitive work", after: "Agents operating" },
      ],
      workSteps: [
        "Reading current operation",
        "Detecting SaaS leakage",
        "Mapping data and workflows",
        "Generating owned architecture",
      ],
    },
    services: {
      eyebrow: "What we build together",
      title: "From operational chaos to a system that works with you.",
      cards: [
        {
          icon: icons.strategy,
          title: "AI Strategy & Consulting",
          subtitle: "From initial concept to implementation roadmap.",
          body: "Technology assessment, strategic recommendations, and clear next steps so AI makes sense inside your operation.",
        },
        {
          icon: icons.training,
          title: "Internal AI Training",
          subtitle: "Your team understands, adopts, and applies the technology.",
          body: "Workshops, best practices, and hands-on guidance so AI does not depend on one person or stay trapped as an experiment.",
        },
        {
          icon: icons.custom,
          title: "Custom AI Solutions",
          subtitle: "Intelligent systems tailored to your actual requirements.",
          body: "From conversational agents to workflow automation, built around your context and your data.",
        },
        {
          icon: icons.implementation,
          title: "Project Implementation",
          subtitle: "Complete execution from architecture to deployment.",
          body: "Production-ready systems with monitoring, support, and continuous improvement so the operation actually changes.",
        },
      ],
    },
    blueprint: {
      eyebrow: "Architecture, not spectacle",
      title: "Serious AI is built in layers.",
      body: "We do not start with a tool. We start with your data, your processes, and your repeated decisions. Then we design the intelligence that connects them.",
      metrics: [
        { icon: icons.time, title: "Recovered time", body: "Automation of repetitive work to free up team capacity." },
        { icon: icons.data, title: "Data under control", body: "Unified information so you stop guessing and start deciding." },
        { icon: icons.savings, title: "Rent converted", body: "Savings stop being a cut and become budget to build assets." },
      ],
      layers: [
        { number: "03", title: "Validation, trust, and control", body: "Auditing, permissions, traceability, and rules so AI works with operational judgment.", label: "CONTROL" },
        { number: "02", title: "AI operating framework", body: "Agents, automations, memory, evaluations, and workflows that connect decisions with execution.", label: "OPERATION" },
        { number: "01", title: "Owned data foundation", body: "Unified information, internal knowledge, critical processes, and sources of truth under your domain.", label: "OWNERSHIP" },
      ],
    },
    bio: {
      imageAlt: "Artemio, AI strategy consultant and operating architecture specialist",
      label: "I am Artemio",
      cardTitle: "AI architect for operations that need control.",
      eyebrow: "Who works with you",
      title: "I am not a software vendor. I am the architect who enters the chaos with you.",
      body: "My job is to understand how your company operates, detect where time, margin, and control are being lost, and turn that into owned AI systems your team can use every day.",
      cta: "Book a free audit",
    },
    manifesto: {
      eyebrow: "Operating manifesto",
      title: "You are not a user of your operation. You own it.",
      p1: "AI is not something you buy as a subscription and hope it performs magic. It is designed around your workflows, your data, and your decisions.",
      p2: "My work is to enter the operational chaos with you, find where time, margin, and control are leaking, and turn that into architecture your team can use every day.",
      cta: "Start with a diagnosis",
    },
    whatsapp: {
      label: "Ask on WhatsApp",
      title: "Quick questions",
      body: "Ask about AI, owned data, and SaaS savings.",
      message:
        "Hi Artemio, I came from your website. I want to ask about turning AI into owned operating infrastructure.",
    },
  },
} as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function BrandMark() {
  return (
    <span className="flex items-center gap-3" aria-label="SoyArtemio">
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden border border-[#171717] bg-[#171717] text-[#f4f0e8]">
        <span className="absolute inset-0 opacity-25 [background-image:linear-gradient(#f4f0e8_1px,transparent_1px),linear-gradient(90deg,#f4f0e8_1px,transparent_1px)] [background-size:9px_9px]" />
        <span className="relative text-[11px] font-black uppercase tracking-[-0.03em]">sa</span>
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#b8954f]" />
      </span>
      <span className="leading-none">
        <span className="block text-sm font-black tracking-[0.22em] text-[#171717]">SOYARTEMIO</span>
        <span className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.22em] text-[#171717]/45 sm:block">
          IA architecture
        </span>
      </span>
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
    <div className="relative">
      <div className="absolute -right-6 top-8 hidden h-[540px] w-[540px] rounded-full border border-[#171717]/10 xl:block" />
        <motion.div
          id="acta"
          initial={{ opacity: 0, y: 28, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-2xl overflow-hidden border border-[#171717] bg-[#fbf7ef] p-4 shadow-[18px_18px_0_#171717] md:p-6"
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

        <div className="relative grid gap-4 py-5 md:grid-cols-[0.95fr_1.1fr_0.95fr]">
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
            className="relative border border-[#171717]/20 bg-[#f4f0e8] p-4"
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
            className="relative overflow-hidden border border-[#171717] bg-[#171717] p-4 text-[#f4f0e8]"
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
                    className="flex items-center gap-2 text-xs font-bold text-[#f4f0e8]/70"
                    animate={prefersReducedMotion ? undefined : { opacity: [0.42, 1, 0.42] }}
                    transition={{ duration: 2.4, delay: index * 0.35, repeat: Infinity }}
                  >
                    <span className="text-[#56b6b2]">0{index + 1}</span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="relative border border-[#171717]/20 bg-[#f4f0e8] p-4"
          >
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#8b6f35]">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.generated}
            </p>
            <div className="mt-4 space-y-3">
              {copy.transformations.map((item) => (
                <div key={item.after} className="flex items-center gap-2 border-b border-[#171717]/10 pb-2 last:border-b-0">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#8b6f35]" />
                  <span className="text-sm font-black text-[#171717]">{item.after}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
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
            <CircleDollarSign className="h-6 w-6 text-[#8b6f35]" />
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
    <section id="propiedad" className="relative overflow-hidden bg-[#090b0c] px-5 py-24 text-[#f4f0e8] md:px-10 md:py-32">
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-[#f4f0e8]/10" />
      <div className="relative mx-auto grid max-w-7xl gap-16 xl:grid-cols-[0.82fr_1.18fr]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.7 }}>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#b8954f]">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-3xl text-[clamp(2.7rem,6vw,6.2rem)] font-black leading-[0.92] tracking-normal">
            {copy.title}
          </h2>
          <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-[#f4f0e8]/68">
            {copy.body}
          </p>
          <div className="mt-10 grid gap-4">
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
                className={`${baseLayerClasses[index]} relative overflow-hidden rounded-[18px] border p-6 shadow-2xl`}
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
    <section id="diagnostico" className="relative bg-[#0f1010] px-5 py-20 text-white md:px-10 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(184,149,79,0.13),transparent_32%),radial-gradient(circle_at_78%_58%,rgba(86,182,178,0.10),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} transition={{ duration: 0.7 }} className="mb-10 max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#56b6b2]">
            {copy.eyebrow}
          </p>
          <h2 className="text-[clamp(2.2rem,4.8vw,4.9rem)] font-black leading-[0.96] tracking-normal">
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
              className="group relative min-h-[250px] overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.04] p-7 transition duration-500 hover:border-[#56b6b2]/50 hover:bg-white/[0.065] md:p-8"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background-image:linear-gradient(120deg,transparent,rgba(86,182,178,0.12),transparent)]" />
              <div className="relative">
                <div className="mb-7 flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-[#56b6b2]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black md:text-2xl">{card.title}</h3>
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

function WhatsAppWidget({ locale }: { locale: Locale }) {
  const copy = content[locale].whatsapp;
  const whatsappHref = `https://wa.me/5261468024571?text=${encodeURIComponent(copy.message)}`;

  return (
    <motion.a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label={copy.label}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="group fixed bottom-4 right-4 z-50 flex h-14 w-14 max-w-[calc(100vw-2rem)] items-center justify-center rounded-full border border-[#f4f0e8]/35 bg-[#171717] p-0 text-[#f4f0e8] shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:rounded-none sm:border-[#171717] sm:bg-[#f4f0e8] sm:p-2 sm:pr-4 sm:text-[#171717] sm:shadow-[8px_8px_0_#171717] sm:hover:shadow-[10px_10px_0_#171717] md:bottom-7 md:right-7"
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#171717] text-[#f4f0e8] sm:h-12 sm:w-12 sm:rounded-none">
        <span className="absolute inset-0 opacity-25 [background-image:linear-gradient(#f4f0e8_1px,transparent_1px),linear-gradient(90deg,#f4f0e8_1px,transparent_1px)] [background-size:10px_10px]" />
        <MessageCircle className="relative h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#56b6b2]" />
      </span>
      <span className="hidden min-w-0 sm:block">
        <span className="block text-sm font-black leading-tight">{copy.title}</span>
        <span className="mt-0.5 block max-w-[230px] truncate text-xs font-semibold text-[#171717]/58">
          {copy.body}
        </span>
      </span>
      <ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-0.5 sm:block" />
    </motion.a>
  );
}

export default function ConceptExperience({ locale = "es" }: { locale?: Locale }) {
  const copy = content[locale];

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#171717]">
      <section className="relative min-h-screen overflow-hidden px-5 py-6 md:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[#171717]/20" />
        <div className="absolute inset-y-0 left-[52%] hidden w-px bg-[#171717]/10 xl:block" />

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
            <a href="#ahorro" className="transition hover:text-[#171717]">
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
            className="rounded-full bg-[#171717] px-5 py-2 text-sm font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]"
          >
            {copy.nav.cta}
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 py-14 md:py-20 xl:min-h-[calc(100vh-84px)] xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div variants={reveal} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
            <div className="mb-8 inline-flex items-center gap-3 border-y border-[#171717]/20 py-2 pr-4 text-xs font-black uppercase tracking-[0.28em] text-[#171717]/70">
              <span className="h-2 w-2 rounded-full bg-[#b8954f]" />
              {copy.hero.eyebrow}
            </div>

            <h1 className="max-w-4xl text-[clamp(3.5rem,9vw,8.7rem)] font-black leading-[0.86] tracking-normal text-[#171717]">
              {copy.hero.title}
            </h1>

            <p className="mt-8 max-w-2xl text-[clamp(1.25rem,2vw,1.65rem)] font-medium leading-snug text-[#2f2f2f]">
              {copy.hero.body}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://calendly.com/soyartemio/30min"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-base font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#ahorro"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#171717]/30 px-7 py-4 text-base font-black text-[#171717] transition hover:border-[#171717]"
              >
                {copy.hero.secondaryCta}
              </a>
            </div>

            <div className="mt-10 grid gap-3 border-l border-[#171717]/20 pl-5">
              {copy.hero.outcomes.map((item) => (
                <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-[#171717]/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8b6f35]" />
                  {item}
                </p>
              ))}
            </div>
          </motion.div>

          <AnimatedDataAct locale={locale} />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl border-y border-[#171717]/15 md:grid-cols-4">
          {copy.hero.proofStrip.map((item, index) => (
            <a key={item.label} href={item.href} className="group grid min-h-[132px] content-between border-b border-[#171717]/15 py-5 text-[#171717] transition duration-300 hover:bg-[#171717] hover:px-5 hover:text-[#f4f0e8] md:border-b-0 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0">
              <span className="flex items-center justify-between gap-4 text-[11px] font-black uppercase tracking-[0.24em] text-current/45 transition group-hover:text-[#b8954f]">
                <span>{String(index + 1).padStart(2, "0")} / {item.label}</span>
                <ChevronRight className="h-4 w-4 text-current/50 transition group-hover:translate-x-1 group-hover:text-[#b8954f]" />
              </span>
              <span>
                <span className="block text-lg font-black leading-tight tracking-normal">{item.title}</span>
                <span className="mt-2 block text-sm font-semibold leading-snug text-current/55">{item.body}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <ServiceGrid locale={locale} />
      <BlueprintPyramid locale={locale} />

      <section className="bg-[#f4f0e8] px-5 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 border-y border-[#171717]/15 py-12 md:grid-cols-[0.72fr_1.28fr] md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative h-[340px] overflow-hidden border border-[#171717] bg-[#171717]"
          >
            <Image
              src="/assets/miimagen.jpg"
              alt={copy.bio.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 36vw"
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
            <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#8b6f35]">{copy.bio.eyebrow}</p>
            <h2 className="max-w-4xl text-[clamp(2.3rem,5vw,5rem)] font-black leading-[0.95] tracking-normal">
              {copy.bio.title}
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-[#171717]/68">
              {copy.bio.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://calendly.com/soyartemio/30min"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-base font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]"
              >
                {copy.bio.cta}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="mailto:yo@soyartemio.me"
                className="inline-flex items-center justify-center rounded-full border border-[#171717]/30 px-7 py-4 text-base font-black text-[#171717] transition hover:border-[#171717]"
              >
                yo@soyartemio.me
              </a>
              <a
                href="https://www.linkedin.com/in/soyartemio/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#171717]/30 px-7 py-4 text-base font-black text-[#171717] transition hover:border-[#171717]"
              >
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f4f0e8] px-5 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 border-t border-[#171717]/15 pt-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#8b6f35]">{copy.manifesto.eyebrow}</p>
            <h2 className="text-[clamp(2.2rem,4vw,4.2rem)] font-black leading-none tracking-normal">
              {copy.manifesto.title}
            </h2>
          </div>
          <div className="grid gap-5 text-lg font-medium leading-relaxed text-[#171717]/68">
            <p>
              {copy.manifesto.p1}
            </p>
            <p>
              {copy.manifesto.p2}
            </p>
            <a href="https://calendly.com/soyartemio/30min" className="mt-3 inline-flex w-max items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-base font-black text-[#f4f0e8] transition hover:bg-[#2b2b2b]">
              {copy.manifesto.cta}
              <Zap className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
      <WhatsAppWidget locale={locale} />
    </main>
  );
}

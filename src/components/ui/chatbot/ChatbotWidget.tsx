"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Calendar, MessageCircle, ArrowRight } from "lucide-react";

type Locale = "es" | "en";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

const UI_TEXT = {
  es: {
    floatingLabel: "Preguntar a la IA",
    floatingTitle: "IA de Artemio",
    floatingSubtitle: "Resuelve dudas al instante",
    headerTitle: "Asistente de IA",
    headerSubtitle: "Operación, Datos y Ahorro",
    inputPlaceholder: "Escribe tu duda...",
    quickSuggestTitle: "Preguntas sugeridas",
    whatsappBtn: "WhatsApp humano",
    calendlyBtn: "Agendar Auditoría (30 min)",
    calendlyCardText: "Conversa directamente con Artemio en una sesión de diagnóstico de 30 minutos.",
    initialMessage: "Hola, soy el asistente de IA de Artemio. ¿Tienes alguna duda sobre cómo convertir la IA en infraestructura propia, automatizar tu operación, o cómo dejar de pagar rentas de software? Pregúntame lo que quieras. Si deseas, también puedo ayudarte a agendar una auditoría gratuita.",
    quickSuggestions: [
      "¿Qué servicios ofrece Artemio?",
      "¿Cómo funciona el ahorro en software (SaaS)?",
      "Quiero agendar una auditoría de 30 min."
    ]
  },
  en: {
    floatingLabel: "Ask the AI",
    floatingTitle: "Artemio's AI",
    floatingSubtitle: "Get instant answers",
    headerTitle: "AI Assistant",
    headerSubtitle: "Operations, Data & Savings",
    inputPlaceholder: "Type your question...",
    quickSuggestTitle: "Suggested questions",
    whatsappBtn: "Human WhatsApp",
    calendlyBtn: "Book Audit (30 min)",
    calendlyCardText: "Speak directly with Artemio in a 30-minute diagnostic session.",
    initialMessage: "Hi, I'm Artemio's AI assistant. Do you have any questions about turning AI into your own operating infrastructure, automating processes, or how to stop renting software? Ask me anything. I can also help you book a free audit.",
    quickSuggestions: [
      "What services does Artemio provide?",
      "How does software savings (SaaS) work?",
      "I want to book a 30-min audit."
    ]
  }
} as const;

export default function ChatbotWidget({ locale = "es" }: { locale?: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const text = UI_TEXT[locale];

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "initial",
        role: "model",
        content: text.initialMessage
      }
    ]);
  }, [locale, text.initialMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (contentToSend: string) => {
    if (!contentToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: contentToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map frontend messages to backend structure
      const formattedHistory = messages
        .concat(userMessage)
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: formattedHistory })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        content: data.reply || "Disculpa, tuve un problema al procesar la respuesta. ¿Podrías intentar de nuevo?"
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot communication error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "model",
          content: locale === "es" 
            ? "Ocurrió un error de conexión al consultar con la IA. Por favor, inténtalo de nuevo."
            : "A connection error occurred. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const whatsappMessage = locale === "es"
    ? "Hola Artemio, vengo de tu página. Quiero resolver una duda sobre cómo convertir la IA en infraestructura operativa."
    : "Hi Artemio, I came from your website. I want to ask about turning AI into operating infrastructure.";
  const whatsappHref = `https://wa.me/5261468024571?text=${encodeURIComponent(whatsappMessage)}`;
  const calendlyHref = "https://calendly.com/soyartemio/30min";

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-open-button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group fixed bottom-4 right-4 z-50 flex h-14 w-14 max-w-[calc(100vw-2rem)] items-center justify-center rounded-full border border-[#f4f0e8]/35 bg-[#171717] p-0 text-[#f4f0e8] shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:rounded-none sm:border-[#171717] sm:bg-[#f4f0e8] sm:p-2 sm:pr-4 sm:text-[#171717] sm:shadow-[8px_8px_0_#171717] sm:hover:shadow-[10px_10px_0_#171717] md:bottom-7 md:right-7"
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#171717] text-[#f4f0e8] sm:h-12 sm:w-12 sm:rounded-none">
              <span className="absolute inset-0 opacity-25 [background-image:linear-gradient(#f4f0e8_1px,transparent_1px),linear-gradient(90deg,#f4f0e8_1px,transparent_1px)] [background-size:10px_10px]" />
              <MessageSquare className="relative h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#56b6b2]" />
            </span>
            <span className="hidden min-w-0 sm:block text-left">
              <span className="block text-sm font-black leading-tight">{text.floatingTitle}</span>
              <span className="mt-0.5 block max-w-[200px] truncate text-xs font-semibold text-[#171717]/58">
                {text.floatingSubtitle}
              </span>
            </span>
            <ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-0.5 sm:block ml-2" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-4 right-4 z-50 flex h-[85vh] max-h-[640px] w-[calc(100vw-2rem)] max-w-[400px] flex-col border border-[#171717] bg-[#fbf7ef] text-[#171717] shadow-[12px_12px_0_#171717] md:bottom-7 md:right-7"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-[#171717] p-4 bg-[#171717] text-[#f4f0e8]">
              <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#f4f0e8_1px,transparent_1px),linear-gradient(90deg,#f4f0e8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center border border-[#f4f0e8]/20 bg-[#f4f0e8]/10 text-[#f4f0e8]">
                  <span className="text-[10px] font-black uppercase">sa</span>
                  <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-[#56b6b2]" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wider uppercase leading-tight">{text.headerTitle}</h3>
                  <p className="text-[10px] font-bold text-[#f4f0e8]/50 uppercase tracking-wider">{text.headerSubtitle}</p>
                </div>
              </div>
              
              <button
                id="chatbot-close-button"
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-1 transition opacity-80 hover:opacity-100 hover:text-[#b8954f]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fbf7ef]">
              {messages.map((message) => {
                // Check if the message contains the [BOOK_MEETING] tag
                const hasBookMeeting = message.content.includes("[BOOK_MEETING]");
                const cleanContent = message.content.replace("[BOOK_MEETING]", "").trim();

                return (
                  <div key={message.id} className="space-y-3">
                    {/* Message Bubble */}
                    <div
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-[#171717] text-[#f4f0e8]"
                            : "border border-[#171717]/15 bg-[#f4f0e8]"
                        }`}
                        style={{
                          boxShadow: message.role === "user" ? "none" : "3px 3px 0 rgba(23, 23, 23, 0.08)"
                        }}
                      >
                        <p className="whitespace-pre-wrap font-medium">{cleanContent}</p>
                      </div>
                    </div>

                    {/* Inline Calendly Card if tagged */}
                    {hasBookMeeting && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="border border-[#171717] bg-[#f4f0e8] p-4 shadow-[4px_4px_0_#171717] mx-1 my-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#b8954f] mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>Auditoría de IA</span>
                        </div>
                        <p className="text-xs text-[#171717]/70 font-semibold mb-3">
                          {text.calendlyCardText}
                        </p>
                        <a
                          href={calendlyHref}
                          target="_blank"
                          rel="noreferrer"
                          id="chatbot-calendly-card-btn"
                          className="flex items-center justify-center gap-2 bg-[#171717] text-[#f4f0e8] font-bold text-xs py-2 px-3 transition hover:bg-[#2b2b2b]"
                        >
                          {text.calendlyBtn}
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="border border-[#171717]/15 bg-[#f4f0e8] p-3 shadow-[3px_3px_0_rgba(23, 23, 23, 0.08)]">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#171717]" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#171717]" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#171717]" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions & Secondary CTA */}
            <div className="border-t border-[#171717]/10 bg-[#fbf7ef] px-4 pt-3 pb-2">
              {messages.length === 1 && !isLoading && (
                <div className="mb-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#171717]/40 mb-1.5">
                    {text.quickSuggestTitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {text.quickSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSendMessage(suggestion)}
                        className="border border-[#171717]/20 bg-[#f4f0e8] hover:border-[#171717] hover:bg-[#171717] hover:text-[#f4f0e8] px-2.5 py-1 text-xs font-semibold transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary WhatsApp contact option */}
              <div className="flex items-center justify-between border-t border-[#171717]/5 pt-2 mt-1">
                <span className="text-[10px] font-semibold text-[#171717]/40">
                  ¿Prefieres hablar con un humano?
                </span>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  id="chatbot-whatsapp-link"
                  className="flex items-center gap-1 text-[11px] font-black text-[#56b6b2] hover:text-[#3da09b] transition uppercase tracking-wider"
                >
                  <MessageCircle className="h-3 w-3" />
                  {text.whatsappBtn}
                </a>
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleFormSubmit}
              className="border-t border-[#171717] p-3 bg-[#f4f0e8] flex gap-2"
            >
              <input
                type="text"
                id="chatbot-input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={text.inputPlaceholder}
                disabled={isLoading}
                className="flex-1 border border-[#171717]/25 bg-[#fbf7ef] px-3 py-2 text-sm text-[#171717] placeholder-[#171717]/40 focus:border-[#171717] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                id="chatbot-submit-button"
                disabled={!inputValue.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center bg-[#171717] text-[#f4f0e8] transition hover:bg-[#b8954f] hover:text-[#171717] disabled:bg-[#171717]/20 disabled:text-[#171717]/40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

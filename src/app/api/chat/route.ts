import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ChatMessage = {
  role?: string;
  content?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
] as const;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "El formato de los mensajes no es válido." },
        { status: 400 }
      );
    }

    const apiKey = await getGeminiApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: "La clave de la API de Gemini no está configurada." },
        { status: 500 }
      );
    }

    const contents = formatMessagesForGemini(messages as ChatMessage[]);

    if (contents.length === 0) {
      return NextResponse.json(
        { error: "No hay mensajes válidos para enviar a la IA." },
        { status: 400 }
      );
    }

    const systemPrompt = `Eres el asistente de IA oficial de Artemio (soyartemio.com), Arquitecto de IA Operativa. Tu objetivo es resolver dudas sobre el trabajo de Artemio, su filosofía y ayudar al cliente a agendar una auditoría gratuita de 30 minutos.

INFORMACIÓN SOBRE ARTEMIO Y SU FILOSOFÍA:
- Artemio no es un proveedor de software común ni vende plantillas estándar. Es el arquitecto de sistemas que entra al caos operativo de las empresas para diseñar e implementar infraestructura de IA propia.
- Filosofía clave: Convertir los costos de renta de software (SaaS) en activos propios de la empresa. No usar la IA como un "juguete" o experimento aislado, sino integrarla en las operaciones para recuperar margen, automatizar flujos y mantener el control absoluto de los datos.
- Manifiesto: "No eres usuario de tu operación. Eres dueño. La IA se diseña alrededor de tus flujos, tus datos y tus decisiones."

SERVICIOS QUE OFRECE:
1. Estrategia y Consultoría IA: Del concepto inicial al mapa de implementación. Evaluación tecnológica, recomendaciones estratégicas y próximos pasos claros.
2. Capacitación IA Interna: Talleres y mejores prácticas para que el equipo de la empresa entienda, adopte y aplique la tecnología de manera independiente.
3. Soluciones de IA a Medida: Desde agentes conversacionales complejos hasta la automatización de flujos de trabajo repetitivos, usando los datos y contexto del cliente.
4. Implementación de Proyectos: Ejecución completa, de la arquitectura al despliegue, con monitoreo y soporte continuo.

ARQUITECTURA POR CAPAS (BLUEPRINT):
- Capa 01: Propiedad de los datos. Información unificada y fuentes de verdad bajo el dominio de la empresa.
- Capa 02: Operación. Agentes, automatizaciones, memoria y flujos que ejecutan decisiones.
- Capa 03: Control. Auditoría, permisos y reglas para que la IA trabaje con criterio operativo y seguridad.

SOBRE PRECIOS Y PASOS A SEGUIR:
- Artemio no cobra rentas mensuales de software por usuario ni tiene precios fijos en la web, ya que cada arquitectura es 100% personalizada según la complejidad y el ahorro potencial de la empresa.
- El primer paso siempre es un DIAGNÓSTICO GRATUITO de 30 minutos (Auditoría Operativa) para evaluar dónde hay fugas de margen, qué procesos se pueden automatizar y si hace sentido construir un sistema a medida.

REGLAS DE COMPORTAMIENTO:
1. Tono: Profesional, directo, pragmático y con criterio empresarial. Evita introducciones largas, saludos robóticos (como "¡Hola! ¿En qué puedo ayudarte hoy como tu asistente virtual?") o explicaciones obvias de IA. Habla con claridad y directo al punto.
2. Idioma: Responde en el mismo idioma en el que te hablen (principalmente español, pero si preguntan en inglés responde en inglés).
3. Brevedad: Mantén las respuestas cortas y fáciles de leer. Usa listas con viñetas para desglosar información si es necesario.
4. Agendamiento de Auditoría: Si el usuario muestra interés en trabajar con Artemio, en agendar una cita, en realizar una llamada o en recibir el diagnóstico gratuito, guíalo con entusiasmo profesional a agendar una sesión de 30 minutos. 
   - Proporciona el enlace de Calendly: https://calendly.com/soyartemio/30min
   - CRÍTICO: Siempre que el usuario exprese intención de agendar o solicite una cita, añade exactamente la etiqueta \`[BOOK_MEETING]\` al final de tu respuesta (en una nueva línea) para que la interfaz del chat muestre un botón interactivo de Calendly.
`;

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    let data: GeminiResponse;
    try {
      data = await generateGeminiContent(apiKey, requestBody);
    } catch (error) {
      console.error("Error de la API de Gemini:", error);
      return NextResponse.json(
        { error: "Error al comunicarse con el motor de IA." },
        { status: 502 }
      );
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ reply: replyText });
  } catch (error: unknown) {
    console.error("Error en el API de Chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

function formatMessagesForGemini(messages: ChatMessage[]) {
  let hasSeenUserMessage = false;

  return messages.flatMap((message) => {
    const text = message.content?.trim();

    if (!text) {
      return [];
    }

    const role = message.role === "user" ? "user" : "model";

    if (role === "user") {
      hasSeenUserMessage = true;
    }

    if (!hasSeenUserMessage && role === "model") {
      return [];
    }

    return [
      {
        role,
        parts: [{ text }],
      },
    ];
  });
}

async function generateGeminiContent(apiKey: string, requestBody: unknown) {
  let lastStatus = 500;

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      return (await response.json()) as GeminiResponse;
    }

    lastStatus = response.status;
    const errorText = await response.text();
    console.error(`Error de la API de Gemini (${model}):`, errorText);

    if (!isRetryableGeminiStatus(response.status)) {
      break;
    }
  }

  throw new Error(`Gemini request failed with status ${lastStatus}`);
}

function isRetryableGeminiStatus(status: number) {
  return status === 429 || status >= 500;
}

async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as Record<string, string | undefined>).GEMINI_API_KEY;
  } catch {
    return undefined;
  }
}

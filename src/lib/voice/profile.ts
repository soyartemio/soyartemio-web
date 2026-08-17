/*
 * Agente de voz de SoyArtemio (motor S1gnal sobre la Gemini Live API).
 *
 * Un solo perfil: "landing". Esta superficie es pública a propósito y por eso
 * NINGUNA herramienta opera sistemas del cliente: sólo registra un interés y
 * manda un aviso privado a Artemio. Es la misma regla que en S1gnal Dental: la
 * voz de la web VENDE, la voz de una app OPERA. Aquí no hay app.
 *
 * Ver: S1gnal Engine/INTEGRACION-EN-APP.md §1
 */

const VERIFIED_LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";

/**
 * 3.1 Live tardó casi 3× más y entregó audio a ráfagas en la prueba controlada
 * del 17-08-2026. El valor verificado queda fijado, con escape por entorno para
 * volver a evaluar un modelo nuevo sin editar el runtime.
 */
export const VOICE_MODEL =
  process.env.GEMINI_LIVE_MODEL?.trim() || VERIFIED_LIVE_MODEL;

/** Aoede es la voz calibrada en Dental: cálida y sin afectación de locutor. */
export const VOICE_NAME = "Aoede";

export type ToolDeclaration = {
  functionDeclarations: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }[];
};

export type VoiceAgentConfig = {
  systemInstruction: string;
  tools: ToolDeclaration[];
  temperature: number;
  greetingPrompt: string;
  maxSessionMinutes: number;
};

export function isVoiceConfigured() {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && !key.includes("replace_me"));
}

const TOOLS: ToolDeclaration[] = [
  {
    functionDeclarations: [
      {
        name: "registrar_interes",
        description:
          "Registra a alguien que quiere que Artemio lo contacte. Basta el nombre y UNA vía de contacto (WhatsApp/teléfono o correo). Todo lo demás es opcional: si lo dijo, se manda; si no, no se pregunta de más.",
        parameters: {
          type: "OBJECT",
          properties: {
            nombre: { type: "STRING", description: "Nombre de la persona" },
            telefono: {
              type: "STRING",
              description: "WhatsApp o teléfono. Opcional si dio correo",
            },
            correo: {
              type: "STRING",
              description: "Correo electrónico. Opcional si dio teléfono",
            },
            empresa: { type: "STRING", description: "Empresa. Opcional" },
            nota: {
              type: "STRING",
              description:
                "Qué necesita resolver, EN SUS PALABRAS. Es lo más valioso del registro: no lo resumas a una categoría",
            },
            acepta_contacto: {
              type: "STRING",
              description:
                '"si" únicamente si dijo expresamente que sí quiere que lo contacten',
            },
            datos_confirmados: {
              type: "STRING",
              description:
                '"si" únicamente después de repetirle el teléfono y/o correo y que confirme que se escuchó correctamente',
            },
          },
          required: ["nombre", "acepta_contacto", "datos_confirmados"],
        },
      },
      {
        name: "solicitar_cita",
        description:
          "Envía a Artemio por WhatsApp una solicitud de cita. No confirma ni promete el horario: Artemio lo confirma personalmente. Pide nombre, una vía de contacto y el momento preferido; empresa y motivo son opcionales.",
        parameters: {
          type: "OBJECT",
          properties: {
            nombre: { type: "STRING", description: "Nombre de la persona" },
            telefono: {
              type: "STRING",
              description: "WhatsApp o teléfono. Opcional si dio correo",
            },
            correo: {
              type: "STRING",
              description: "Correo electrónico. Opcional si dio teléfono",
            },
            empresa: { type: "STRING", description: "Empresa. Opcional" },
            momento_preferido: {
              type: "STRING",
              description:
                "Día y horario que le funciona, conservado en sus palabras y con zona horaria si la mencionó",
            },
            motivo: {
              type: "STRING",
              description: "Qué quiere revisar con Artemio, en sus palabras. Opcional",
            },
            acepta_contacto: {
              type: "STRING",
              description:
                '"si" únicamente si autorizó que Artemio reciba sus datos y lo contacte',
            },
            datos_confirmados: {
              type: "STRING",
              description:
                '"si" únicamente después de repetirle el teléfono y/o correo y que confirme que se escuchó correctamente',
            },
          },
          required: [
            "nombre",
            "momento_preferido",
            "acepta_contacto",
            "datos_confirmados",
          ],
        },
      },
    ],
  },
];

function instruction() {
  return `Eres el agente de voz de Artemio, en su página soyartemio.me. Hablas español de México, en tono directo y sin cursilerías corporativas.

## Qué hace Artemio

Artemio diseña automatización y arquitectura operativa para negocios, equipos y empresas cuando existe un problema que vale la pena resolver. Entra a la operación, encuentra dónde se pierden tiempo, margen o control, y construye sistemas propios —no suscripciones por vender— para que el trabajo avance con menos intervención manual y los datos queden bajo control de quien opera.

Cómo trabaja: (1) diagnóstico de la operación, (2) blueprint de arquitectura, (3) construcción por módulos empezando por lo que recupera margen, (4) adopción real con el equipo.

Tú mismo eres el ejemplo. Si alguien pregunta qué construye Artemio, la respuesta más honesta es: "esto que estás usando ahorita". Eres un agente de voz en tiempo real que él instaló en su propia página.

## Reglas duras

- **No inventes clientes, cifras, casos ni porcentajes de ahorro.** Artemio está empezando y no tiene cartera que presumir. Si te preguntan por clientes, dilo tal cual y ofrece la auditoría gratuita. La honestidad aquí vende más que un caso falso.
- **No des precios.** No hay tarifa pública; depende del alcance y sale del diagnóstico. Si insisten, di que la auditoría de 30 minutos es justo para poder dar un número real.
- **No prometas plazos** más allá de "conviene empezar por un módulo de alto impacto en semanas, no un megaproyecto de meses".
- No pidas datos personales sensibles. Nombre y una vía de contacto, nada más.
- **Confirma siempre la vía de contacto antes de usar una herramienta.** Repite exactamente lo que entendiste: "Escuché 81..." o "Escuché nombre arroba dominio punto com, ¿está correcto?". Si dejó teléfono y correo, confirma ambos. Si corrige algo, repite la versión corregida y vuelve a pedir confirmación. Sólo envía datos_confirmados="si" después de un sí claro.

## Tu prioridad

Primero entiende y ayuda. Conversa con curiosidad real, responde lo que te preguntaron y haz una sola pregunta a la vez. No conviertas cada respuesta en un pitch ni pidas datos antes de que exista interés. Cuando haya un problema real que Artemio pueda ayudar a resolver, entonces propone una llamada o pide permiso para que él escriba.

Si quiere una cita, pregunta qué día u horario le funciona, además de nombre y una vía de contacto. Repite la vía de contacto, confirma que la escuchaste bien y, después de su permiso explícito, llama a \`solicitar_cita\`. **Nunca digas que la cita quedó confirmada:** sólo que Artemio recibió la solicitud por WhatsApp y confirmará personalmente el horario.

Cuando la persona muestre interés real, pídele permiso explícito: "¿te parece si le paso tus datos a Artemio y te escribe?". **Sólo si dice que sí** llamas a \`registrar_interes\` con acepta_contacto="si". Nunca sin ese sí.

En \`nota\`, escribe lo que la persona dijo que le duele, con sus palabras. Eso es lo que le sirve a Artemio para llegar preparado.

## Cómo hablas

Es voz, no chat. Frases cortas. Una idea por turno. Nunca leas listas de más de tres cosas en voz alta. Si te preguntan algo largo, contesta lo esencial y pregunta si quiere el detalle.

Tu tono es directo, cálido y despierto. Puedes usar humor seco y sutil: un pequeño giro que saque una sonrisa, no un chiste ni una rutina. Nunca bromees al confirmar datos, pedir permiso, hablar de dinero o admitir que no sabes algo.

No digas "como asistente de IA". No pidas disculpas de más. Si no sabes algo, dilo y ofrece que Artemio lo responda.

Al iniciar la conversación, di: "Hola, soy Artemio... bueno, su asistente. ¿En qué te puedo ayudar?" Conserva esa pausa y ese toque sutil de humor. No agregues contexto, servicios ni ejemplos. Después guarda silencio y espera a que la persona responda.`;
}

export function landingAgent(): VoiceAgentConfig {
  return {
    systemInstruction: instruction(),
    tools: TOOLS,
    temperature: 0.5,
    greetingPrompt:
      "Da ahora el saludo breve indicado en tu instrucción y después espera.",
    // Igual que la landing de Dental: ~3 min de conversación con margen para
    // cerrar sin cortar a media frase, que es la peor forma de terminar.
    maxSessionMinutes: 5,
  };
}

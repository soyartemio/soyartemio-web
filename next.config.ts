import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Tokens efímeros, herramientas y telemetría nunca son contenido de
        // CDN. Esta regla específica evita que la caché pública de las páginas
        // reemplace el `no-store` que ya devuelve cada endpoint.
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        // El documento y los payloads RSC cambian de nombre de chunks en cada
        // despliegue. Safari no debe reutilizar HTML viejo que apunte a assets
        // que ya no pertenecen a la versión activa.
        source:
          "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|assets).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

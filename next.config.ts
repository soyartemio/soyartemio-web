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
        source:
          "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|assets).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

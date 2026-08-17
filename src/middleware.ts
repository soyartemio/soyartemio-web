import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "soyartemio.me";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") || "")
    .split(":", 1)[0]
    .toLowerCase();
  const forwardedProtocol = (request.headers.get("x-forwarded-proto") || "")
    .split(",", 1)[0]
    .trim()
    .toLowerCase();
  const isPublicHost = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;
  const requestProtocol =
    forwardedProtocol || request.nextUrl.protocol.replace(":", "").toLowerCase();
  const isInsecure = requestProtocol === "http";

  // Safari conserva con frecuencia el hostname exacto que el usuario escribió
  // o recibió. Ambos accesos públicos terminan en una sola URL segura para que
  // `www`, HTTP y enlaces antiguos nunca abran una variante rota del sitio.
  if (isPublicHost && (host !== CANONICAL_HOST || isInsecure)) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = CANONICAL_HOST;
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (pathname !== "/" && pathname !== "/concept") {
    return NextResponse.next();
  }

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";
  const wantsEnglish = country.toUpperCase() === "US";

  if (!wantsEnglish) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : "/en/concept";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

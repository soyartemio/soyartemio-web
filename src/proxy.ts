import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/", "/concept"],
};

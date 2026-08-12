import { ImageResponse } from "next/og";

export const socialCardSize = { width: 1200, height: 630 };

export function renderSocialCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#f4f0e8",
          color: "#171717",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          style={{
            width: "61.8%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 62px",
            borderRight: "1px solid rgba(23,23,23,.2)",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
            soyartemio.me<span style={{ color: "#b8954f" }}>▮</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#7a6030", fontSize: 16, fontWeight: 800, letterSpacing: 4 }}>
              MENOS TRABAJO MANUAL
            </div>
            <div style={{ marginTop: 20, fontSize: 78, fontWeight: 900, lineHeight: 0.92, letterSpacing: -4.5 }}>
              Saco tu operación del caos.
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#171717",
              color: "#f4f0e8",
              padding: 38,
              boxShadow: "14px 14px 0 #b8954f",
            }}
          >
            <div style={{ color: "#56b6b2", fontSize: 15, fontWeight: 800, letterSpacing: 3 }}>
              DIAGNÓSTICO · 30 MIN
            </div>
            <div style={{ marginTop: 28, fontSize: 34, fontWeight: 900, lineHeight: 1.05 }}>
              Un siguiente paso claro para tu empresa.
            </div>
            <div style={{ marginTop: 42, display: "flex", alignItems: "center", gap: 12, fontSize: 18, fontWeight: 800 }}>
              Sin costo <span style={{ color: "#b8954f" }}>→</span> Sin obligación
            </div>
          </div>
        </div>
      </div>
    ),
    socialCardSize,
  );
}

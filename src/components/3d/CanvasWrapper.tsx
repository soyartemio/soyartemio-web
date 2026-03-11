"use client";

import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("@/components/3d/Background3D"), {
    ssr: false, // Ahora sí válido porque esto es un Client Component
});

export default function CanvasWrapper() {
    return <Background3D />;
}

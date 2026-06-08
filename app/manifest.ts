import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Candy English Daily",
    short_name: "Candy English",
    description: "Daily listening, reading and vocabulary practice.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff7eb6",
    icons: [
      {
        src: "/icons/candy-icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/candy-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}

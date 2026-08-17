import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { 
        preset: "cloudflare_pages",
        entry: "server" 
      }
    }),
    nitro({
      preset: "cloudflare_pages"
    }),
    react(),
  ],
  server: {
    host: "::",
    port: 8080,
  }
});

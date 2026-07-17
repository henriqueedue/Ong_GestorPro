import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-ignore - Ignora a falta de tipos deste plugin se o TS reclamar
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import path from "node:path";
import { fileURLToPath } from "node:url";

// =============================================================================
// Ong Gestor Pro - Vite Configuration
// =============================================================================

// Maneira universal e segura de pegar o diretório atual no ESM sem erros de tipagem
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

// Define o endereço do backend: usa o nome do serviço do docker se estiver no container, senão localhost
const BACKEND_URL = process.env.DOCKER_ENV ? "http://ong-backend:8080" : "http://localhost:8080";

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
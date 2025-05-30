import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      //前端代理配置
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/captcha": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

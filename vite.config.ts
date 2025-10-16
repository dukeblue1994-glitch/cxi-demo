import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: { sourcemap: true },
  server: { port: 5173 }
});

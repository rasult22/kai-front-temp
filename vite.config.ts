import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss(), basicSsl()],
    // plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,
    },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/v1": {
                target: "http://100.24.52.244:8000",
                changeOrigin: true,
            },
        },
    },
});

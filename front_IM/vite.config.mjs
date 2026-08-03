import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    noDiscovery: true,
    include: [],
    exclude: ["axios", "lucide-vue-next", "vue"],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});

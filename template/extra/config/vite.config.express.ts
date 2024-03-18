import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { webSocketServer } from "./socketPlugin";

export default defineConfig({
  plugins: [sveltekit(), webSocketServer],
});

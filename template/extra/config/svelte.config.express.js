import nodeAdapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { Server } from "socket.io";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    env: {
      dir: "./",
    },
    adapter: nodeAdapter(),
    vite: {
      plugins: [
        {
          name: "socket-io",
          configureServer(server) {
            const socket = new Server(server.httpServer);
            socket.on("connection", (socket) => {
              socket.on("new", () => {
                socket.emit("message", Math.random() * 1000);
              });
            });
          },
        },
      ],
    },
  },
};

export default config;

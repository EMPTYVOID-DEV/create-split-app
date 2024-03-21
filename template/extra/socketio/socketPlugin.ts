import { Server } from "socket.io";

function ioServer(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    socket.on("new", () => {
      socket.emit("message", Math.random() * 1000);
    });
  });
}

export const webSocketServer = {
  name: "webSocketServer",
  configureServer(server) {
    ioServer(server.httpServer);
  },
};

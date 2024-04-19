import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { handler } from "./build/handler.js";

const app = express();
const httpServer = createServer(app);
const socket = new Server(httpServer);

socket.on("connection", (socket) => {
  socket.on("new", () => {
    socket.emit("message", Math.random() * 1000);
  });
});

app.use(handler);

httpServer.listen(5173, () => {
  console.log("lisening on port 5173");
});

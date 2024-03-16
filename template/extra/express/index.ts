import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { handler } from "../build/handler.js";

const app = express();
const httpServer = createServer(app);
const socket = new Server(httpServer);

socket.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(data);
    socket.emit("message", data);
  });
});

app.use(handler);

httpServer.listen(5000, () => {
  console.log("lisening on port 5000");
});

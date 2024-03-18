import clientSocket from "socket.io-client";

const endPoint = "http://localhost:5173";
const socket = clientSocket(endPoint);

export const io = socket;

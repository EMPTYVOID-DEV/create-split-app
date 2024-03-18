import clientSocket from "socket.io-client";

const endPoint = "http://localhost:3000";
const socket = clientSocket(endPoint);

export const io = socket;

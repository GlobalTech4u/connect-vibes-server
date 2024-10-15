import { Server } from "socket.io";

const initializeSocket = (CLIENT_APP_URL, server) => {
  const io = new Server(server, {
    cors: { origin: CLIENT_APP_URL, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log(`a user connected `, socket?.handshake?.query?.userId);

    if (
      socket?.handshake?.query?.userId &&
      socket?.handshake?.query?.userId !== "undefined"
    ) {
      socket.join(socket?.handshake?.query?.userId);

      socket.on("add_post", ({ userId, followers }) => {
        socket.to(followers).emit("post_added", { userId: userId });
      });

      socket.on("disconnect", () => {
        socket.in(socket?.handshake?.query?.userId).disconnectSockets(true);
      });
    }
  });
};

export default initializeSocket;

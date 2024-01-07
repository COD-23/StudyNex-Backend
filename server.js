const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const orgRoutes = require("./routes/orgRoutes");
const channelRoutes = require("./routes/channelRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { errorResponse } = require("./helpers/apiResponse");
const path = require("path");

app.use(cors());
app.use(express.json());

dotenv.config();
const port = process.env.PORT || "3001";

connectDatabase();

app.use("/api/", userRoutes);
app.use("/api/", orgRoutes);
app.use("/api/", channelRoutes);
app.use("/api/", chatRoutes);

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id); // user joined to the room
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new_message", (data) => {
    let chat = data.chat;
    if (!chat.users) {
      errorResponse({ message: "chat.users not defined" });
    }
    for (const userId of chat.users) {
      if (userId !== data.sender._id) {
        socket.in(userId).emit("message_received", data);
      }
    }
  });

  socket.on("end", async (data) => {
    console.log("Closing connection");
    socket.disconnect(0);
  });
});

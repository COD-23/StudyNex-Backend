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
    socket.join(user.data._id);
    socket.emmit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageStatus) => {
    let chat = newMessageStatus.chat;
    if (!chat.users) {
      errorResponse({ message: "chat.users not defined" });
    }
    chat.users.foreach((user) => {
      if (user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit("message received", newMessageStatus);
    });
  });
});

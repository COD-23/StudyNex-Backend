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
const port = process.env.PORT || "4000";

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

  socket.on("text_message", (data) => {
    console.log("received message", data);
    let chat = data.chat;
    if (!chat.users) {
      errorResponse({ message: "chat.users not defined" });
    }
    chat.users.foreach((user) => {
      if (user._id == data.sender._id) return;
      socket.in(user._id).emit("message received", data);
    });
  });

  socket.on("file_message", (data) => {
    console.log("received message", data);

    //getting file extension
    const fileExt = path.extname(data.file.name);

    //generating unqiue file name
    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExt}`;
  });

  socket.on("end", async (data) => {
    console.log("Closing connection");
    socket.disconnect(0);
  });
});

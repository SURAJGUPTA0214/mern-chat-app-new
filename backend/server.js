const express = require("express");
const { chart } = require("./data/data");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is runnings");
});

// app.get('/api/chat', (req,res)=>{
//     res.send(chart);
//     console.log(res)
//     console.log(req)
// })

// app.get('/api/chat/:id', (req,res)=>{
//    const singleChat = chart.find(c=>c.id===req.params.id);
//    res.send(singleChat);
// })

// app.get('/api/chat/:id', (req,res)=>{
//     res.send(chart);
// })
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//-------------------- Deployment --------------//

const __dirname1 = path.resolve();
if ((process.env.NODE_ENV = "production")) {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is runnings");
  });
}

const PORT = process.env.PORT || 1000;
const server = app.listen(PORT, console.log(`server started at ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 45000,
  cors: {
    origin: "https://master--tourmaline-treacle-a2e744.netlify.app",
  },
});

io.on("connection", (socket) => {
  // console.log("socket connected");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("join", room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("emit runs");
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
    console.log("stopped");
  });
});

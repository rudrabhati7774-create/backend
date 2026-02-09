const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});
const fs = require("fs");

let users = {};
let messages = [];

io.on("connection", socket => {

  socket.on("join", username => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("message", msg => {
    const data = {
      user: users[socket.id],
      text: msg,
      time: new Date().toLocaleTimeString()
    };
    messages.push(data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});

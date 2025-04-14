const express = require("express");
 const http = require("http");
 const path = require("path");
 const { Server } = require("socket.io");
 
 const app = express();
 const server = http.createServer(app);
 const io = new Server(server);
 const PORT = 3000;
 
 app.use("/", express.static(path.join(__dirname, "..")));
 app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));

 server.listen(PORT, () => {
   console.log(`Server attivo su http://localhost:${PORT}/pages/login.html`);
 });
 
 let users = [];
 
 io.on("connection", (socket) => {
   console.log("Connesso:", socket.id);
 
   socket.on("join", (username) => {
     if (!username || users.find(u => u.name === username)) {
       socket.emit("join_error", "Nome già in uso o non valido.");
       return;
     }
 
     users.push({ name: username, socketId: socket.id, playing: false });
     io.emit("list", users);
   });
 
   socket.on("disconnect", () => {
     console.log("Disconnesso:", socket.id);
     users = users.filter(u => u.socketId !== socket.id);
     io.emit("list", users);
   });
 });

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

    socket.on("invia_invito", ({ destinatario }) => {
        const target = users.find(u => u.name === destinatario);
        const mittente = users.find(u => u.socketId === socket.id);

        if (!target || !mittente) {
            socket.emit("invito_error", "Giocatore non trovato.");
            return;
        }

        io.to(target.socketId).emit("ricevi_invito", {
            mittente: mittente.name
        });
    });

    socket.on("accetta_invito", ({ mittente }) => {
     const sender = users.find(u => u.name === mittente);
     const receiver = users.find(u => u.socketId === socket.id);
 
     if (sender && receiver) {
         const idPartita = `${sender.name}-${receiver.name}-${Date.now()}`;
 
         io.to(sender.socketId).emit("avvia_partita", {
             avversario: receiver.name,
             idPartita
         });
 
         io.to(receiver.socketId).emit("avvia_partita", {
             avversario: sender.name,
             idPartita
         });
     }
 });
 
 
 

    socket.on("rifiuta_invito", ({ mittente }) => {
        const sender = users.find(u => u.name === mittente);
        if (sender) {
            io.to(sender.socketId).emit("invito_rifiutato", {
                da: users.find(u => u.socketId === socket.id)?.name
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Disconnesso:", socket.id);
        users = users.filter(u => u.socketId !== socket.id);
        io.emit("list", users);
    });
});



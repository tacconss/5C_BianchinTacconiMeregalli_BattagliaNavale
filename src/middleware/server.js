
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 5051;

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));

//su http://localhost:${PORT}/pages/index.html
server.listen(PORT, () => {
    console.log(`Server attivo`);
});


const giocatoriConnessi = {}; 
const statoGiocatori = {};

io.on("connection", (socket) => {
    console.log("Connesso:", socket.id);

    socket.on("join", (username) => {
        const values = Object.values(giocatoriConnessi);
        const giaConnesso = values.includes(username);

        giocatoriConnessi[socket.id] = username;

        if (!(username in statoGiocatori)) {
            statoGiocatori[username] = "libero";
        } else {
            console.log(`${username} già esistente con stato: ${statoGiocatori[username]}`);
        }
    
        aggiornaListaGiocatori();
        console.log(`${username} si è unito.`);
    });

    socket.on("invia_invito", ({ destinatario }) => {
        const mittente = giocatoriConnessi[socket.id];
        const keys = Object.keys(giocatoriConnessi);
        for (let i = 0; i < keys.length; i++) {
            const sockId = keys[i];
            const username = giocatoriConnessi[sockId];
            if (username === destinatario) {
                if (statoGiocatori[username] === "in_partita") {
                    socket.emit("invito_error", `${destinatario} è già in partita.`);
                    return;
                }
    
                io.to(sockId).emit("ricevi_invito", { mittente });
                return;
            }
        }
    
        socket.emit("invito_error", "Giocatore non trovato.");
    });
    

    socket.on("accetta_invito", ({ mittente }) => {
        const ricevente = giocatoriConnessi[socket.id];
        let mittenteSocketId = null;
    
        const keys = Object.keys(giocatoriConnessi);
        for (let i = 0; i < keys.length; i++) {
            const sockId = keys[i];
            const username = giocatoriConnessi[sockId];
            if (username === mittente) {
                mittenteSocketId = sockId;
                break;
            }
        }
    
        // Verifica che entrambi siano liberi
        if (
            mittenteSocketId &&
            ricevente &&
            statoGiocatori[mittente] === "libero" &&
            statoGiocatori[ricevente] === "libero"
        ) {
            // Imposta stato in partita
            statoGiocatori[mittente] = "in_partita";
            statoGiocatori[ricevente] = "in_partita";
    
            aggiornaListaGiocatori();
    
            const idPartita = `${mittente}-${ricevente}-${Date.now()}`;
    
            io.to(mittenteSocketId).emit("avvia_partita", {
                avversario: ricevente,
                idPartita
                
            });
    
            io.to(socket.id).emit("avvia_partita", {
                avversario: mittente,
                idPartita
            });
            aggiornaListaGiocatori()
        } else {
            socket.emit("invito_error", "Uno dei giocatori non è disponibile.");
        }
    });
    

    socket.on("rifiuta_invito", ({ mittente }) => {
        const keys = Object.keys(giocatoriConnessi);
        for (let i = 0; i < keys.length; i++) {
            const sockId = keys[i];
            const username = giocatoriConnessi[sockId];
            if (username === mittente) {
                const nomeRifiutante = giocatoriConnessi[socket.id];
                io.to(sockId).emit("invito_rifiutato", {
                    da: nomeRifiutante
                });
                break;
            }
        }
    });

    socket.on("fine_partita", ({ giocatore1, giocatore2 }) => {
        if (giocatore1) statoGiocatori[giocatore1] = "libero";
        if (giocatore2) statoGiocatori[giocatore2] = "libero";

        aggiornaListaGiocatori();
    });

    socket.on("disconnect", () => {
        const username = giocatoriConnessi[socket.id];
        if (username) {
            delete giocatoriConnessi[socket.id];

            if (statoGiocatori[username] !== "in_partita") {
                statoGiocatori[username] = "libero";
            }
            
            aggiornaListaGiocatori();
            console.log(`${username} disconnesso.`);
        }
    });
    

    function aggiornaListaGiocatori() {
        const lista = [];
        const keys = Object.keys(statoGiocatori);
        for (let i = 0; i < keys.length; i++) {
            const username = keys[i];
            const stato = statoGiocatori[username];
            lista.push({ name: username, playing: stato === "in_partita" });
        }
        io.emit("list", lista);
    }
});
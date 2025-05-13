const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const http = require("http");
const { Server } = require("socket.io");
const dbAccess = require("../db.js");

const conf = JSON.parse(fs.readFileSync("conf.json"));
conf.ssl.ca = fs.readFileSync(path.join(process.cwd(), "ca.pem"));

const connection = mysql.createConnection(conf);
const app = express();
const db = dbAccess(app);

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));
app.use("/pages", express.static(path.join(process.cwd(), "public/pages")));


app.post("/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: "Campi mancanti" });

  try {
    const utenti = await executeQuery("SELECT * FROM Utenti WHERE NomeUtente = ?", [name]);
    if (utenti.length > 0) return res.status(409).json({ error: "Utente già esistente" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await insertUser({ name, password: hashedPassword });
    res.json({ result: "Utente registrato con successo" });
  } catch (err) {
    console.error("Errore durante la registrazione:", err);
    res.status(500).json({ error: "Errore durante la registrazione" });
  }
});

app.post("/Utenti/add", (req, res) => {
  const utente = req.body;
  insertUser(utente).then(() => {
    res.json({ result: "Ok" });
  });
});

app.get("/Utenti", (req, res) => {
  select().then(lista => {
    res.json({ utenti: lista });
  });
});

app.put("/Utenti/update", (req, res) => {
  const utente = req.body;
  update(utente).then(() => {
    res.json({ result: "Ok" });
  });
});

app.delete("/Utenti/:idUtenti", (req, res) => {
  const id = req.params.idUtenti;
  remove({ idUtenti: id }).then(() => {
    res.json({ result: "Ok" });
  });
});

function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        console.log("Errore query:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function insertUser(utente) {
  const sql = `INSERT INTO Utenti (NomeUtente, Password) VALUES (?, ?)`;
  return executeQuery(sql, [utente.name, utente.password]);
}

function select() {
  const sql = `SELECT idUtenti, NomeUtente, Password FROM Utenti`;
  return executeQuery(sql);
}

function update(utente) {
  const sql = `UPDATE Utenti SET Password = ? WHERE idUtenti = ?`;
  return executeQuery(sql, [utente.password, utente.idUtenti]);
}

function remove(utente) {
  const sql = `DELETE FROM Utenti WHERE idUtenti = ?`;
  return executeQuery(sql, [utente.idUtenti]);
}

const giocatoriConnessi = {};
const statoGiocatori = {};
const partiteInCorso = {};

function emitAggiornaPartite() {
  const listaPartite = {};
  for (const id in partiteInCorso) {
    const partita = partiteInCorso[id];
    listaPartite[id] = `${partita.giocatore1} vs ${partita.giocatore2}`;
  }
  io.emit("aggiorna_partite", listaPartite);
}



io.on("connection", (socket) => {
  console.log("Connesso:", socket.id);
  
  socket.on("avvia_partita", ({ username, avversario, idPartita }) => {
    io.emit("avvia_partita", ({ c: username, idPartit: idPartita }));
  });

  socket.on("colpo", (value=>{
    console.log("Colpo ricevuto:", value);

    io.emit("colpo", value)
  }));
  socket.on("join", (username) => {
    for (const sockId in giocatoriConnessi) {
      if (giocatoriConnessi[sockId] === username) {
        io.sockets.sockets.get(sockId)?.disconnect(true);
        delete giocatoriConnessi[sockId];
      }
    }
  
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
    for (const sockId in giocatoriConnessi) {
      const user = giocatoriConnessi[sockId];
      if (user === destinatario) {
        if (statoGiocatori[user] === "in_partita") {
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
  
    for (const sid in giocatoriConnessi) {
      const user = giocatoriConnessi[sid];
      if (user === mittente) {
        mittenteSocketId = sid;
        break;
      }
    }
  
    if (
      mittenteSocketId &&
      ricevente &&
      statoGiocatori[mittente] === "libero" &&
      statoGiocatori[ricevente] === "libero"
    ) {
      statoGiocatori[mittente] = "in_partita";
      statoGiocatori[ricevente] = "in_partita";
  
      aggiornaListaGiocatori();
  
      const idPartita = `${mittente}-${ricevente}-${Date.now()}`;
      partiteInCorso[idPartita] = { giocatore1: mittente, giocatore2: ricevente };
      emitAggiornaPartite(); 
      console.log(mittenteSocketId);
      console.log(socket.id)
      io.to(mittenteSocketId).emit("avvia_partita", { socket: mittenteSocketId, avversario: ricevente, idPartit: idPartita });
      io.to(socket.id).emit("avvia_partita", { socket: socket.id, avversario: mittente, idPartit: idPartita });
      console.log(`Partita avviata tra ${mittente} e ${ricevente}, ID: ${idPartita}`);
  
      aggiornaListaGiocatori();
    } else {
      socket.emit("invito_error", "Uno dei giocatori non è disponibile.");
    }
  });
  
  socket.on("rifiuta_invito", ({ mittente }) => {
    for (const sid in giocatoriConnessi) {
      const user = giocatoriConnessi[sid];
      if (user === mittente) {
        const nomeRifiutante = giocatoriConnessi[socket.id];
        io.to(sid).emit("invito_rifiutato", { da: nomeRifiutante });
        break;
      }
    }
  });

  socket.on("fine_partita", ({ giocatore1, giocatore2 }) => {
    if (giocatore1) statoGiocatori[giocatore1] = "libero";
    if (giocatore2) statoGiocatori[giocatore2] = "libero";
  
    let idDaEliminare = null;
    for (const id in partiteInCorso) {
      const p = partiteInCorso[id];
      if (
        (p.giocatore1 === giocatore1 && p.giocatore2 === giocatore2) ||
        (p.giocatore1 === giocatore2 && p.giocatore2 === giocatore1)
      ) {
        idDaEliminare = id;
        break;
      }
    }
  
    if (idDaEliminare) {
      delete partiteInCorso[idDaEliminare];
      emitAggiornaPartite();
    }
    aggiornaListaGiocatori();
  });

  socket.on("logout", ({ username }) => {
    for (const sid in giocatoriConnessi) {
      if (giocatoriConnessi[sid] === username) {
        delete giocatoriConnessi[sid];
      }
    }
    statoGiocatori[username] = "libero";
    console.log(`${username} ha eseguito logout`);
    aggiornaListaGiocatori();
  });

  socket.on("abbandona_partita", ({ idPartita, giocatoreCheAbbandona}) => {
    const partita = partiteInCorso[idPartita];
    if (!partita) return;
  
    const avversario = partita.giocatore1 === giocatoreCheAbbandona
      ? partita.giocatore2
      : partita.giocatore1;

    io.emit("abbandona_partita", { idPartita, avversario });

    statoGiocatori[giocatoreCheAbbandona] = "libero";
    statoGiocatori[avversario] = "libero";
  
    delete partiteInCorso[idPartita];
    emitAggiornaPartite();
  /*
    for (const sid in giocatoriConnessi) {
      if (giocatoriConnessi[sid] === giocatoreCheAbbandona) {
        io.emit("conferma_abbandono",idPartita);
        break;
      }
    }
*/
/*
    for (const sid in giocatoriConnessi) {
      if (giocatoriConnessi[sid] === avversario) {
        io.to(sid).emit("vittoria_per_abbandono");
        break;
      }
    }
      */
    aggiornaListaGiocatori();
  });

  socket.on("vittoria", ({ idPartita, vincitore }) => {
    console.log(vincitore);
    console.log("Vittoria ricevuta:", idPartita, vincitore);
  const partita = partiteInCorso[idPartita];
  if (!partita) return;

  const perdente = partita.giocatore1 === vincitore ? partita.giocatore2 : partita.giocatore1;
  console.log("Vincitore:", vincitore, "Perdente:", perdente);
  statoGiocatori[vincitore] = "libero";
  statoGiocatori[perdente] = "libero";

  delete partiteInCorso[idPartita];
  emitAggiornaPartite();

  io.emit("end_game", {id: idPartita, winner: vincitore});


  aggiornaListaGiocatori();
});


socket.on("disconnect", () => {
  const username = giocatoriConnessi[socket.id];
  if (username) {
    delete giocatoriConnessi[socket.id];

    if (statoGiocatori[username] !== "in_partita") {
      statoGiocatori[username] = "libero";
      delete statoGiocatori[username];
    }

    aggiornaListaGiocatori();
    console.log(`${username} disconnesso.`);
  }
});



  function aggiornaListaGiocatori() {
    const lista = [];
    for (const username in statoGiocatori) {
      lista.push({
        name: username,
        playing: statoGiocatori[username] === "in_partita"
      });
    }
    io.emit("list", lista);
  }
});

server.listen(5050, () => {
  console.log(`API`);
});
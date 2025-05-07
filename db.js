const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const conf = JSON.parse(fs.readFileSync("conf.json"));
conf.ssl.ca = fs.readFileSync(__dirname + "/ca.pem");

const connection = mysql.createConnection(conf);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use("/", express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/pages", express.static(path.join(__dirname, "public", "pages")));


app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "pages", "index.html"), (err) => {
    if (err) {
      console.error("Errore nel caricare il file:", err);
      res.status(500).send("Errore nel caricare la pagina");
    }
  });
});





// ============ ROTTA REGISTRAZIONE ============
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

// ============ ROTTA LOGIN ============
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: "Campi mancanti" });

  try {
    const utenti = await executeQuery("SELECT * FROM Utenti WHERE NomeUtente = ?", [name]);
    if (utenti.length === 0) return res.status(401).json({ error: "Utente non trovato" });

    const utente = utenti[0];
    const match = await bcrypt.compare(password, utente.Password);
    if (!match) return res.status(401).json({ error: "Password errata" });

    res.json({ result: "Login effettuato", userId: utente.idUtenti });
  } catch (err) {
    console.error("Errore durante il login:", err);
    res.status(500).json({ error: "Errore durante il login" });
  }
});

// ============ API CRUD UTENTI ============
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

// ============ FUNZIONI DB ============
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

// ============ AVVIO SERVER ============
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`API server attivo su http://localhost:${PORT}`);
});

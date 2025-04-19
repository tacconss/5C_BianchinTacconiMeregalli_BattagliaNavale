const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const conf = JSON.parse(fs.readFileSync("conf.json"));
conf.ssl.ca = fs.readFileSync(__dirname + "/ca.pem");

const connection = mysql.createConnection(conf);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

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

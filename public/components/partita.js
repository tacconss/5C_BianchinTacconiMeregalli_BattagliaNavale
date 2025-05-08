import { generateGridComponent } from "./griglia.js";
import { socket } from "./socket.js";
import { generateTurno } from "./turno.js";

export const generatePartitaComponent = () => {
  const username   = sessionStorage.getItem("username");
  const avversario = sessionStorage.getItem("avversario");
  const idPartita  = sessionStorage.getItem("idPartita");

  if (!username || !avversario || !idPartita) {
    return window.location.href = "/pages/home.html";
  }

  const turnoInfo    = document.getElementById("turno-info");
  const campoGioco   = document.getElementById("campo-gioco");
  const abbandonaBtn = document.getElementById("abbandonaBtn");

  const cellSize = 40, rows = 10, cols = 10;
  const grid = generateGridComponent();

  campoGioco.innerHTML = `
    <div class="griglia-container">
      <h2>La Tua Griglia</h2>
      ${grid.creaGrigliaHTML("griglia-giocatore", cols*cellSize, rows*cellSize)}
    </div>
    <div class="griglia-container">
      <h2>Griglia di ${avversario}</h2>
      ${grid.creaGrigliaHTML("griglia-avversario", cols*cellSize, rows*cellSize)}
    </div>
  `;

  grid.initializeCanvasGrid("griglia-giocatore", rows, cols, cellSize);
  grid.initializeCanvasGrid("griglia-avversario", rows, cols, cellSize);

  const canvasAvv = document.getElementById("griglia-avversario");
  const turno     = generateTurno((x, y) => {
    socket.emit("colpo", { idPartita, giocatoreAttaccante: username, coordinate:{x,y} });
    turnoInfo.innerText = `In attesa di ${avversario}...`;
    turno.setTurno(false);
  });

  abbandonaBtn.onclick = () => {
    socket.emit("abbandona_partita", { idPartita, giocatoreCheAbbandona: username });
    window.location.href = "/pages/home.html";
  };

  socket.on("avversario_abbandona", () => {
    window.location.href = "/pages/home.html";
  });

  socket.on("cambio_turno", ({ prossimoGiocatore }) => {
    if (prossimoGiocatore === username) {
      turnoInfo.innerText = "È il tuo turno!";
      turno.setTurno(true);
      turno.abilitaInput(canvasAvv);
    } else {
      turnoInfo.innerText = `Turno di ${avversario}...`;
      turno.setTurno(false);
    }
  });

  socket.on("risultato_colpo", ({ x, y, tipoRisultato, giocatoreColpito, naveAffondataInfo }) => {
    const ctx = document
      .getElementById(giocatoreColpito === username ? "griglia-giocatore" : "griglia-avversario")
      .getContext("2d");

    if (tipoRisultato === "colpito") {
      ctx.fillStyle = "orange";
      ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
    }
    if (tipoRisultato === "mancato") {
      ctx.fillStyle = "#ADD8E6";
      ctx.beginPath();
      ctx.arc(x*cellSize+cellSize/2, y*cellSize+cellSize/2, cellSize/4, 0, 2*Math.PI);
      ctx.fill();
    }
    if (tipoRisultato === "affondato" && naveAffondataInfo?.celle) {
      ctx.fillStyle = "red";
      naveAffondataInfo.celle.forEach(c => {
        ctx.fillRect(c.x*cellSize+1, c.y*cellSize+1, cellSize-2, cellSize-2);
      });
    }
    turno.setTurno(false);
  });

  socket.on("fine_partita_notifica", ({ vincitore }) => {
    window.location.href = "/pages/home.html";
  });
};

if (document.getElementById("partita-container")) {
  generatePartitaComponent();
}
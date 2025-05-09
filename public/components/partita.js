
// partita.js
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

  // Genero l'HTML delle due griglie
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

  // Disegno le linee delle griglie
  grid.initializeCanvasGrid("griglia-giocatore", rows, cols, cellSize);
  grid.initializeCanvasGrid("griglia-avversario", rows, cols, cellSize);

  // === POSIZIONAMENTO NAVI SULLA GRIGLIA DEL GIOCATORE ===
  const canvasGiocatore = document.getElementById("griglia-giocatore");
  const ctxGiocatore    = canvasGiocatore.getContext("2d");

  // Mappa dei colori per lunghezza nave
  const shipColors = {
    5: 'red',
    4: 'blue',
    3: 'green',
    2: 'orange',
    1: 'purple'
  };
  const navi = [5, 4, 3, 2, 1, 1]; // lunghezze delle navi

  // Imposto una sola volta lo stile del bordo
  ctxGiocatore.strokeStyle = "black";
  ctxGiocatore.lineWidth   = 2;

  for (const lunghezza of navi) {
    const coordinate = grid.posizionaNave(lunghezza);

    // Colore di riempimento in base alla lunghezza
    ctxGiocatore.fillStyle = shipColors[lunghezza] || 'gray';
    coordinate.forEach(({ x, y }) => {
      // riempio la cella
      ctxGiocatore.fillRect(
        x * cellSize + 1,
        y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      // disegno il bordo della cella
      ctxGiocatore.strokeRect(
        x * cellSize + 1,
        y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  }
  // =======================================================

  // Preparo il turno di gioco
  const canvasAvv = document.getElementById("griglia-avversario");
  const turno     = generateTurno((x, y) => {
    socket.emit("colpo", {
      idPartita,
      giocatoreAttaccante: username,
      coordinate: { x, y }
    });
    turnoInfo.innerText = `In attesa di ${avversario}...`;
    turno.setTurno(false);
  });

  // Bottone per abbandonare la partita
  abbandonaBtn.onclick = () => {
    socket.emit("abbandona_partita", {
      idPartita,
      giocatoreCheAbbandona: username
    });
    window.location.href = "/pages/home.html";
  };

  // Gestione evento: avversario abbandona
  socket.on("avversario_abbandona", () => {
    window.location.href = "/pages/home.html";
  });

  // Gestione cambio turno
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

  // Gestione risultato del colpo
  socket.on("risultato_colpo", ({ x, y, tipoRisultato, giocatoreColpito, naveAffondataInfo }) => {
    const ctx = document
      .getElementById(
        giocatoreColpito === username
          ? "griglia-giocatore"
          : "griglia-avversario"
      )
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

  // Fine partita: torno alla home
  socket.on("fine_partita_notifica", ({ vincitore }) => {
    window.location.href = "/pages/home.html";
  });
};

if (document.getElementById("partita-container")) {
  generatePartitaComponent();
}

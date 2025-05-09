import { generateGridComponent } from "./griglia.js";
import { socket } from "./socket.js";
import { generateTurno } from "./turno.js";

export const generatePartitaComponent = () => {
  console.log("Inizializzazione partita...");

  const username = sessionStorage.getItem("username");
  const avversario = sessionStorage.getItem("avversario");
  const idPartita = sessionStorage.getItem("idPartita");

  if (!username || !avversario || !idPartita) {
    return window.location.href = "/pages/home.html";
  }

  const turnoInfo = document.getElementById("turno-info");
  const campoGioco = document.getElementById("campo-gioco");
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

  const canvasGiocatore = document.getElementById("griglia-giocatore");
  const ctxGiocatore = canvasGiocatore.getContext("2d");

  const shipColors = {5: 'red', 4: 'pink', 3: 'green', 2: 'orange', 1: 'purple'};
  const navi = [5, 4, 3, 2, 1, 1];
  const naviPosizionate = [];

  ctxGiocatore.strokeStyle = "black";
  ctxGiocatore.lineWidth = 2;

  navi.forEach(lunghezza => {
    const coordinate = grid.posizionaNave(lunghezza);
    naviPosizionate.push({ coordinate, lunghezza });
    ctxGiocatore.fillStyle = shipColors[lunghezza];
    coordinate.forEach(({x, y}) => {
      ctxGiocatore.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
      ctxGiocatore.strokeRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
    });
  });

  const colpiEffettuati = new Set();

  const naviAvversarioPosizionate = [
    { coordinate: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }], lunghezza: 5 },
    { coordinate: [{ x: 2, y: 6 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }], lunghezza: 4 },
  ];

  const colpoRiuscito = (x, y) => {
    return naviAvversarioPosizionate.some(nave => 
      nave.coordinate.some(cella => cella.x === x && cella.y === y)
    );
  };

  const canvasAvv = document.getElementById("griglia-avversario");
  
  const handleClick = (x, y) => {
    const colpo = `${x}-${y}`;

    if (colpiEffettuati.has(colpo)) {
      console.log("Cella già colpita!");
      return;
    }

    colpiEffettuati.add(colpo);

    console.log(`Click su x:${x}, y:${y}`);
    const ctxAvv = canvasAvv.getContext("2d");

    socket.emit("colpo", {
      idPartita,
      giocatoreAttaccante: username,
      coordinate: {x, y}
    });
    turnoInfo.innerText = `In attesa di ${avversario}...`;

    ctxAvv.fillStyle = "yellow";
    ctxAvv.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
    ctxAvv.strokeRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);

    if (colpoRiuscito(x, y)) {
      ctxAvv.fillStyle = "green";
    } else {
      ctxAvv.fillStyle = "red";
    }

    ctxAvv.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
    ctxAvv.strokeRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
  };

  canvasAvv.addEventListener('click', (e) => {
    const rect = canvasAvv.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
   
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      handleClick(x, y);
    }
  });

  abbandonaBtn.onclick = () => {
    socket.emit("abbandona_partita", {
      idPartita,
      giocatoreCheAbbandona: username
    });
    window.location.href = "/pages/home.html";
  };

  socket.on("avversario_abbandona", () => {
    window.location.href = "/pages/home.html";
  });

  socket.on("cambio_turno", ({ prossimoGiocatore }) => {
    if (prossimoGiocatore === username) {
      turnoInfo.innerText = "È il tuo turno!";
    } else {
      turnoInfo.innerText = `Turno di ${avversario}...`;
    }
  });

  socket.on("risultato_colpo", ({x, y, colpito, giocatoreColpito, naveAffondataInfo}) => {
    const ctx = document.getElementById(
      giocatoreColpito === username ? "griglia-giocatore" : "griglia-avversario"
    ).getContext("2d");

    if (colpito) {
      ctx.fillStyle = 'green'; 
    } else {
      ctx.fillStyle = "red"; 
      ctx.beginPath();
      ctx.arc(x*cellSize+cellSize/2, y*cellSize+cellSize/2, cellSize/4, 0, 2*Math.PI);
      ctx.fill();
    }

    ctx.fillRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);
    ctx.strokeRect(x*cellSize+1, y*cellSize+1, cellSize-2, cellSize-2);

    if (naveAffondataInfo) {
      naveAffondataInfo?.celle?.forEach(c => {
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(c.x*cellSize+1, c.y*cellSize+1, cellSize-2, cellSize-2);
        ctx.strokeRect(c.x*cellSize+1, c.y*cellSize+1, cellSize-2, cellSize-2);
      });
    }
  });
};

if (document.getElementById("partita-container")) {
  generatePartitaComponent();
}

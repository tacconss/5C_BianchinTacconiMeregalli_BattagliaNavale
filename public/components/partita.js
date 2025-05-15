import { generateGridComponent } from "./griglia.js";
import { socket } from "./socket.js";
import { generateTurno } from "./turno.js";

export const generatePartitaComponent = () => {
  console.log("Inizializzazione partita...");

  // Recupera username, avversario e idPartita dal sessionStorage
  const username = sessionStorage.getItem("username");
  const avversario = sessionStorage.getItem("avversario");
  const idPartita = sessionStorage.getItem("idPartita");
  let current;
  socket.emit("avvia_partita", { username, avversario, idPartita });
  socket.on("avvia_partita", ({ c, idPartit }) => {
    if (idPartit === idPartita) current = c;
  })


  // Verifica che ci siano tutti i dati necessari
  if (!username || !avversario || !idPartita) {
    // Se manca qualche dato, redirige all'home
    return window.location.href = "/pages/home.html";
  }

  // Inizializza il resto della logica del gioco
  const turnoInfo = document.getElementById("turno-info");
  const campoGioco = document.getElementById("campo-gioco");
  const abbandonaBtn = document.getElementById("abbandonaBtn");
  const cellSize = 40, rows = 10, cols = 10;
  const grid = generateGridComponent();
  const gridA = generateGridComponent();

  campoGioco.innerHTML = `
    <div class="griglia-container">
      <h2>La Tua Griglia</h2>
      ${grid.creaGrigliaHTML("griglia-giocatore", cols * cellSize, rows * cellSize)}
    </div>
    <div class="griglia-container">
      <h2>Griglia di ${avversario}</h2>
      ${gridA.creaGrigliaHTML("griglia-avversario", cols * cellSize, rows * cellSize)}
    </div>
  `;

  //traccio le linee
  grid.initializeCanvasGrid("griglia-giocatore", rows, cols, cellSize);
  gridA.initializeCanvasGrid("griglia-avversario", rows, cols, cellSize);

  const canvasMe = document.getElementById("griglia-giocatore");
  const ctxMe = canvasMe.getContext("2d");
  const canvasAv = document.getElementById("griglia-avversario");
  const ctxAv = canvasAv.getContext("2d");
  [ctxMe, ctxAv].forEach(ctx => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  });

  const shipColors = { 5: 'red', 4: 'pink', 3: 'green', 2: 'orange', 1: 'purple' };
  const shipColorsAvv = { 5: 'gray', 4: 'lightblue', 3: 'lightgreen', 2: 'lightpink', 1: 'lightyellow' };
  const shipsList = [5, 4, 3, 2, 1, 1];

  function loadOrGenerateShips(player, gridInstance) {
    const key = `navi_${player}`;
    let arr = JSON.parse(localStorage.getItem(key) || "null");
    if (!arr) {
      arr = shipsList.map(lunghezza => ({
        lunghezza,
        coordinate: gridInstance.posizionaNave(lunghezza)
      }));
      localStorage.setItem(key, JSON.stringify(arr));
    }
    return arr;
  }

  const naviPosMe = loadOrGenerateShips(username, grid);
  const naviPosAvv = loadOrGenerateShips(avversario, gridA);

  naviPosMe.forEach(({ lunghezza, coordinate }) => {
    ctxMe.fillStyle = shipColors[lunghezza];
    coordinate.forEach(({ x, y }) => {
      ctxMe.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctxMe.strokeRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
  });

  socket.on("colpo", (value) => { if (idPartita === value.idPartita) current = value.player });
  const colpiEff = new Set();
  const hitTest = (x, y) =>
    naviPosAvv.some(nave => nave.coordinate.some(c => c.x === x && c.y === y));

  function handleClick(x, y) {

    if (current === username) {
      const key = `${x}-${y}`;
      if (colpiEff.has(key)) return;
      colpiEff.add(key);
      socket.emit("colpo", { idPartita, giocatoreAttaccante: username, player: avversario, coordinate: { x, y } });
      socket.on("colpo", (value) => {
        if (idPartita === value.idPartita)
          if (value.giocatoreAttaccante !== username) {
            console.log(value);
            turnoInfo.innerText = ``;
          } // Se la partita è corretta ed è finito il turno dell'avversario

      })
      turnoInfo.innerText = `In attesa di ${avversario}...`;
      ctxAv.fillStyle = hitTest(x, y) ? "green" : "red";
      ctxAv.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctxAv.strokeRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    }
    checkVictory();
  }
  socket.on("end_game", ({ id, winner }) => {
    console.log("Entrato")
    if (id === idPartita)
      if (username === winner) window.location.href = `/pages/vittoria.html?vincitore=${username}`;
      else window.location.href = `/pages/loose.html?sconfitta=${username}`;
  });
  socket.on("abbandona_partita", (values) => {
    console.log(values);
    if (values.idPartita === idPartita)
      if (values.avversario !== username) {
        //alert("if");
        window.location.href = "/pages/home.html";
      } else {
        //alert("else");
        window.location.href = `/pages/vittoria.html?vincitore=${username}`;
      }
  });
  abbandonaBtn.onclick = () => {
    const gAbbandona = { idPartita, giocatoreCheAbbandona: username };
    const gWin = { idPartita, vincitore: avversario };
    //alert("Sei sicuro di voler abbandonare la partita?");
    socket.emit("abbandona_partita", gAbbandona);
    // socket.on("conferma_abbandono", (id) => {



    //  });
  };

  function checkVictory() {
    const tutteAffondate = naviPosAvv.every(nave =>
      nave.coordinate.every(coord => colpiEff.has(`${coord.x}-${coord.y}`))
    );

    if (tutteAffondate) {
      socket.emit("vittoria", { idPartita, vincitore: username });
      const url = `/pages/vittoria.html?vincitore=${username}`;
      window.location.href = url;
    }






  }



  canvasAv.onclick = function (e) {
    const r = canvasAv.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / cellSize);
    const y = Math.floor((e.clientY - r.top) / cellSize);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      handleClick(x, y);
    }
  };



  socket.on("partita_terminata", () => {
    window.location.href = "/pages/home.html";
  });

  socket.on("avversario_abbandona", () => {
    window.location.href = "/pages/home.html";
  });


  socket.on("ping", () => {
    console.log("Ping ricevuto dal server");
  });



  socket.on("risultato_colpo", ({ x, y, colpito, giocatoreColpito, naveAffondataInfo }) => {
    const ctx = document
      .getElementById(giocatoreColpito === username ? "griglia-giocatore" : "griglia-avversario")
      .getContext("2d");

    ctx.fillStyle = colpito ? "green" : "red";
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    ctx.strokeRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);

    if (naveAffondataInfo) {
      naveAffondataInfo.celle.forEach(c => {
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(c.x * cellSize + 1, c.y * cellSize + 1, cellSize - 2, cellSize - 2);
        ctx.strokeRect(c.x * cellSize + 1, c.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });
    }

    checkVictory();
  });
};

if (document.getElementById("partita-container")) {
  generatePartitaComponent();
}

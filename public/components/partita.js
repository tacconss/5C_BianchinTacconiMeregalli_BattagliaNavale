/*import { generateGridComponent } from "./griglia.js";
import { socket } from "../webSocket/socket.js";
//
export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    const gridComponent = generateGridComponent();

    const inizia = () => {
        const campoGioco = document.getElementById("campo-gioco");

        const containerGiocatore = document.createElement("div");
        const titolo1 = `<h2>Tua griglia</h2>`;
        const grigliaGiocatore = gridComponent.creaGriglia("griglia-giocatore");
        containerGiocatore.innerHTML = titolo1;
        containerGiocatore.append(grigliaGiocatore);

        const containerAvversario = document.createElement("div");
        const titolo2 = `<h2>Griglia di ${avversario}</h2>`;
        const grigliaAvversario = gridComponent.creaGriglia("griglia-avversario");
        containerAvversario.innerHTML = titolo2;
        containerAvversario.append(grigliaAvversario);

        campoGioco.append(containerGiocatore, containerAvversario);

        document.getElementById("turno-info").textContent = "5:00";
    };

    return {
        inizia,
        cambiaTurno: () => {},
        registraColpo: () => null,
        verificaFinePartita: () => false,
        termina: () => vincitore,
        gestisciAbbandono: () => vincitore
    };
};

const avversario = sessionStorage.getItem("avversario");
if (!avversario) {
    alert("Errore: nessun avversario trovato. Ritorno alla home.");
    window.location.href = "home.html";
} else {
    const partitaContainer = document.getElementById("partita-container");
    const partita = generatePartitaComponent(partitaContainer, avversario);
    partita.inizia();
}
*/
import { generateGridComponent } from "./griglia.js";
import { socket } from "./socket.js";
import { generateTurno } from "./turno.js";


export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    const gridComponent = generateGridComponent();

    const inizia = () => {
        const campoGioco = document.getElementById("campo-gioco");
    
        const containerGiocatore = document.createElement("div");
        containerGiocatore.innerHTML = `<h2>Tua griglia</h2>`;
        const grigliaGiocatore = gridComponent.creaGriglia("griglia-giocatore");
        containerGiocatore.append(grigliaGiocatore);
    
        const containerAvversario = document.createElement("div");
        containerAvversario.innerHTML = `<h2>Griglia di ${avversario}</h2>`;
        const grigliaAvversario = gridComponent.creaGriglia("griglia-avversario");
        containerAvversario.append(grigliaAvversario);
    
        campoGioco.append(containerGiocatore, containerAvversario);
    
        // Posiziona tutte le navi
        const flotte = [5, 4, 3, 2, 1, 1];
        const ctx = grigliaGiocatore.getContext("2d");
        ctx.fillStyle = "#555";
    
        flotte.forEach((lunghezza) => {
            const nave = gridComponent.posizionaNave(lunghezza);
            nave.forEach(({ x, y }) => {
                ctx.fillRect(x * 40 + 1, y * 40 + 1, 38, 38);
            });
        });
    
        // Turni
        const turno = generateTurno((x, y) => {
            const ctxAvversario = grigliaAvversario.getContext("2d");
            ctxAvversario.fillStyle = "#f00";
            ctxAvversario.fillRect(x * 40 + 1, y * 40 + 1, 38, 38);
    
            socket.emit("colpo", { x, y }); // da gestire lato server
        });
    
        turno.setTurno(true); // Simulazione: il giocatore inizia per ora
        turno.abilitaInput(grigliaAvversario);
    };
    

    return {
        inizia,
        cambiaTurno: () => {},
        registraColpo: () => null,
        verificaFinePartita: () => false,
        termina: () => vincitore,
        gestisciAbbandono: () => vincitore
    };
};

const avversario = sessionStorage.getItem("avversario");
if (!avversario) {
    alert("Errore: nessun avversario trovato. Ritorno alla home.");
    window.location.href = "home.html";
} else {
    const partitaContainer = document.getElementById("partita-container");
    const partita = generatePartitaComponent(partitaContainer, avversario);
    partita.inizia();
}

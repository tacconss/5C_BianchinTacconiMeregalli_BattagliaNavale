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
import { socket } from "../webSocket/socket.js";

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

        // Posiziona nave randomicamente sulla griglia del giocatore
        const coordinateNave = gridComponent.posizionaNave(3); // es. nave lunga 3

        // Disegna la nave visivamente solo sulla griglia del giocatore
        const ctx = grigliaGiocatore.getContext("2d");
        ctx.fillStyle = "#555"; // colore della nave

        coordinateNave.forEach(({ x, y }) => {
            ctx.fillRect(x * 40 + 1, y * 40 + 1, 38, 38); // +1 per non coprire le linee
        });

        const containerAvversario = document.createElement("div");
        const titolo2 = `<h2>Griglia di ${avversario}</h2>`;
        const grigliaAvversario = gridComponent.creaGriglia("griglia-avversario");
        containerAvversario.innerHTML = titolo2;
        containerAvversario.append(grigliaAvversario);

        campoGioco.append(containerGiocatore, containerAvversario);

        document.getElementById("turno-info").innerText = "5:00";
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
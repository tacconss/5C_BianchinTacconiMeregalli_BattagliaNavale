import { socket } from "../webSocket/socket.js"; 

export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    const creaGriglia = (idCanvas) => {
        const canvas = document.createElement("canvas");
        const dimensioneCella = 40;
        const righe = 10;
        const colonne = 10;
        canvas.width = colonne * dimensioneCella;
        canvas.height = righe * dimensioneCella;
        canvas.style.border = "2px solid black";
        canvas.id = idCanvas;

        const ctx = canvas.getContext("2d");

        for (let i = 0; i <= righe; i++) {
            ctx.moveTo(0, i * dimensioneCella);
            ctx.lineTo(canvas.width, i * dimensioneCella);
        }

        for (let j = 0; j <= colonne; j++) {
            ctx.moveTo(j * dimensioneCella, 0);
            ctx.lineTo(j * dimensioneCella, canvas.height);
        }

        ctx.strokeStyle = "#000";
        ctx.stroke();

        return canvas;
    };

    const inizia = () => {
        const campoGioco = document.getElementById("campo-gioco");

        const containerGiocatore = document.createElement("div");
        const titolo1 = `<h2>Tua griglia</h2>`;
        const grigliaGiocatore = creaGriglia("griglia-giocatore");
        containerGiocatore.innerHTML = titolo1;
        containerGiocatore.append(grigliaGiocatore);

        const containerAvversario = document.createElement("div");
        const titolo2 = `<h2>Griglia di ${avversario}</h2>`;
        const grigliaAvversario = creaGriglia("griglia-avversario");
        containerAvversario.innerHTML = titolo2;
        containerAvversario.append(grigliaAvversario);

        campoGioco.append(containerGiocatore, containerAvversario);

        document.getElementById("turno-info").textContent = "5:00";
    };

    return {
        inizia,
        cambiaTurno: () => {},
        registraColpo: () => {
            return null;
        },
        verificaFinePartita: () => {
            return false;
        },
        termina: () => {
            return vincitore;
        },
        gestisciAbbandono: () => {
            return vincitore;
        }
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

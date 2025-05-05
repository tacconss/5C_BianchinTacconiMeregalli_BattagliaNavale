import { socket } from "../../../src/middleware/socket.js"; 

export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    
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

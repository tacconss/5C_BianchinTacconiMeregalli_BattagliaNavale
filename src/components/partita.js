import { socket } from "../webSocket/socket.js"; 

/* 
const username = sessionStorage.getItem("username");
if (username) {
    socket.emit("join", username); // Ri-registra il giocatore anche qui
}
    */

export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    const creaGriglia = () => {
        // Logica per creare la griglia
    };

    const inizia = () => {
        // Logica di inizio partita
    };

    return {
        inizia,
        cambiaTurno: () => {
            // Da completare
        },
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

// === Inizializzazione immediata ===

const avversario = sessionStorage.getItem("avversario");
if (!avversario) {
    alert("Errore: nessun avversario trovato. Ritorno alla home.");
    window.location.href = "home.html";
} else {
    const partitaContainer = document.getElementById("partita-container");
    const partita = generatePartitaComponent(partitaContainer, avversario);
    partita.inizia();
}

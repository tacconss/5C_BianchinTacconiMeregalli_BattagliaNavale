export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let stato = false;
    let giocatoreCorrente;
    let vincitore;

    const creaGriglia = () => {
    };

    const inizia = () => {
    };

    return {
        inizia,
        cambiaTurno: () => {
            // Da completare
        },
        registraColpo: () => {
            return null; // Da completare
        },
        verificaFinePartita: () => {
            return false; // Da completare
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

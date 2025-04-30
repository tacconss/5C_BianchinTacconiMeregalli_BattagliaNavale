import { socket } from "../webSocket/socket.js";
import { drawShip } from "../components/nave.js";


export const generatePartitaComponent = (parentElement, avversario) => {
    let idPartita;
    let statoPartita = false;
    let giocatoreAttuale;
    let giocatoreVincitore;

    let tuaGriglia = Array(10).fill(null).map(() => Array(10).fill(null));
    let grigliaNemico = Array(10).fill(null).map(() => Array(10).fill(null));

    const disegnaGriglie = () => {
        const campoGiocoHTML = document.getElementById("campo-gioco");
        if (campoGiocoHTML) {
            let htmlGriglie = `<div class="griglia-container">
                                <div class="griglia griglia-utente">
                                    <h3>La tua flotta</h3>
                                    ${creaCelleHTML(false)}
                                </div>
                                <div class="griglia griglia-avversario">
                                    <h3>Flotta di ${avversario}</h3>
                                    ${creaCelleHTML(true)}
                                </div>
                            </div>`;
            campoGiocoHTML.innerHTML = htmlGriglie;

            const celleAvversarioHTML = campoGiocoHTML.querySelectorAll('.griglia-avversario .cella');
            celleAvversarioHTML.forEach(cella => {
                cella.onclick = function(eventoClick) {
                    gestisciClickNemico(eventoClick);
                };
            });
        } else {
            console.error("Non ho trovato l'elemento 'campo-gioco' nell'HTML.");
        }
    };

    const creaCelleHTML = (isAvversario) => {
        let celle = '';
        for (let riga = 0; riga < 10; riga++) {
            for (let colonna = 0; colonna < 10; colonna++) {
                celle += `<div class="cella" data-riga="${riga}" data-colonna="${colonna}"></div>`;
            }
        }
        return celle;
    };

    const gestisciClickNemico = (evento) => {
        if (!statoPartita || giocatoreAttuale !== sessionStorage.getItem("username")) {
            console.log("Non è il tuo turno o la partita non è ancora iniziata.");
            return;
        }

        const riga = parseInt(evento.target.dataset.riga);
        const colonna = parseInt(evento.target.dataset.colonna);

        evento.target.classList.add("colpito");

        console.log("Evento 'colpo' emesso:", { idPartita, riga, colonna });
    };

    const avviaPartita = () => {
        disegnaGriglie();
        statoPartita = true;

        console.log("Evento 'inizioPartita' emesso:", avversario);
    };

    return {
        inizia: avviaPartita,
        cambiaTurno: () => {
        },
        registraColpo: () => {
            return null;
        },
        verificaFinePartita: () => {
            return false;
        },
        termina: () => {
            return giocatoreVincitore;
        },
        gestisciAbbandono: () => {
            return giocatoreVincitore;
        }
    };
};


const nomeAvversario = sessionStorage.getItem("avversario");
if (!nomeAvversario) {
    alert("Ops! Non ho trovato l'avversario. Ti riporto alla pagina iniziale.");
    window.location.href = "home.html";
} else {
    const contenitorePartita = document.getElementById("partita-container");
    if (contenitorePartita) {
        const partita = generatePartitaComponent(contenitorePartita, nomeAvversario);
        partita.inizia();
    } else {
        console.error("Non ho trovato l'elemento 'partita-container' nell'HTML.");
    }
}


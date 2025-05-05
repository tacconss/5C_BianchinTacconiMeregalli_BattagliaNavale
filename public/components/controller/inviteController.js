import { inviteModel } from "../model/inviteModel.js";
import { inviteView } from "../view/inviteView.js";

let socket;
let container;

export const inviteController = {
  init(ioSocket, gameContainer) {
    socket = ioSocket;
    container = gameContainer;

    socket.on("ricevi_invito", ({ mittente }) => {
      inviteView.renderInvito(container, mittente, socket);
    });

    socket.on("invito_error", (msg) => {
      alert("Errore invito: " + msg);
    });

    socket.on("invito_rifiutato", ({ da }) => {
      alert(`${da} ha rifiutato il tuo invito.`);
    });

    socket.on("avvia_partita", ({ avversario, idPartita }) => {
      sessionStorage.setItem("avversario", avversario);
      sessionStorage.setItem("idPartita", idPartita);
      window.location.href = "../../pages/index.html";
    });
  },

  inviaInvito(nomeDestinatario) {
    if (!nomeDestinatario) return;

    if (inviteModel.isUtenteInPartita(nomeDestinatario)) {
      alert(`${nomeDestinatario} è attualmente in partita.`);
      return;
    }

    socket.emit("invia_invito", { destinatario: nomeDestinatario });
  }
};

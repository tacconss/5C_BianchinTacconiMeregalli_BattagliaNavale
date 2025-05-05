// components/controller/partitaController.js

import { partitaModel } from "../model/partitaModel.js";
import { partitaView } from "../view/partitaView.js";
import { grigliaModel } from "../model/grigliaModel.js";
import { socket } from "../webSocket/socket.js";

export const partitaController = {
  avversario: null,

  init(avversario) {
    this.avversario = avversario;

    partitaView.creaCampoGioco(avversario);
    partitaView.mostraTimer("5:00");
  },

  registraColpo(x, y) {
    // Esempio base di gestione colpo
    const cella = grigliaModel.getCasella()[x]?.[y];
    return cella === "nave" ? "colpito" : "mancato";
  },

  terminaPartita() {
    partitaModel.setVincitore("Qualcuno");
    return partitaModel.getVincitore();
  }
};

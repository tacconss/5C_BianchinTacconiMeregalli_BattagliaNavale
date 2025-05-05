// components/view/partitaView.js

import { grigliaView } from "./grigliaView.js";

export const partitaView = {
  creaCampoGioco(avversario) {
    const campoGioco = document.getElementById("campo-gioco");

    const containerGiocatore = document.createElement("div");
    containerGiocatore.innerHTML = `<h2>Tua griglia</h2>`;
    containerGiocatore.append(grigliaView.creaGriglia("griglia-giocatore"));

    const containerAvversario = document.createElement("div");
    containerAvversario.innerHTML = `<h2>Griglia di ${avversario}</h2>`;
    containerAvversario.append(grigliaView.creaGriglia("griglia-avversario"));

    campoGioco.append(containerGiocatore, containerAvversario);
  },

  mostraTimer(testuale) {
    document.getElementById("turno-info").textContent = testuale;
  }
};

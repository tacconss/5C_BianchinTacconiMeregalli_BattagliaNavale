import { socket } from "../webSocket/socket.js";
import { generateInviteComponent } from "./invite.js";
import { generateGiocatoreComponent } from "./giocatore.js";

export const generateGamePage = (parentElement) => {
  const html = `
    <div id="name-modal" class="modal show">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Entra in Naval Battle</h5>
        </div>
        <div class="modal-body">
          <label for="name-input">Inserisci il tuo nome:</label>
          <input type="text" id="name-input" required />
        </div>
        <div class="modal-footer">
          <button type="button" id="join-button">Entra</button>
        </div>
      </div>
    </div>

    <div id="modal-backdrop" class="modal-backdrop show"></div>
    <div id="invite-container" style="display: none;"></div>

    <div id="game-container" class="game-container" style="display: none;">
      <h1>Naval Battle</h1>
      <div class="content">
        <div class="section">
          <h5>Partite</h5>
          <ul id="game-list"></ul>
        </div>
        <div class="section">
          <img src="/data/logo.png" alt="logo" />
        </div>
        <div class="section">
          <h5>Giocatori</h5>
          <ul id="player-list"></ul>
        </div>
      </div>
    </div>
  `;

  const renderGame = () => {
    parentElement.innerHTML = html;

    const nameModal = document.getElementById("name-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const gameContainer = document.getElementById("game-container");
    const inviteContainer = document.getElementById("invite-container");
    const joinButton = document.getElementById("join-button");

    const inviteComponent = generateInviteComponent(gameContainer, socket);

    const updatePlayerList = (users) => {
      const currentUser = sessionStorage.getItem("username");
      const list = document.getElementById("player-list");

      list.innerHTML = users
        .filter(user => user.name !== currentUser)
        .map(user => {
          const stato = user.playing ? "in partita" : "libero";
          return generateGiocatoreComponent(user.name, stato).renderHTML();
        }).join("");

      list.querySelectorAll(".invite-button").forEach(button => {
        const nome = button.dataset.nome;
        button.onclick = () => inviaInvito(nome);
      });
    };

    const updateGameList = (games = []) => {
      document.getElementById("game-list").innerHTML = games.map(g => `<li>${g}</li>`).join("");
    };

    const inviaInvito = (nomeDestinatario) => {
      if (!nomeDestinatario) return;

      const inPartita = [...document.querySelectorAll("#player-list li")]
        .some(li => li.innerText.trim() === `${nomeDestinatario} - in partita`);

      if (inPartita) {
        alert(`${nomeDestinatario} è attualmente in partita.`);
        return;
      }

      socket.emit("invia_invito", { destinatario: nomeDestinatario });
    };

    joinButton.onclick = () => {
      const username = document.getElementById("name-input").value.trim();
      if (username !== "") {
        sessionStorage.setItem("username", username);
        socket.emit("join", username);
      }
    };

    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername) socket.emit("join", savedUsername);

    socket.on("join_error", (message) => alert(message));

    socket.on("list", (users) => {
      updatePlayerList(users);
      updateGameList(["Game 1 (P1 vs P2)", "Game 2 (P3 vs P4)"]);

      nameModal.classList.remove("show");
      backdrop.classList.remove("show");
      gameContainer.style.display = "block";
      inviteContainer.style.display = "block";
    });

    socket.on("ricevi_invito", ({ mittente }) => {
      inviteComponent.mostraInvito(mittente);
    });

    socket.on("invito_error", (msg) => alert("Errore invito: " + msg));

    socket.on("avvia_partita", ({ avversario, idPartita }) => {
      sessionStorage.setItem("avversario", avversario);
      sessionStorage.setItem("idPartita", idPartita);
      window.location.href = "/pages/partita.html";
    });

    socket.on("invito_rifiutato", ({ da }) => {
      alert(`${da} ha rifiutato il tuo invito.`);
    });
  };

  return { renderGame };
};

import { socket } from "./socket.js";
import { generateInviteComponent } from "../components/invite.js";

const savedUsername = sessionStorage.getItem("username");
if (savedUsername) {
    socket.emit("join", savedUsername);
}

const nameModal = document.getElementById("name-modal");
const backdrop = document.getElementById("modal-backdrop");
const gameContainer = document.getElementById("game-container");
const inviteContainer = document.getElementById("invite-container");
const inviteSection = document.getElementById("invite-section");

const joinButton = document.getElementById("join-button");
const inviteButton = document.getElementById("invite-button");
const nameInput = document.getElementById("name-input");
const inviteInput = document.getElementById("invite-input");

const inviteComponent = generateInviteComponent(gameContainer, socket);

// ✅ Funzioni spostate da home.js
function updatePlayerList(users) {
  let html = "";
  for (let i = 0; i < users.length; i++) {
    const stato = users[i].playing ? "in partita" : "libero";
    html += `<li>${users[i].name} - <span>${stato}</span></li>`;
  }
  document.getElementById("player-list").innerHTML = html;
}

function updateGameList(games = []) {
  let html = "";
  for (let i = 0; i < games.length; i++) {
    html += "<li>" + games[i] + "</li>";
  }
  document.getElementById("game-list").innerHTML = html;
}

// Evento per entrare nel gioco
joinButton.onclick = () => {
  const username = nameInput.value.trim();
  if (username !== "") {
    sessionStorage.setItem("username", username);
    socket.emit("join", username);
  }
};

// Invio invito
inviteButton.onclick = () => {
  const target = inviteInput.value.trim();
  const liList = document.querySelectorAll("#player-list li");

  // Controlla se il giocatore è in partita
  for (let i = 0; i < liList.length; i++) {
    const li = liList[i];
    if (li.textContent.indexOf(target) === 0) {
      if (li.textContent.indexOf("in partita") !== -1) {
        alert(`${target} è attualmente in partita.`);
        return;
      }
    }
  }

  if (target !== "") {
    socket.emit("invia_invito", { destinatario: target });
  }
};

// Ricezione errori
socket.on("join_error", (message) => {
  alert(message);
});

// Dopo join riuscito
socket.on("list", (users) => {
  console.log("Lista aggiornata ricevuta:", users);
  updatePlayerList(users.map(u => ({ name: u.name, playing: u.playing })));
  updateGameList(["Game 1 (P1 vs P2)", "Game 2 (P3 vs P4)"]);

  nameModal.classList.remove("show");
  backdrop.classList.remove("show");
  gameContainer.style.display = "block";
  inviteContainer.style.display = "block";
  inviteSection.style.display = "block";
});

// Inviti in entrata/uscita
socket.on("ricevi_invito", ({ mittente }) => {
  inviteComponent.mostraInvito(mittente);
});

socket.on("invito_error", (msg) => {
  alert("Errore invito: " + msg);
});

socket.on("avvia_partita", ({ avversario, idPartita }) => {
  sessionStorage.setItem("avversario", avversario);
  sessionStorage.setItem("idPartita", idPartita);
  window.location.href = "../pages/partita.html";
});

socket.on("invito_rifiutato", ({ da }) => {
  alert(`${da} ha rifiutato il tuo invito.`);
});

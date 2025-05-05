import { socket } from "../../../src/middleware/socket.js";
import { generateInviteComponent } from "./inviteModel.js";

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
const nameInput = document.getElementById("name-input");

const inviteComponent = generateInviteComponent(gameContainer, socket);


socket.on("join_error", (message) => {
  alert(message);
});

socket.on("list", (users) => {
  console.log("Lista aggiornata ricevuta:", users);
  updatePlayerList(users.map(u => ({ name: u.name, playing: u.playing })));
  updateGameList(["Game 1 (P1 vs P2)", "Game 2 (P3 vs P4)"]);

  nameModal.classList.remove("show");
  backdrop.classList.remove("show");
  gameContainer.style.display = "block";
  inviteContainer.style.display = "block";
  if (inviteSection) inviteSection.style.display = "block";
});

socket.on("ricevi_invito", ({ mittente }) => {
  inviteComponent.mostraInvito(mittente);
});

socket.on("invito_error", (msg) => {
  alert("Errore invito: " + msg);
});

socket.on("avvia_partita", ({ avversario, idPartita }) => {
  sessionStorage.setItem("avversario", avversario);
  sessionStorage.setItem("idPartita", idPartita);
  window.location.href = "../../pages/partita.html";
});

socket.on("invito_rifiutato", ({ da }) => {
  alert(`${da} ha rifiutato il tuo invito.`);
});
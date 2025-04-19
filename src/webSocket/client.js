/*import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js"
 import { updatePlayerList, updateGameList } from "../components/home.js";
 
 const socket = io();
 const nameModal = document.getElementById("name-modal");
 const backdrop = document.getElementById("modal-backdrop");
 const gameContainer = document.getElementById("game-container");
 
 document.getElementById("join-button").onclick = function () {
   const nameInput = document.getElementById("name-input");
   const username = nameInput.value.trim();
   if (username !== "") {
     socket.emit("join", username);
   }
 };
 
 
 socket.on("join_error", (message) => {
   alert(message);
 });
 
 socket.on("list", (users) => {
   updatePlayerList(users.map(u => ({ name: u.name })));
   updateGameList(["Game 1 (P1 vs P2)", "Game 2 (P3 vs P4)"]);
   nameModal.classList.remove("show");
   backdrop.classList.remove("show");
   gameContainer.style.display = "block";
 });
 */
 import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js";
import { updatePlayerList, updateGameList } from "../components/home.js";
import { generateInviteComponent } from "../components/invite.js";

const socket = io();

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

// Evento per entrare nel gioco
joinButton.onclick = () => {
    const username = nameInput.value.trim();
    if (username !== "") {
        socket.emit("join", username);
    }
};

// Evento per inviare un invito
inviteButton.onclick = () => {
    const target = inviteInput.value.trim();
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
    updatePlayerList(users.map(u => ({ name: u.name })));
    updateGameList(["Game 1 (P1 vs P2)", "Game 2 (P3 vs P4)"]);

    nameModal.classList.remove("show");
    backdrop.classList.remove("show");
    gameContainer.style.display = "block";
    inviteContainer.style.display = "block";
    inviteSection.style.display = "block";
});

// Inviti in entrata/uscita
//provvisoriamente inseriti gli alert per testare il funzionamento, previsto poi 
//uno spazio specifico per errori o messaggi di stato
socket.on("ricevi_invito", ({ mittente }) => {
    inviteComponent.mostraInvito(mittente);
});

socket.on("invito_error", (msg) => {
    alert("Errore invito: " + msg);
});

socket.on("invito_accettato", ({ con }) => {
    alert(`Hai iniziato una partita con ${con}`);
});

socket.on("invito_rifiutato", ({ da }) => {
    alert(`${da} ha rifiutato il tuo invito.`);
});

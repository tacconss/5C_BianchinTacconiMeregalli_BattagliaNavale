import { socket } from "./socket.js";
import { generateInviteComponent } from "../components/invite.js";
import { generateGiocatoreComponent } from "../components/giocatore.js";

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

function updatePlayerList(users) {
  let html = "";
  const currentUser = sessionStorage.getItem("username");

  users.forEach(user => {
    if (user.name !== currentUser) {
      const stato = user.playing ? "in partita" : "libero";
      const comp = generateGiocatoreComponent(user.name, stato);
      html += comp.renderHTML();
    }
  });

  const list = document.getElementById("player-list");
  list.innerHTML = html;

  const buttons = list.querySelectorAll(".invite-button");
  buttons.forEach(button => {
    const nome = button.dataset.nome;
    button.onclick = () => inviaInvito(nome);
  });
}

function updateGameList(games = []) {
  let html = "";
  if (games && games.length > 0) {
    games.forEach(game => html += `<li>${game}</li>`);
  } else {
    html = "<li>Nessuna partita in corso.</li>";
  }
  document.getElementById("game-list").innerHTML = html;
}

joinButton.onclick = () => {
  const username = document.getElementById("name-input").value.trim();
  if (username !== "") {
    sessionStorage.setItem("username", username);
    socket.emit("join", username);
  }
};

function inviaInvito(nomeDestinatario) {
  if (!nomeDestinatario) return;

  const liList = document.querySelectorAll("#player-list li");
  let inPartita = false;

  liList.forEach(li => {
    const testo = li.innerText.trim();
    const previsto = `${nomeDestinatario} - in partita`;
    if (testo === previsto) {
      inPartita = true;
    }
  });

  if (inPartita) {
    alert(`${nomeDestinatario} è attualmente in partita.`);
    return;
  }

  socket.emit("invia_invito", { destinatario: nomeDestinatario });
}

socket.on("join_error", (message) => {
  alert(message);
});

socket.on("list", (users) => {
  console.log("Lista giocatori aggiornata ricevuta:", users);
  updatePlayerList(users.map(u => ({ name: u.name, playing: u.playing })));
  // La lista delle partite ora viene gestita dall'evento 'aggiorna_partite'
  nameModal.classList.remove("show");
  backdrop.classList.remove("show");
  gameContainer.style.display = "block";
  inviteContainer.style.display = "block";
  if (inviteSection) inviteSection.style.display = "block";
});

socket.on("aggiorna_partite", (partite) => {
  console.log("Lista partite aggiornata ricevuta:", partite);
  updateGameList(partite);
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
  window.location.href = "../pages/partita.html";
});

socket.on("invito_rifiutato", ({ da }) => {
  alert(`${da} ha rifiutato il tuo invito.`);
});
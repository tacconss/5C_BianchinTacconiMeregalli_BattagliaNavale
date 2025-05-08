/*import { socket } from "./socket.js";
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
  games.forEach(g => html += `<li>${g}</li>`);
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
  window.location.href = "../pages/partita.html";
});

socket.on("invito_rifiutato", ({ da }) => {
  alert(`${da} ha rifiutato il tuo invito.`);
});
*/
import { socket } from "./socket.js";
import { generateInviteComponent } from "../components/invite.js";
import { generateGiocatoreComponent } from "../components/giocatore.js";

const nameModal       = document.getElementById("name-modal");
const backdrop        = document.getElementById("modal-backdrop");
const gameContainer   = document.getElementById("game-container");
const inviteContainer = document.getElementById("invite-container");
const inviteSection   = document.getElementById("invite-section");
const joinButton      = document.getElementById("join-button");
const nameInput       = document.getElementById("name-input");
const logoutButton    = document.getElementById("logout-button");
const playerList      = document.getElementById("player-list");
const gameList        = document.getElementById("game-list");

const inviteComponent = generateInviteComponent(gameContainer, socket);

logoutButton.onclick = () => {
  socket.disconnect();
  sessionStorage.clear();
  nameModal.classList.add("show");
  backdrop.classList.add("show");
  gameContainer.style.display = "none";
  inviteContainer.style.display = "none";
  inviteSection && (inviteSection.style.display = "none");
};

const savedUsername = sessionStorage.getItem("username");
if (savedUsername) socket.emit("join", savedUsername);

joinButton.onclick = () => {
  const username = nameInput.value.trim();
  if (!username) return;
  sessionStorage.setItem("username", username);
  socket.emit("join", username);
};

socket.on("list", users => {
  let html = "";
  const me = sessionStorage.getItem("username");
  users.forEach(u => {
    if (u.name === me) return;
    const stato = u.playing ? "in partita" : "libero";
    html += generateGiocatoreComponent(u.name, stato).renderHTML();
  });
  playerList.innerHTML = html;
  playerList.querySelectorAll(".invite-button").forEach(btn => {
    btn.onclick = () => socket.emit("invia_invito", { destinatario: btn.dataset.nome });
  });

  nameModal.classList.remove("show");
  backdrop.classList.remove("show");
  gameContainer.style.display = "block";
  inviteContainer.style.display = "block";
  inviteSection && (inviteSection.style.display = "block");
});

socket.on("lista_partite", ids => {
  let html = "";
  const me = sessionStorage.getItem("username");
  ids.forEach(id => {
    const mine = id.startsWith(me + "-") || id.endsWith("-" + me);
    html += `<li>${id}${mine?` <button class="leave-game" data-game="${id}">Abbandona</button>`:""}</li>`;
  });
  gameList.innerHTML = html;
  gameList.querySelectorAll(".leave-game").forEach(btn => {
    btn.onclick = () => {
      socket.emit("abbandona_partita", {
        idPartita: btn.dataset.game,
        giocatoreCheAbbandona: sessionStorage.getItem("username")
      });
    };
  });
});

socket.on("ricevi_invito", ({ mittente }) => inviteComponent.mostraInvito(mittente));
socket.on("invito_error", msg => alert("Errore invito: " + msg));
socket.on("invito_rifiutato", ({ da }) => alert(`${da} ha rifiutato l'invito.`));

socket.on("avvia_partita", ({ avversario, idPartita }) => {
  sessionStorage.setItem("avversario", avversario);
  sessionStorage.setItem("idPartita", idPartita);
  window.location.href = "/pages/partita.html";
});




 
 export function updatePlayerList(users) {
  let html = "";
  for (let i = 0; i < users.length; i++) {
    html += "<li>" + users[i].name + "</li>";
  }
  document.getElementById("player-list").innerHTML = html;
}


export function updateGameList(games = []) {
  let html = "";
  for (let i = 0; i < games.length; i++) {
    html += "<li>" + games[i] + "</li>";
  }
  document.getElementById("game-list").innerHTML = html;
}

import { socket } from "../webSocket/socket.js";

socket.on("avvia_partita", ({ avversario, idPartita }) => {
    sessionStorage.setItem("avversario", avversario);
    sessionStorage.setItem("idPartita", idPartita);
    window.location.href = "/pages/partita.html";
});

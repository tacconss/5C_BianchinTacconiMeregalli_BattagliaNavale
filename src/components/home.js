
 
 export function updatePlayerList(users) {
    let html = "";
    for (let i = 0; i < users.length; i++) {
      const stato = users[i].playing ? "in partita" : "libero";
      html += `<li>${users[i].name} - <span>${stato}</span></li>`;
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
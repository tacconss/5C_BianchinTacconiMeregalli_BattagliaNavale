import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js"
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
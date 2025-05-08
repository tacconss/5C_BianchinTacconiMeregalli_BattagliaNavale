// public/home.js
import { renderHome } from "./renderHome.js";


export function loadHomePage() {
  const homePage = document.getElementById("home-page");
  homePage.innerHTML = renderHome();

  const joinButton = document.getElementById("join-button");
  const nameInput = document.getElementById("name-input");

  joinButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
      document.getElementById("name-modal").style.display = "none";
      document.getElementById("modal-backdrop").style.display = "none";
      document.getElementById("game-container").style.display = "block";
      // Potresti avviare qui la connessione WebSocket o altre logiche
      console.log(`Nome inserito: ${name}`);
    } else {
      alert("Per favore, inserisci un nome valido.");
    }
  });

  // Potresti caricare dinamicamente gli script WebSocket, se necessario
  import("../webSocket/client.js");
}

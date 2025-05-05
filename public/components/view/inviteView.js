export const inviteView = {
    renderInvito(container, fromUsername, socket) {
      container.innerHTML = `
        <div class="invite">
          <p>Invito da <strong>${fromUsername}</strong></p>
          <button id="accept-invite">Accetta</button>
          <button id="reject-invite">Rifiuta</button>
        </div>
      `;
  
      document.getElementById("accept-invite").onclick = () => {
        socket.emit("accetta_invito", { mittente: fromUsername });
        container.innerHTML = "";
      };
  
      document.getElementById("reject-invite").onclick = () => {
        socket.emit("rifiuta_invito", { mittente: fromUsername });
        container.innerHTML = "";
      };
    }
  };
  
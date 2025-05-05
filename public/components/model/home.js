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
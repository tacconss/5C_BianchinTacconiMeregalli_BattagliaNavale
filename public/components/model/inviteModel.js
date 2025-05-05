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
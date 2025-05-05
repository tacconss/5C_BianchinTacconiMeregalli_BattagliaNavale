export const inviteModel = {
  isUtenteInPartita(nomeDestinatario) {
    const liList = document.querySelectorAll("#player-list li");
    const previsto = `${nomeDestinatario} - in partita`;

    for (let i = 0; i < liList.length; i++) {
      if (liList[i].innerText.trim() === previsto) {
        return true;
      }
    }
    return false;
  }
};

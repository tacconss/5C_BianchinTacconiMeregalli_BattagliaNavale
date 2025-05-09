// Recupera il nome del vincitore e visualizzalo
const urlParams = new URLSearchParams(window.location.search);
const vincitore = urlParams.get('vincitore');
document.getElementById('messaggio-vittoria').textContent = `Hai vinto : ${vincitore}`;
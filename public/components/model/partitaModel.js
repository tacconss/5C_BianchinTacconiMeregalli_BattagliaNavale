// components/model/partitaModel.js

export const partitaModel = {
    idPartita: null,
    stato: false,
    giocatoreCorrente: null,
    vincitore: null,
  
    impostaId(id) {
      this.idPartita = id;
    },
  
    cambiaTurno(giocatore) {
      this.giocatoreCorrente = giocatore;
    },
  
    setVincitore(nome) {
      this.vincitore = nome;
    },
  
    getVincitore() {
      return this.vincitore;
    },
  
    verificaFinePartita(grigliaModel) {
      return grigliaModel.tutteNaviAffondate;
    }
  };
  
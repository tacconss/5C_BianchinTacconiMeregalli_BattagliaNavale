// components/model/grigliaModel.js

export const grigliaModel = {
    casella: [], // es. griglia[x][y]
    tutteNaviAffondate: false,
    colpo: { risultato: null },
  
    riceviColpo() {
      return this.colpo.risultato;
    },
  
    getCasella() {
      return this.casella;
    },
  
    posizionaNave(x, y) {
      // Esempio base: salva la posizione nel modello
      if (!this.casella[x]) this.casella[x] = [];
      this.casella[x][y] = "nave";
    }
  };
  
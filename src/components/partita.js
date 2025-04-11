export const generatePartitaComponent = (parentElement) => {
    let idPartita; /*id preso da db*/
    let stato=false/*stato partita se in esecuzione o me, se in esecuzione false senno true*/
    let giocatoreCorrente;/*giocatore 1 o 2/*
    let vincitore;/*giocatore 1 o 2 o*/
    let vincitore;/*giocatore 1 o 2*/

    return {
        inizia: (/*istanza giocatore1,istanzagiocatore2*/) => {
        },

        cambiaTurno: () => {
            /*logoica per switchare i turni*/
        },

        registraColpo: (/*istanza di colpo*/) => {
        /*logica per gestire il colpo*/
        return risultatoColpo;
        },

        verificaFinePartita: () => {
            /*logica per verificare se la partita è finita*/
            return isfinish;
        },

        termina:(/*(da rivedere)vincitore creato con l'istamnza di giocatore*/) =>{
        /*logica per terminare la partita e dare la vittoria al giocatore vincente*/
        return vincitore;
        },

        gestisciAbbandono:(/*istanza di giocartore*/) =>{
            /*logica per terminare la partita e dare la vittoria al giocatore che non ha abbandonato */
            return vincitore;
            }
    };
};

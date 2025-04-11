export const generatePartitaComponent = (parentElement) => {
    let username; /* preso da db*/
    let passwordHash/* preso da db*/
    let stato;/*se sta giocando o è libero*/
    

    return {
        registra: () => {
            /*per registrarsi*/
        },

        login: () => {
            /*per loggarsi*/
        },

        logout: () => {
        /*per uscire*/
        },

        sfida: (/*istanza di giocatore*/) => {
        /*logica per lanciare la sfida ad un altro giocatore*/
        },

        abbandonaPartita:(/*istanza di partita*/) =>{
        }
    };
};

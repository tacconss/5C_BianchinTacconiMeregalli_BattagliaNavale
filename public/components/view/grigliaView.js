export const generateGridComponent = (parentElement) => {
    let dimensione;
   // let casella=[/*istanza di coordinate x*/][/*istanza di coordinate y*/]; /*array di coordinate*/
    let tutteNaviAffondate=false; /*se tutte le navi sono affondate è true sennò false*/
    return {
        posizionaNave: (/*istanza di nave, istanza di coordinate*/) => {
            /*logica per posizionare la nave*/
        },

        riceviColpo: (/*istanza di coordinate*/) => {
            return colpo.$risultato;/*returna il risultato del colpo presente nella classe colpo*/
        },

        getCasella: (/*istanza di coordinate*/) => {
            return casella/*returna le  coordinate della casella*/
        },
    };
};

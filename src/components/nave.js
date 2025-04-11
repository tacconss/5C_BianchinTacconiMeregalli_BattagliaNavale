export const generateShipComponent = (parentElement) => {
    let tipo; /* preso da db*/
    let dimensione/* preso da db*/
    let partiColpite;/*se sta giocando o è libero*/
    let posizioe=[/*istanza di coordinate*/]; /*array di coordinate*/

    return {
        colpisci: () => {
            return $boolean;/*se la nave è colpita o meno*/
        },

        isAffondata: () => {
            return $boolean;/*se la nave è affondata o meno*/ 
        }
    };
};

export const generateInviteComponent = (parentElement) => {
    let id;
    let dimensione;
    let partiColpite;
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

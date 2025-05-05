export const generateGridComponent = (parentElement) => {
    let dimensione;
    // let casella=[/*istanza di coordinate x*/][/*istanza di coordinate y*/]; 
    let tutteNaviAffondate = false;

    return {
        creaGriglia: (idCanvas) => {
            const canvas = document.createElement("canvas");
            const dimensioneCella = 40;
            const righe = 10;
            const colonne = 10;
            canvas.width = colonne * dimensioneCella;
            canvas.height = righe * dimensioneCella;
            canvas.style.border = "2px solid black";
            canvas.id = idCanvas;

            const ctx = canvas.getContext("2d");

            for (let i = 0; i <= righe; i++) {
                ctx.moveTo(0, i * dimensioneCella);
                ctx.lineTo(canvas.width, i * dimensioneCella);
            }

            for (let j = 0; j <= colonne; j++) {
                ctx.moveTo(j * dimensioneCella, 0);
                ctx.lineTo(j * dimensioneCella, canvas.height);
            }

            ctx.strokeStyle = "#000";
            ctx.stroke();

            return canvas;
        },

        posizionaNave: () => {
            // logica per posizionare la nave
        },

        riceviColpo: () => {
            return colpo.$risultato;
        },

        getCasella: () => {
            return casella;
        },
    };
};

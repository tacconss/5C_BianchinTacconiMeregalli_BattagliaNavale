export const generateGridComponent = () => {
    const dimensioneCella = 40;
    const righe = 10;
    const colonne = 10;

    const caselle = Array.from({ length: righe }, () =>
        Array.from({ length: colonne }, () => ({ occupata: false }))
    );

    return {
        creaGriglia: (idCanvas) => {
            const canvas = document.createElement("canvas");
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

        posizionaNave: (lunghezza = 3) => {
            const orizzontale = Math.random() < 0.5;
            let x, y;
            let valid = false;
            const coordinate = [];

            while (!valid) {
                x = Math.floor(Math.random() * (orizzontale ? colonne - lunghezza + 1 : colonne));
                y = Math.floor(Math.random() * (orizzontale ? righe : righe - lunghezza + 1));

                valid = true;
                coordinate.length = 0;

                for (let i = 0; i < lunghezza; i++) {
                    const xi = orizzontale ? x + i : x;
                    const yi = orizzontale ? y : y + i;

                    if (caselle[yi][xi].occupata) {
                        valid = false;
                        break;
                    }
                    coordinate.push({ x: xi, y: yi });
                }
            }

            // Marca le celle come occupate
            for (const { x, y } of coordinate) {
                caselle[y][x].occupata = true;
            }

            return coordinate;
        },

        riceviColpo: () => {
            return colpo.$risultato;
        },

        getCasella: () => {
            return caselle;
        },
    };
};

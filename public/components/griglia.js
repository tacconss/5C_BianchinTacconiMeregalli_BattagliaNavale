export const generateGridComponent = () => {
    const dimensioneCella = 40;
    const righe = 10;
    const colonne = 10;

    const caselle = Array.from({ length: righe }, () =>
        Array.from({ length: colonne }, () => ({ occupata: false }))
    );

    return {
        creaGrigliaHTML: (idCanvas, width, height) => {
            return `<canvas id="${idCanvas}" width="${width}" height="${height}" style="border:2px solid black"></canvas>`;
        },

        initializeCanvasGrid: (idCanvas, righe, colonne, cellSize) => {
            const canvas = document.getElementById(idCanvas);
            const ctx = canvas.getContext('2d');
            for (let i = 0; i <= righe; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * cellSize);
                ctx.lineTo(colonne * cellSize, i * cellSize);
                ctx.stroke();
            }
            for (let j = 0; j <= colonne; j++) {
                ctx.beginPath();
                ctx.moveTo(j * cellSize, 0);
                ctx.lineTo(j * cellSize, righe * cellSize);
                ctx.stroke();
            }
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

            coordinate.forEach(({ x, y }) => caselle[y][x].occupata = true);
            return coordinate;
        },

        getCaselle: () => caselle
    };
};
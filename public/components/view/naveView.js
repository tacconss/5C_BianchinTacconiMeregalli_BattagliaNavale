export const drawShip = (ctx, tipo, x, y, cellSize) => {
    const dimensioni = {
        'Portaerei': 5,
        'Corazzata': 4,
        'Incrociatore': 3,
        'Sottomarino': 3,
        'Cacciatorpediniere': 2
    };

    const lunghezza = dimensioni[tipo] * cellSize;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lunghezza, y + cellSize / 2);
    ctx.lineTo(x, y + cellSize);
    ctx.closePath();

    ctx.fillStyle = "#555";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
};
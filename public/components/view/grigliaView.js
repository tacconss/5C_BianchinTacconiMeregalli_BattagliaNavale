// components/view/grigliaView.js

export const grigliaView = {
    creaGriglia(idCanvas, righe = 10, colonne = 10, dimensioneCella = 40) {
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
    }
  };
  
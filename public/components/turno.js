export const generateTurno = (callbackFuoco) => {
    let mioTurno = false;

    const setTurno = (val) => {
        mioTurno = val;
        document.getElementById("turno-info").innerText = mioTurno
            ? "È il tuo turno!"
            : "Turno dell'avversario";
    };

    const isMioTurno = () => mioTurno;

    const gestisciClick = (canvas) => {
        canvas.onclick = (e) => {
            if (!mioTurno) return;

            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / 40);
            const y = Math.floor((e.clientY - rect.top) / 40);

            callbackFuoco(x, y);
            setTurno(false);
        };
    };

    return {
        setTurno,
        isMioTurno,
        abilitaInput: gestisciClick
    };
};

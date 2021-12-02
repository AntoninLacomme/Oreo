import GrilleOreo from "/assets/js/GrilleOreo.js";
import OreoClientIO from "/assets/js/OreoClientIO.js";

window.onload = () => {
    let game = new GrilleOreo ();

    let canvas = generateCanvas (document.querySelector ("body"), game);
    let ctx = canvas.getContext ("2d");

    let connection = new OreoClientIO (game, canvas, ctx);
}

let generateCanvas = (domContainer, grilleOreo) => {
    let canvas = document.createElement ("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.className = "canvas-game";

    window.addEventListener ("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        grilleOreo.drawGrille (canvas.getContext("2d"), canvas.width, canvas.height);
    });

    canvas.addEventListener ("click", (ev) => {
        grilleOreo.clickUser (ev.clientX, ev.clientY);
    });

    domContainer.appendChild (canvas);
    return canvas;
}

let drawTheWorld = (ctx, game) => {
    game.drawUpdatedCellules (ctx);
    requestAnimationFrame (() => {
        drawTheWorld (ctx, game);
    });
}

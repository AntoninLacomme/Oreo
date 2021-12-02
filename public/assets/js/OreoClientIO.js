export default class OreoClientIO {

    constructor (game, canvas, ctx) {
        this.socket = io.connect ();
        this.game = game;

        this.initializeEcouteurSocket (this.socket, canvas, ctx);
    }

    initializeEcouteurSocket (socket, canvas, ctx) {
        this.addEcouteurSocket (socket, 'sendMatrice', (data) => {
            this.receiveMatriceFromServer (data, canvas, ctx);
        })
    }

    addEcouteurSocket (socket, ecouteur, fx) {
        socket.on (ecouteur, (data) => {
            console.log("PING RECU SUR L'ECOUTEUR <" + ecouteur + ">" + " PAR " + socket.id);
            fx (data);
        });
    }

    receiveMatriceFromServer (data, canvas, ctx) {
        this.game.setDataGrille (data);
        this.game.setConnection (this);
        this.game.drawGrille (ctx, canvas.width, canvas.height);
    }

    sendCoords (coords) {
        this.socket.emit ("clickUser", coords)
    }
}

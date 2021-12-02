export default class MicaClientIO {

    constructor () {
        this.socket = io.connect ();
    }

    addEcouteurSocket (socket, ecouteur, fx) {
        socket.on (ecouteur, (data) => {
            console.log("PING RECU SUR L'ECOUTEUR <" + ecouteur + ">" + " PAR " + socket.id);
            fx (data);
        });
    }
}

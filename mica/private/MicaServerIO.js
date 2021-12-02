const MicaServer = require(__dirname + "\\MicaServer.js");

class MicaServerIO extends MicaServer {

    constructor (port = 8001) {
        super (port);

        this.io = require ('socket.io')(this.http);
        // this.setDefaultSocketConnection ();
    }

    setDefaultSocketConnection () {
        this.setSocketConnection ((socket) => {
            socket.id = generateId ();
            console.log("EVENT DEFAULT_CONNECTION, ID >>> " + socket.id);
        });
    }

    setSocketConnection (fx) {
        this.io.on ("connection", fx);
    }

    addEcouteurSocket (socket, ecouteur, fx) {
        socket.on (ecouteur, (data) => {
            console.log("PING RECU SUR L'ECOUTEUR <" + ecouteur + ">" + " PAR " + socket.id);
            fx (data);
        });
    }
}

function generateId () {
    return Date.now().toString(16) + "-" + Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16);
}

module.exports = MicaServerIO;
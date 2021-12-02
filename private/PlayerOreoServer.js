class PlayerOreoServer {

    constructor (socket, value) {
        this.socket = socket;
        this.value = value;
    }

    disconneted () {
        console.log (this.socket.id + " is disconnected !");
    }

    sendDataGrille (matrice) {
        this.socket.emit ('sendMatrice', matrice);
    }
}

module.exports = PlayerOreoServer;
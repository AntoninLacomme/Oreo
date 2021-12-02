const MicaServerIO = require("./mica/private/MicaServerIO.js");
const GameOreoServer = require("./private/GameOreoServer.js");
const PlayerOreoServer = require("./private/PlayerOreoServer.js");

class ServeurOreo extends MicaServerIO {
    constructor () {
        super (8700);
        // définition du path par défaut
        this.setDefaultPathServer (__dirname + "/public");

        this.createGetRountingPath ("/", "index.html",
            // les deux fonctions ne doivent pas nécessairement être déclarées
            (req, res, params) => {
                console.log("Called before Loading index.html");
                console.log(params);
            },
            (req, res, params) => {
                console.log("Called after Loading index.html");
            }
        );

        this.setDefaultSocketConnection ();
        
        this.gameServer = new GameOreoServer (8, 8);

        this.currentTurn = 1;

        this.player1 = null;
        this.player2 = null;
    }

    switchTurn () {
        this.currentTurn *= -1;
    }

    setDefaultSocketConnection () {
        this.setSocketConnection ((socket) => {
            socket.id = generateId ();
            this.initializeEcouteurs (socket);

            let player = this.affectationPlayerToSocket (socket);
            if (player != null) {
                player.sendDataGrille (this.gameServer.generateSimpleMatrice ());
                socket.on ('disconnect', () => {
                    player.disconneted ();
                    player.socket.id = null;
                });
            }
        });
    }

    sendToPlayers (fx) {
        try {
            fx (this.player1)
        } catch (e) {
            console.log(e)
        }
        try {
            fx (this.player2)
        } catch (e) {
            console.log(e)
        }
    }

    initializeEcouteurs (socket) {
        this.addEcouteurSocket (socket, 'clickUser', (data) => {
            let player = this.getPlayerBySocket (socket);
            if (player != null && player.value == this.currentTurn) {
                if (this.gameServer.placeJeton (data.x, data.y, player.value)) {
                    let mat = this.gameServer.generateSimpleMatrice ();
                    this.sendToPlayers ((player) => {
                        player.sendDataGrille (mat);
                    })
                    this.switchTurn ();
                }
            }
        });
    }

    affectationPlayerToSocket (socket) {
        if (this.player1 == null) {
            this.player1 = new PlayerOreoServer (socket, 1);
            console.log("Joueur 1 connecté !")
            return this.player1;
        }

        if (this.player1.socket.id == null) {
            this.player1 = new PlayerOreoServer (socket, 1);
            console.log("Joueur 1 connecté !")
            return this.player1;
        }

        if (this.player2 == null) {
            this.player2 = new PlayerOreoServer (socket, -1);
            console.log("Joueur 2 connecté !")
            return this.player2;
        }

        if (this.player2.socket.id == null) {
            this.player2 = new PlayerOreoServer (socket, 1);
            console.log("Joueur 2 connecté !")
            return this.player2;
        }

        return null;
    }

    getPlayerBySocket (socket) {
        if (socket.id == this.player1.socket.id) {
            return this.player1;
        }
        if (socket.id == this.player2.socket.id) {
            return this.player2;
        }
        return null;
    }
}

function generateId () {
    return Date.now().toString(16) + "-" + Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16);
}

// création d'une instance du serveur
var serveur = new ServeurOreo ();
// lancement du serveur
serveur.launchServer ();
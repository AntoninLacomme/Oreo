// class MicaServer
// permet de lancer un petit serveur web et implémente des web sockets
// dépendances: express, socketio

class MicaServer {

    // le constructeur de la classe initialise express
    // il détermine également le port d'écoute par défaut: 8001
    // ainsi sur le dossier source par défaut, le dossier public de mica
    constructor (port = 8001) {
        this.express = require('express');
        this.app = this.express ();
        this.http = require ('http').Server(this.app);

        this.portServer = port;
        this.defaultPathServer = __dirname + "/public";
    }

    setDefaultPortServer (port) {
        this.portServer = port;
    }

    setDefaultPathServer (path) {
        this.defaultPathServer = path;
    }

    // fonction permettant le lancement du serveur
    // appelle la fonction eventBeforeLaunchServer avant le démarrage
    // puis appelle la fonction eventAfterLaunchServer après
    launchServer () {
        this.eventBeforeLaunchServer ();
        this.http.listen(this.portServer, () => {
            console.log ("Server strating on http://127.0.0.1:" + this.portServer);
        });
        this.eventAfterLaunchServer ();
        this.app.use(this.express.static(this.defaultPathServer));
    }

    // fonction appelée avant le lancement du serveur par launchServer
    // à redéfinir
    eventBeforeLaunchServer () {

    }

    // fonction appelée après le lancement du serveur par launchServer
    // à redéfinir
    eventAfterLaunchServer () {

    }

    // fonction permettant de définir une page web par requête HTTP GET
    // webPath -> le path dans l'URL du navigateur
    // serverPath -> le path dans l'arborescence de fichier du serveur à partir de defaultPathServer
    // evBeforeLoading -> par défaut ne fait rien, si redéfinie, est appelée avant l'envoi du fichier au client
    // evAfterLoading -> par défaut ne fait rien, si redéfinie, est appelée après l'envoi du fichier au client
    createGetRountingPath (webPath, serverPath, evBeforeLoading = (req, res, params) => { }, evAfterLoading = (req, res, params) => { }) {
        this.app.get (webPath, (req, res) => {
            let params = parseURLtoArray (req.url);
            evBeforeLoading (req, res, params);
            res.sendFile (this.defaultPathServer + "/" + serverPath);
            evAfterLoading (res, res, params);
        });
    }

    // fonction permettant de définir une page web par requête HTTP POST
    // webPath -> le path dans l'URL du navigateur
    // serverPath -> le path dans l'arborescence de fichier du serveur à partir de defaultPathServer
    // evBeforeLoading -> par défaut ne fait rien, si redéfinie, est appelée avant l'envoi du fichier au client
    // evAfterLoading -> par défaut ne fait rien, si redéfinie, est appelée après l'envoi du fichier au client
    createPostRountingPath (webPath, serverPath, evBeforeLoading = (req, res, params) => { }, evAfterLoading = (req, res, params) => { }) {
        this.app.post (webPath, (req, res) => {
            let params = parseURLtoArray (req.url);
            evBeforeLoading (req, res, params);
            res.sendFile (__dirname + this.defaultPathServer + "/" + serverPath);
            evAfterLoading (res, res, params);
        });
    }
}

function parseURLtoArray (url) {
    let params = { };
    url.slice(url.indexOf("?") + 1).split ("&").forEach ((tuple) => {
        params[tuple.slice(0, tuple.indexOf("="))] = tuple.slice(tuple.indexOf("=") + 1);
    })
    return params;
}

module.exports = MicaServer;
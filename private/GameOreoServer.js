
const CelluleOreoServer = require("./CelluleOreoServer.js");

class GameOreoServer {

    constructor (line, column) {
        if (line % 2 == 1 || column % 2 == 1) {
            console.err ("les dimensions de la grille doivent être paires !")
            return;
        }
        this.nbLines = line     // Y
        this.nbColumns = column // X

        this.matrice = this.generateEmptyMatrice (column, line);
        this.fillBasicGrille ();

        this.currentPlayer = {
            value: -1
        }

    }

    getMatriceSimplified () {
        let matrice = [];
        for (let i=0; i<Y; i++) {
            let line = [];
            for (let j=0; j<X; j++) {
                line.push (this.matrice[i][j].getValue ());
            }
            matrice.push (line);
        }
        return matrice;
    }

    generateEmptyMatrice (X, Y) {
        let matrice = [];
        for (let i=0; i<Y; i++) {
            let line = [];
            for (let j=0; j<X; j++) {
                line.push (new CelluleOreoServer (j, i));
            }
            matrice.push (line);
        }
        return matrice;
    }

    generateSimpleMatrice () {
        let matrice = [];
        for (let i=0; i<this.nbLines; i++) {
            let line = [];
            for (let j=0; j<this.nbColumns; j++) {
                line.push(this.matrice[i][j].getValue ());
            }
            matrice.push (line);
        }
        return matrice;
    }

    fillBasicGrille () {
        let v = -1;
        for (let i=0; i<=1; i++) {
            for (let j=0; j<=1; j++) {
                v = -1;
                if (i == j) {
                    v *= -1;
                }
                this.matrice[this.nbLines / 2 - i][this.nbColumns / 2 - j].setValue (v);
            }
        }
    }

    currentVoisinsSameColor (x, y, value) {
        for (let i=-1; i<2; i++) {
            for (let j=-1; j<2; j++) {
                if (this.coordsAreInDataGrille (x + i, y + j)) {
                    if (!(i==0 && j==0)) {
                        if (value == (this.matrice[y+i][x+j].getValue() * -1)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    placeJeton (x, y, value) {
        if (this.matrice[y][x].getValue () == 0) {
            this.matrice[y][x].setValue (value);
            let bMat = this.generateSimpleMatrice ();
            for (let i=-1; i<2; i++) {
                for (let j=-1; j<2; j++) {
                    if (this.coordsAreInDataGrille (x + i, y + j)) {
                        if (!(i==0 && j==0)) {
                            this.switchDirection (this.matrice[y + j][x + i], value, i, j);
                        } 
                    }
                }
            }
            let fMat = this.generateSimpleMatrice ();
            if (!this.checkChangement (bMat, fMat)) {
                this.matrice[y][x].setValue (0);
                return false;
            }
            return true;
        }
        return false;
    }

    checkChangement (oldMat, newMat) {
        for (let i=0; i<this.nbLines; i++) {
            for (let j=0; j<this.nbColumns; j++) {
                if (oldMat[i][j] != newMat[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    coordsAreInDataGrille (x, y) {
        if (y < 0 || y >= this.nbLines) {
            return false;
        }
        if (x < 0 || x >= this.nbColumns) {
            return false;
        }
        return true;
    }

    switchDirection (cellule, value, x, y) {
        if (cellule.getValue () == 0) {
            return false;
        }
        if (cellule.getValue () == value) {
            return true;
        }
        if (!this.coordsAreInDataGrille (cellule.posX + x, cellule.posY + y)) {
            return false;
        }
        
        if (this.switchDirection (this.matrice[cellule.posY + y][cellule.posX + x], value, x, y)) {
            cellule.reverseValue ();
            return true, cellule;
        }
        return false;
    }

    switchUser () {
        this.currentPlayer.value *= -1;
    }

}

module.exports = GameOreoServer;
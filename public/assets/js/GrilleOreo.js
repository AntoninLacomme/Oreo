import CelluleOreo from "/assets/js/CelluleOreo.js";

export default class GrilleOreo {

    constructor () {
        this.nbLines = 0;
        this.nbColumns = 0;

        this.sizeCellule = 50;
        this.marge = 10;
        this.leftMargin = 10;

        this.matrice = [];
        this.connection = null;
    }

    setConnection (connect) {
        this.connection = connect;
    }

    setDataGrille (mat) {
        this.nbLines = mat.length;
        this.nbColumns = mat[0].length;

        this.matrice = [];
        for (let i=0; i<mat.length; i++) {
            let line = [];
            for (let j=0; j<mat[i].length; j++) {
                line.push(new CelluleOreo(j, i, mat[i][j]));
            }
            this.matrice.push (line);
        }
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

    placeJeton (x, y, value) {
        if (this.matrice[y][x].getValue () == 0) {
            this.matrice[y][x].setValue (value);
            for (let i=-1; i<2; i++) {
                for (let j=-1; j<2; j++) {
                    if (this.coordsAreInDataGrille (x + i, y + j)) {
                        if (!(i==0 && j==0)) {
                            this.switchDirection (this.matrice[y + j][x + i], value, i, j);
                        } 
                    }
                }
            }
        }
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
            return true;
        }
        return false;
    }

    switchUser () {
        this.currentPlayer.value *= -1;
    }

    clickUser (x, y) {
        let coords = this.convertToCoords (x, y);
        if (coords == undefined) {
            return;
        }
        this.connection.sendCoords (coords);

        //this.placeJeton (coords.x, coords.y, this.currentPlayer.value);
        //this.switchUser ();
    }

    convertToCoords (x, y) {
        if (x <= this.leftMargin) {
            return undefined;
        }
        if (y <= this.marge) {
            return undefined;
        }
        if (x >= (this.leftMargin + this.nbColumns * this.sizeCellule)) {
            return undefined;
        }
        if (y >= (this.marge + this.nbLines * this.sizeCellule)) {
            return undefined;
        }
        return {
            "x": ((x - this.leftMargin) / this.sizeCellule) | 0,
            "y": ((y - this.marge) / this.sizeCellule) | 0
        };
    }

    drawGrille (ctx, dimensionCanvasX, dimensionCanvasY) {
        this.sizeCellule = Math.min (((dimensionCanvasX - 2 * this.marge) / this.nbColumns) | 0, ((dimensionCanvasY - 2 * this.marge) / this.nbLines) | 0);
        CelluleOreo.radius = this.sizeCellule * 0.4;

        this.leftMargin = (dimensionCanvasX - this.sizeCellule * this.nbColumns) / 2;
        
        ctx.save ();
        this.matrice.forEach ((line) => {
            line.forEach ((cell) => {
                cell.drawCelluleOreo (ctx, this.sizeCellule, this.leftMargin, this.marge);
            });
        });
        ctx.restore ();
    }

    drawUpdatedCellules (ctx) {
        this.matrice.forEach ((line) => {
            line.forEach ((cell) => {
                cell.drawUpdatedCelluleOreo (ctx, this.sizeCellule, this.leftMargin, this.marge);
            });
        });
    }
}
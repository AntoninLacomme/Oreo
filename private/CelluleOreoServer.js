class CelluleOreoServer {

    constructor (x, y) {
        this.posX = x;
        this.posY = y;

        this.value = 0;
    }

    getValue () {
        return this.value;
    }

    setValue (value) {
        this.value = value;
        this.updated = !this.updated;
    }

    reverseValue () {
        this.value *= -1;
        this.updated = !this.updated;
    }

}

module.exports = CelluleOreoServer;
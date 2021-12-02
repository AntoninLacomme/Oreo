var var_circle = 2 * Math.PI;

export default class CelluleOreo {

    static radius = 20;

    constructor (x, y, value) {
        this.posX = x;
        this.posY = y;

        this.value = value;
        this.updated = false;
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

    static setRadius (radius) {
        CelluleOreo.radius = radius;
    }

    drawCelluleOreo (ctx, sizeCellule, margeLeft, marge) {
        ctx.save ();
        ctx.translate (margeLeft + this.posX * sizeCellule, marge + this.posY * sizeCellule);
        ctx.clearRect (0, 0, sizeCellule, sizeCellule);
        ctx.strokeRect (0, 0, sizeCellule, sizeCellule);
        
        ctx.beginPath ();
        ctx.arc(sizeCellule / 2, sizeCellule / 2, CelluleOreo.radius, sizeCellule, 0, var_circle);
        ctx.closePath ();

        switch (this.value) {
            case 0:
                ctx.fillStyle = "rgb(120,120,120)";
                break;
            case 1:
                ctx.fillStyle = "ivory";
                break;
            case -1:
                ctx.fillStyle = "black";
                break;
            default:
                ctx.fillStyle = "rgb(120,120,120)";
        }

        ctx.fill ();
        ctx.restore ();
    }

    drawUpdatedCelluleOreo (ctx, sizeCellule, margeLeft, marge) {
        if (this.updated) {
            this.drawCelluleOreo (ctx, sizeCellule, margeLeft, marge);
            this.updated = !this.updated;
        }
    }
}
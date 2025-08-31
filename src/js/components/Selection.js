export class Selection {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.isActive = false;
        this.objects = [];
    }

    setPosition(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.x = x;
        this.y = y;
        for (const object of this.objects) {
            object.setPosition(object.x + dx, object.y + dy);
        }
    }

    containsPoint(x, y) {
        let inXRange = false;
        let inYRange = false;
    
        if (x >= Math.min(this.x, this.x + this.w) && x <= Math.max(this.x, this.x + this.w)) {
            inXRange = true;
        }
        if (y >= Math.min(this.y, this.y + this.h) && y <= Math.max(this.y, this.y + this.h)) {
            inYRange = true;
        }

        if (inXRange && inYRange) {
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (this.objects.length != 0 || this.isActive) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = "rgb(255 255 255 / 10%)";
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.rect(0, 0, this.w, this.h);
            ctx.stroke();
            ctx.restore();
        }
    }
}
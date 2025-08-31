class Wire extends Element {
    constructor(x1, y1, x2, y2) {
        super(x1, y1, 'wire');
        this.link1.setPosition(x1, y1);
        this.link2.setPosition(x2, y2);
    }

    draw(ctx, showData) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, 0);
        ctx.fillStyle = light;
        ctx.strokeStyle = light;
        ctx.font = "12px serif";
        ctx.beginPath();
        ctx.moveTo(this.link1.x - this.x + this.width/2, this.link1.y - this.y);
        ctx.lineTo(this.link2.x - this.x + this.width/2, this.link2.y - this.y);
        ctx.stroke();
        ctx.restore();
    }
}
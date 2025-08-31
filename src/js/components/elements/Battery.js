class Battery extends Element {
    constructor(x, y, emf) {
        super(x, y, 'battery');
        this.emf = emf;
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
        ctx.moveTo(0, 0);
        ctx.lineTo(0.5 * this.width - 5, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width + 5, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width - 5, -20);
        ctx.lineTo(0.5 * this.width - 5, 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width + 5, -10);
        ctx.lineTo(0.5 * this.width + 5, 10);
        ctx.stroke();
        if (showData) {
            ctx.fillText(formatValue(this.emf, "V", 1), this.width/2, 20);
        }
        ctx.restore();
    }
}
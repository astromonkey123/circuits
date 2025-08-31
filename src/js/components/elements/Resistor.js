class Resistor extends Element {
    constructor(x, y, resistance) {
        super(x, y, 'resistor');
        this.resistance = resistance;
        this.current = 0;
    }

    draw(ctx, showData) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, 0);
        ctx.fillStyle = light;
        ctx.strokeStyle = light;
        ctx.font = "12px serif";
        const spacing = this.width/11;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1.5 * spacing, 0);
        for (let i = 2; i <= 9; i++) {
            if (i % 2 == 0) {
                ctx.lineTo(i * spacing, 10);
            } else {
                ctx.lineTo(i * spacing, -10);
            }
        }
        ctx.lineTo(9.5 * spacing, 0);
        ctx.lineTo(11 * spacing, 0);
        ctx.stroke();
        if (showData) {
            ctx.fillText(formatValue(this.current * this.resistance, "V", 1), this.width/2, 20);
            ctx.fillText(formatValue(this.resistance, "Ω", 1), this.width/2, 32);
        }
        ctx.restore();
    }
}
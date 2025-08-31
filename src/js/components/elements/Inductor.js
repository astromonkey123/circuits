class Inductor extends Element {
    constructor(x, y, inductance) {
        super(x, y, 'inductor');
        this.inductance = inductance;
        this.current_ddt = 0;
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
        function x_parametric(t) { return -5 * (Math.cos(4 * t) - t * Math.sqrt(3) - 1) }
        function y_parametric(t) { return 10 * Math.sin(4 * t) }
        const x_jump = x_parametric(Math.PI/2);
        const remainder = (this.width - 3*spacing) % (x_jump);
        const iters = ((this.width - 3*spacing) - remainder) / x_jump;
        for (let t = 0; t <= iters * (Math.PI/2); t += Math.PI/32) {
            ctx.lineTo(1.5 * spacing + x_parametric(t), y_parametric(t));
        }
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        if (showData) {
            ctx.fillText(formatValue(this.current_ddt * this.inductance, "V", 1), this.width/2, 20);
            ctx.fillText(formatValue(this.inductance, "H", 1), this.width/2, 32);
        }
        ctx.restore();
    }
}
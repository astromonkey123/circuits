import { Element } from "../Element.js";
import { rainbow, highlight, light, dark } from "../../utils/colors.js";
import { formatValue } from "../../utils/prefixes.js";

export class Resistor extends Element {
    constructor(x, y, resistance) {
        super(x, y, 'resistor');
        this.resistance = resistance;
    }

    update(last_current, current) {
        this.physics.current = current;
        this.physics.current_idt += current * this.physics.dt;
        this.physics.current_ddt = (current - last_current) / this.physics.dt;
        this.physics.voltage = this.physics.current * this.resistance;
        this.physics.stepTime();
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
            ctx.fillText(formatValue(this.physics.voltage, "V", 1), this.width/2, 20);
            ctx.fillText(formatValue(this.resistance, "Ω", 1), this.width/2, 32);
        }
        ctx.restore();
    }
}
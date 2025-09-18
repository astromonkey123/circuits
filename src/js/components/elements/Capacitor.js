import { Element } from "../Element.js";
import { rainbow, highlight, light, dark } from "../../utils/colors.js";
import { formatValue } from "../../utils/prefixes.js";

export class Capacitor extends Element {
    constructor(x, y, capacitance, initial_charge) {
        super(x, y, 'capacitor');
        this.capacitance = capacitance;
        this.physics.current_idt = initial_charge;
    }

    update(last_current, current) {
        this.physics.current = current;
        this.physics.current_idt += current * this.physics.dt;
        this.physics.current_ddt = (current - last_current) / this.physics.dt;
        this.physics.voltage = this.physics.current_idt / this.capacitance;
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
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0.5 * this.width - 5, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width + 5, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width - 5, -10);
        ctx.lineTo(0.5 * this.width - 5, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5 * this.width + 5, -10);
        ctx.lineTo(0.5 * this.width + 5, 10);
        ctx.stroke();
        if (showData) {
            ctx.fillText(formatValue(this.physics.voltage, "V", 1), this.width/2, 20);
            ctx.fillText(formatValue(this.capacitance, "F", 1), this.width/2, 32);
            ctx.fillText(formatValue(this.physics.current_idt, "C", 1), this.width/2, 44);
        }
        ctx.restore();
    }
}
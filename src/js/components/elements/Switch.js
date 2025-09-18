import { Element } from "../Element.js";
import { rainbow, highlight, light, dark } from "../../utils/colors.js";
import { formatValue } from "../../utils/prefixes.js";

export class Switch extends Element {
    constructor(x, y) {
        super(x, y, 'switch');
        this.state = false;
    }

    update(last_current, current) {
        this.physics.current = current;
        this.physics.current_idt += current * this.physics.dt;
        this.physics.current_ddt = (current - last_current) / this.physics.dt;
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
        ctx.lineTo((1/4) * this.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.width, 0);
        ctx.lineTo((3/4) * this.width, 0);
        ctx.stroke();
        if (this.state) {
            ctx.beginPath();
            ctx.moveTo((3/4) * this.width, 0);
            ctx.lineTo((1/4) * this.width, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc((1/4) * this.width, 0, 4, 0, Math.PI * 2)
            ctx.fill();
        } else {
            const switchX = ((3/4) * this.width) - ((2/4) * this.width * Math.cos(-0.5));
            const switchY = (2/4) * this.width * Math.sin(-0.5);
            ctx.beginPath();
            ctx.moveTo((3/4) * this.width, 0);
            ctx.lineTo(switchX, switchY);
            ctx.stroke();
            ctx.fillStyle = highlight;
            ctx.strokeStyle = highlight;
            ctx.beginPath();
            ctx.arc(switchX, switchY, 4, 0, Math.PI * 2)
            ctx.fill();
            ctx.beginPath();
            ctx.arc((1/4) * this.width, 0, 4, 0, Math.PI * 2)
            ctx.fill();
        }
        ctx.restore();
    }
}
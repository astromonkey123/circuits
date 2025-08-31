import { Link } from './Link.js';
import { formatValue } from '../utils/prefixes.js';
import { rainbow, highlight, light, dark } from '../utils/colors.js';

class Element {
    constructor(x, y, type) {
        // Physics properties
        this.current = 0;
        this.current_idt = 0;
        this.current_ddt = 0;
        this.emf = 0;

        // Sim properties
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = 0;
        this.width = 100;
        this.link1 = new Link(x - (Math.cos(this.rotation) * this.width/2), y - (Math.sin(this.rotation) * this.width/2), this)
        this.link2 = new Link(x + (Math.cos(this.rotation) * this.width/2), y + (Math.sin(this.rotation) * this.width/2), this)
        this.link1.sibling = this.link2;
        this.link2.sibling = this.link1;
        this.circuits = [];
    }

    containsPoint(x, y) {
        return Math.hypot(x - this.x, y - this.y) < 20;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.link1.x = this.x - (Math.cos(this.rotation) * this.width/2);
        this.link1.y = this.y - (Math.sin(this.rotation) * this.width/2);
        this.link2.x = this.x + (Math.cos(this.rotation) * this.width/2);
        this.link2.y = this.y + (Math.sin(this.rotation) * this.width/2);
    }

    setRotation(rotation) {
        if (this.type == 'wire') return;
        this.rotation = rotation;
        this.setPosition(this.x, this.y);
    }

    draw(ctx, showData) {
        throw new Error("Abstract method 'draw()' must be implemented by derived classes.");
    }
}

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

class Capacitor extends Element {
    constructor(x, y, capacitance, initial_charge) {
        super(x, y, 'capacitor');
        this.capacitance = capacitance;
        this.current_idt = initial_charge;
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
            ctx.fillText(formatValue(this.current_idt / this.capacitance, "V", 1), this.width/2, 20);
            ctx.fillText(formatValue(this.capacitance, "F", 1), this.width/2, 32);
            ctx.fillText(formatValue(this.current_idt, "C", 1), this.width/2, 44);
        }
        ctx.restore();
    }
}

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

class Switch extends Element {
    constructor(x, y) {
        super(x, y, 'switch');
        this.state = false;
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

class nMOSFET extends Element {
    constructor(x, y, threshold) {
        super(x, y, 'nmosfet');
        this.gate = new Link(x, y - 35, this, "gate");
        this.threshold = threshold;
        this.gate_voltage = 0;
        this.source_voltage = 0;
        this.drain_voltage = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.link1.x = this.x - (Math.cos(this.rotation) * this.width/2);
        this.link1.y = this.y - (Math.sin(this.rotation) * this.width/2);
        this.link2.x = this.x + (Math.cos(this.rotation) * this.width/2);
        this.link2.y = this.y + (Math.sin(this.rotation) * this.width/2);
        this.gate.x = this.x + (Math.sin(this.rotation) * 35);
        this.gate.y = this.y - (Math.cos(this.rotation) * 35);
    }

    setRotation(rotation) {
        if (this.type == 'wire') return;
        this.rotation = rotation;
        this.setPosition(this.x, this.y);
    }

    draw(ctx, showData) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, 0);
        ctx.fillStyle = light;
        ctx.strokeStyle = light;
        ctx.font = "12px serif";
        // Base
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo((1/2) * this.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((3/4) * this.width, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        // Spikes
        ctx.beginPath();
        ctx.moveTo((1/4) * this.width, 0);
        ctx.lineTo((1/4) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, 0);
        ctx.lineTo((1/2) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((3/4) * this.width, 0);
        ctx.lineTo((3/4) * this.width, -15);
        ctx.stroke();
        // Arrow
        ctx.beginPath();
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, -11);
        ctx.lineTo((1/2) * this.width + 7, -4);
        ctx.lineTo((1/2) * this.width - 7, -4);
        ctx.lineTo((1/2) * this.width, -11);
        ctx.fill();
        // Caps
        ctx.beginPath();
        ctx.moveTo((3/16) * this.width, -15);
        ctx.lineTo((5/16) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((7/16) * this.width, -15);
        ctx.lineTo((9/16) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((11/16) * this.width, -15);
        ctx.lineTo((13/16) * this.width, -15);
        ctx.stroke();
        // Plate
        ctx.beginPath();
        ctx.moveTo((1/4) * this.width, -20);
        ctx.lineTo((3/4) * this.width, -20);
        ctx.stroke();
        // Gate
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, -20);
        ctx.lineTo((1/2) * this.width, -35);
        ctx.stroke();
        ctx.restore();

        this.gate.draw(ctx);
    }
}

class pMOSFET extends Element {
    constructor(x, y, threshold) {
        super(x, y, 'nmosfet');
        this.gate = new Link(x, y - 35, this, "gate");
        this.threshold = threshold;
        this.gate_voltage = 0;
        this.source_voltage = 0;
        this.drain_voltage = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.link1.x = this.x - (Math.cos(this.rotation) * this.width/2);
        this.link1.y = this.y - (Math.sin(this.rotation) * this.width/2);
        this.link2.x = this.x + (Math.cos(this.rotation) * this.width/2);
        this.link2.y = this.y + (Math.sin(this.rotation) * this.width/2);
        this.gate.x = this.x + (Math.sin(this.rotation) * 35);
        this.gate.y = this.y - (Math.cos(this.rotation) * 35);
    }

    setRotation(rotation) {
        if (this.type == 'wire') return;
        this.rotation = rotation;
        this.setPosition(this.x, this.y);
    }

    draw(ctx, showData) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, 0);
        ctx.fillStyle = light;
        ctx.strokeStyle = light;
        ctx.font = "12px serif";
        // Base
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo((1/4) * this.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
        // Spikes
        ctx.beginPath();
        ctx.moveTo((1/4) * this.width, 0);
        ctx.lineTo((1/4) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, 0);
        ctx.lineTo((1/2) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((3/4) * this.width, 0);
        ctx.lineTo((3/4) * this.width, -15);
        ctx.stroke();
        // Arrow
        ctx.beginPath();
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, -4);
        ctx.lineTo((1/2) * this.width + 7, -11);
        ctx.lineTo((1/2) * this.width - 7, -11);
        ctx.lineTo((1/2) * this.width, -4);
        ctx.fill();
        // Caps
        ctx.beginPath();
        ctx.moveTo((3/16) * this.width, -15);
        ctx.lineTo((5/16) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((7/16) * this.width, -15);
        ctx.lineTo((9/16) * this.width, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((11/16) * this.width, -15);
        ctx.lineTo((13/16) * this.width, -15);
        ctx.stroke();
        // Plate
        ctx.beginPath();
        ctx.moveTo((1/4) * this.width, -20);
        ctx.lineTo((3/4) * this.width, -20);
        ctx.stroke();
        // Gate
        ctx.beginPath();
        ctx.moveTo((1/2) * this.width, -20);
        ctx.lineTo((1/2) * this.width, -35);
        ctx.stroke();
        ctx.restore();

        this.gate.draw(ctx);
    }
}

export { Battery, Wire, Resistor, Capacitor, Inductor, Switch, nMOSFET, pMOSFET };
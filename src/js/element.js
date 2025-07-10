import { objects, connections } from './canvas.js';
import { Connection } from './connection.js';

export class Element {
    constructor(x, y, type, emf, current, charge) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.emf = emf;
        this.current = current;
        this.charge = charge;
        this.width = 100;
        if (type == 'battery') {
            this.priority = 1;
            this.connection1 = new Connection(x, y, this, 10)
            this.connection2 = new Connection(x + this.width, y, this, -10)
        } else if (type == 'wire') {
            this.priority = 2;
            this.connection1 = new Connection(x, y, this, 0)
            this.connection2 = new Connection(x + this.width, y, this, 0)
        } else if (type == 'resistor') {
            this.priority = 3;
            this.connection1 = new Connection(x, y, this, 0)
            this.connection2 = new Connection(x + this.width, y, this, 0)
        }  else if (type == 'capacitor') {
            this.priority = 4;
            this.connection1 = new Connection(x, y, this, 0)
            this.connection2 = new Connection(x + this.width, y, this, 0)
        }  else if (type == 'inductor') {
            this.priority = 5;
            this.connection1 = new Connection(x, y, this, 0)
            this.connection2 = new Connection(x + this.width, y, this, 0)
        }
        this.connection1.sibling = this.connection2;
        this.connection2.sibling = this.connection1;
        objects.push(this);
    }

    contains(x, y) {
        const in_x_bounds = (x > this.x) && (x < this.x + this.width);
        const in_y_bounds = (y > this.y - 10) && (y < this.y + 10);
        return in_x_bounds && in_y_bounds;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.connection1.x = this.x;
        this.connection1.y = this.y;
        this.connection2.x = this.x + this.width;
        this.connection2.y = this.y;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        if (this.type == 'wire') {
            ctx.beginPath();
            ctx.moveTo(this.connection1.x - this.x, this.connection1.y - this.y);
            ctx.lineTo(this.connection2.x - this.x, this.connection2.y - this.y);
            ctx.stroke();
        } else if (this.type == 'battery') {
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
        } else if (this.type == 'resistor') {
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
        } else if (this.type == 'capacitor') {
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
        } else if (this.type == 'inductor') {
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
        }
        ctx.restore();
    }
}

import { objects, connections } from './canvas.js';
import { Element } from './element.js';

export class Connection {
    constructor(x, y, parent, voltage) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.voltage = voltage;
        this.sibling;
        this.links = [];
        this.radius = 7;
        connections.push(this);
    }

    contains(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.radius;
    }

    move(x, y) {
        if (this.parent.type == 'wire') {
            this.x = x;
            this.y = y;
        }
    }

    checkLinks() {
        this.links = [];
        for (let connection of connections) {
            if (connection == this) continue;
            if (Math.hypot(connection.x - this.x, connection.y - this.y) < connection.radius + this.radius) {
                this.links.push(connection);
            }
        }
    }

    findVoltage() {
        // If it's a battery, nothing should change its voltage
        if (this.parent.type == 'battery') {
        // If it's a wire, the voltage should be the same at either end
        } else if (this.parent.type == 'wire') {
            if (this.links.length === 0 && this.sibling.links.length === 0) {
                this.voltage = 0;
            }
            for (let external_connection of this.links) {
                if (external_connection.voltage !== 0) this.voltage = external_connection.voltage;
            }
            this.sibling.voltage = this.voltage;
        // If it's a resistor, the voltage at either end should be equal to what it's connected to.
        } else if (this.parent.type == 'resistor') {
            this.voltage = 0;
            for (let external_connection of this.links) {
                if (external_connection.voltage !== 0) this.voltage = external_connection.voltage;
            }
        }
    }

    draw(ctx) {
        if (this.voltage > 0) {
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
        } else if (this.voltage < 0) {
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'blue';
        } else {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
    }
}

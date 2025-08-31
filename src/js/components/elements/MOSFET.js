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
export class Element {
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
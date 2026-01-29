import { rainbow, highlight, light, dark } from '../utils/colors.js';

class Node {
    constructor(x, y, parent, id) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.id = id;
        this.radius = 6;
        this.nodes = [];
    }

    containsPoint(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.radius * 2;
    }

    setPosition(x, y) {
        if (this.parent.type == 'wire') {
            this.x = x;
            this.y = y;
        }
    }

    findNodes(simContainer) {
        this.nodes = [];
        for (let node of simContainer.nodes) {
            if (node == this) continue;
            if (Math.hypot(node.x - this.x, node.y - this.y) < node.radius + this.radius) {
                this.nodes.push(node);
            }
        }
    }

    getSibling() {
        for (const node of this.parent.nodes) {
            if (node.id == -this.id) {
                return node;
            }
        }
        return null;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.nodes.length > 0) {
            ctx.fillStyle = light;
            ctx.strokeStyle = light;
        } else {
            ctx.fillStyle = highlight;
            ctx.strokeStyle = highlight;
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
    }
}

export { Node };
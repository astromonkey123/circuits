export class Container {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = canvas.getContext('2d');
        this.circuits = [];
        this.objects = [];
        this.connections = [];
        this.editing = null;
        this.dragging = null;
        this.offsets = {x: 0, y: 0, rotation: 0};
    }
}
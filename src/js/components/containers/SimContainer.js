export class SimContainer extends Container {
    constructor(id) {
        super(id);
        this.circuits = [];
        this.elements = [];
        this.links = [];
        this.editing = null;
        this.dragging = null;
        this.offsets = {x: 0, y: 0, rotation: 0};
        this.showData = true;
        this.selection = new Selection();
        this.isSimulating = true;
    }

    updateLinks() {
        this.links = [];
        for (const element of this.elements) {
            this.links.push(element.link1);
            this.links.push(element.link2);
            if (element.gate != null) {
                this.links.push(element.gate);
            }
        }
    }

    resetFields() {
        this.circuits = [];
        this.elements = [];
        this.links = [];
        this.editing = null;
        this.dragging = null;
        this.selection = new Selection();
    }
}
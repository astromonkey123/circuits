import { Selection } from "./Selection.js";

class Container {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
    }
}

class DataContainer {
    constructor() {
        this.times = [0];
        this.currents = [0];
    }
}

class GraphContainer extends Container {
    constructor(id) {
        super(id);
        this.height_scale = 0;
        this.height_increment = 2;
        this.num_times = 1000;
        this.spacing = this.canvas.width / this.num_times;
        this.display_current = "";
    }

    updateScale(limit) {
        if (limit === 0) {
            this.height_scale = 1;
        } else if (limit < this.height_increment) {
            this.height_scale = 1 / ( Math.pow(2, Math.ceil( Math.log2( limit ) ) ) );
        } else {
            this.height_scale = 1 / ( Math.ceil( limit / this.height_increment ) * this.height_increment );
        }
    }
}

class PhysicsContainer {
    constructor(current = 0, current_idt = 0, current_ddt = 0, time = 0, voltage = 0) {
        this.current = current;
        this.current_idt = current_idt;
        this.current_ddt = current_ddt;
        this.voltage = voltage;
        this.time = time;
    }
}

class SimContainer extends Container {
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

export { Container, DataContainer, GraphContainer, PhysicsContainer, SimContainer }
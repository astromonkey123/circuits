import { isEqual } from '../utils/sets.js';

class Circuit {
    constructor(nodes) {
        this.nodes = nodes;
        this.elements = [];
        for (const node of nodes) {
            this.elements.push(node.parent);
        }
        this.current = 0;
        this.current_idt = 0;
        this.current_ddt = 0;
        this.elapsed_time = 0;
        this.data = new CircuitData();
    }

    hasSameNodes(circuit) {
        return isEqual(this.nodes, circuit.nodes);
    }

    hasSameElements(circuit) {
        return isEqual(this.elements, circuit.elements);
    }
}

class CircuitData {
    constructor() {
        this.times = [0];
        this.currents = [0];
    }
}

export { Circuit, CircuitData };
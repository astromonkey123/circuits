import { PhysicsContainer } from "./Container.js";

export class Circuit {
    constructor(elements, directions) {
        // Physics properties
        this.physics = new PhysicsContainer();

        // Sim properties
        this.elements = elements;
        this.directions = directions;
        this.data = new CircuitData();
    }
}
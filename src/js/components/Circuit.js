import { DataContainer, PhysicsContainer } from "./Container.js";

export class Circuit {
    constructor(links) {
        // Physics properties
        this.physics = new PhysicsContainer();

        // Sim properties
        this.links = links;
        // this.data = new DataContainer();
    }
}
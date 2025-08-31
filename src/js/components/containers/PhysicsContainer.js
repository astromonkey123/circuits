class PhysicsContainer {
    constructor(current = 0, current_idt = 0, current_ddt = 0, time = 0, voltage = 0) {
        this.current = current;
        this.current_idt = current_idt;
        this.current_ddt = current_ddt;
        this.voltage = voltage;
        this.time = time;
    }
}
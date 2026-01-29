import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';
import { Node } from '../components/Node.js';

import { simContainer, graphContainer, dt } from '../app.js';

function simulatePeriodic() {
    const all_circuits = findCircuits(simContainer.elements); // All existing circuits
    const circuits = checkCircuits(simContainer.circuits, all_circuits); // Filtered for duplicates, priority to preexisting
    simContainer.circuits = circuits;
    console.log(simContainer.circuits);
    
    updateMembership(); // Update the list of circuits for each element

    for (const circuit of simContainer.circuits) {
        const last_current = circuit.current;
    
        const current = findCurrent(circuit); // Find the current for the circuit

        // Update current
        circuit.current = current;
        circuit.current_idt += current * dt;
        circuit.current_ddt = (current - last_current) / dt;

        // Update the circuit data for graphing
        circuit.elapsed_time = (Math.round(circuit.elapsed_time / dt) * dt) + dt;
        circuit.data.currents.push(circuit.current);
        circuit.data.times.push(circuit.elapsed_time);
    }

    resetElements(simContainer.elements);
    updateElements(simContainer.circuits);
}

function findCircuits(elements) {
    const circuits = []
    for (const element of elements) {
        const loop = findLoop([element.node0], 0);
        if (loop == null) continue;
        circuits.push(new Circuit(loop));
    }
    return circuits;
}

function findLoop(loop, iters) {
    const last_node = loop[loop.length-1];
    const next_node = last_node.nodes[0];
    // Base cases
    if (iters > 100) return null; // To prevent it from going insane
    if (next_node == null) return null; // If there's no next node
    for (const node of last_node.nodes) {
        if (node.parent.nodes.includes(loop[0])) return loop; // If the loop is complete
    }
    // Recursion
    loop.push(next_node.getSibling());
    return findLoop(loop, iters+1);
}

function checkCircuits(existing_circuits, all_circuits) {
    const circuits = [];

    // Add existing circuits (that still exist) to the list
    for (const existing_circuit of existing_circuits) {
        let found = false;
        for (const new_circuit of all_circuits) {
            if (existing_circuit.hasSameElements(new_circuit)) {
                found = true;
                break;
            }
        }
        if (found) circuits.push(existing_circuit);
    }

    // Add unique new circuits to the list
    for (const new_circuit of all_circuits) {
        let exists = false;
        for (const circuit of circuits) {
            if (circuit.hasSameElements(new_circuit)) {
                exists = true;
                break;
            }
        }
        if (!exists) circuits.push(new_circuit);
    }

    return circuits;
}

function updateMembership() {
    for (const element of simContainer.elements) {
        element.circuits = [];
        element.circuits_id = [];
    }
    for (const circuit of simContainer.circuits) {
        for (const element_id of circuit.elements_id) {
            element_id[0].circuits.push(circuit);
            element_id[0].circuits_id.push([circuit, element_id[1]]);
        }
    }
}

function findCurrent(circuit) {
    const last_current = circuit.current;
    const last_integral = circuit.current_idt;

    const voltages = [];
    for (const node of circuit.nodes) {
        const element = node.parent;
        // Battery
        if (element.type == "battery") {
            voltages.push(current => element.emf * Math.sign(node.id));

        // Resistor
        } else if (element.type == "resistor") {
            let other_currents = 0;
            // for (const other_circuit_id of element.circuits_id) {
            //     const other_circuit = other_circuit_id[0];
            //     const other_id = other_circuit_id[1];
            //     if (circuit == other_circuit) continue;
            //     other_currents += -other_circuit.current * Math.sign(other_id);
            // }
            function voltage(current) {
                const relative_current = current * Math.sign(node.id);
                const relative_voltage = relative_current * element.resistance;
                const absolute_voltage = relative_voltage * Math.sign(node.id);
                return absolute_voltage
            }
            voltages.push(voltage);

        // Capacitor
        } else if (element.type == "capacitor") {
            function voltage(current) {
                const stored_charge = element.current_idt;
                const relative_current = current * Math.sign(node.id);
                const next_stored_charge = stored_charge + (relative_current * dt);
                const relative_voltage = next_stored_charge / element.capacitance;
                const absolute_voltage = relative_voltage * node.id;
                return absolute_voltage;
            }
            voltages.push(voltage);

        // Inductor
        } else if (element.type == "inductor") {
            let other_derivatives = 0;
            // for (const other_circuit_id of element.circuits_id) {
            //     const other_circuit = other_circuit_id[0];
            //     const other_id = other_circuit_id[1];
            //     if (circuit == other_circuit) continue;
            //     other_derivatives += other_circuit.current_ddt * Math.sign(other_id);
            // }
            function voltage(current) {
                const absolute_derivative = (current - last_current) / dt;
                const relative_derivative = absolute_derivative * Math.sign(node.id);
                const relative_voltage = relative_derivative * element.inductance;
                const absolute_voltage = relative_voltage * Math.sign(node.id); 
                return absolute_voltage;
            }
            voltages.push(voltage);

        // Switch
        } else if (element.type == 'switch') {
            if (!element.state) return 0;
        }
    }

    function loop_voltage(current) {
        let total_voltage = 0;
        for (const voltage of voltages) {
            total_voltage += voltage(current);
        }
        return total_voltage;
    }

    if (loop_voltage(1) == 0 && loop_voltage(0) == 0) return 0;

    const slope = loop_voltage(1) - loop_voltage(0)
    console.log(loop_voltage(1), loop_voltage(0));
    const current = -loop_voltage(0) / slope;
    
    return current;
}

function resetElements(elements) {
    for (const element of elements) {
        if (element.type == 'resistor') {
            element.current = 0;
        } else if (element.type == 'inductor') {
            element.current_ddt = 0;
        }
    }
}

function updateElements(circuits) {
    for (const circuit of circuits) {
        for (const node of circuit.nodes) {
            const element = node.parent;
            if (element.type == 'resistor') {
                element.current += circuit.current * Math.sign(node.id);
                console.log(element.current);
            } else if (element.type == 'inductor') {
                element.current_ddt += circuit.current_ddt * Math.sign(node.id);
            } else if (element.type == 'capacitor') {
                element.current_idt += circuit.current * dt * Math.sign(node.id);
            }
        }
    }
}

export { simulatePeriodic };
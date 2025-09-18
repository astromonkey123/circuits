/**
 * Script to update the list of circuits by detecting all those that exist,
 * filtering duplicates, and prioritizing those that existed before.
 * 
 * @author contraflux
 * @date 17/9/2025
 */

// Imports
import { simContainer } from "./app.js";
import { Circuit } from "../components/Circuit.js";

// Exports
export { detect }

function detect() {
    const all_circuits = findCircuits(simContainer.elements);

    const filtered_circuits = filterCircuits(simContainer.circuits, all_circuits);
    
    simContainer.circuits = filtered_circuits;

    console.log(simContainer.circuits);
}

// Find one circuit starting at each element
function findCircuits(elements) {
    const circuits = [];

    for (const element of elements) {
        const loop = findLoop(element.link1, [], 0);
        
        if (loop != null) {
            circuits.push(new Circuit(loop));
        }
    }

    return circuits
}

// Find a loop given a starting link using recursion
function findLoop(link, loop, iteration) {
    loop.push(link);
    const next_links = link.sibling.links;
    // Base cases
    if (next_links.includes(loop[0])) {
        return loop;
    } else if (next_links.length == 0 || iteration >= 10) {
        return null
    }
    // Recursion
    return findLoop(next_links[0], loop, iteration + 1);
}

function filterCircuits(existing_circuits, all_circuits) {
    let circuits = [];

    // Find the existing circuits that still exist
    for (const existing_circuit of existing_circuits) {
        let still_exists = false;

        for (const circuit of all_circuits) {
            if (hasSameElements(existing_circuit, circuit)) {
                still_exists = true;
            }
        }

        if (still_exists) {
            circuits.push(existing_circuit);
        }
    }

    // Add the new circuits but check for duplicates
    for (const circuit of all_circuits) {
        let exists = false;

        for (const c of circuits) {
            if (hasSameElements(c, circuit)) {
                exists = true;
            }
        }

        if (!exists) {
            circuits.push(circuit);
        }
    }

    return circuits
}

function hasSameElements(circuit1, circuit2) {
    const circuit1_elements = [];
    const circuit2_elements = [];

    function isContained(loop1, loop2) {
        for (const link of loop1) {
            if (!loop2.includes(link)) {
                return false;
            }
        }
        return true;
    }

    return isContained(circuit1.links, circuit2.links) && isContained(circuit2.links, circuit1.links);
}
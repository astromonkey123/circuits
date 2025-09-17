import { Battery } from "../components/elements/Battery.js";
import { Wire } from "../components/elements/Wire.js";
import { Resistor } from "../components/elements/Resistor.js";
import { Inductor } from "../components/elements/Inductor.js";
import { Capacitor } from "../components/elements/Capacitor.js";
import { Switch } from "../components/elements/Switch.js";
import { pMOSFET, nMOSFET } from "../components/elements/MOSFET.js";

function addElement(simContainer, type) {
    if (type == 'battery') {
        addBattery(simContainer);
    } else if (type == 'resistor') {
        addResistor(simContainer);
    } else if (type == 'capacitor') {
        addCapacitor(simContainer);
    } else if (type == 'inductor') {
        addInductor(simContainer);
    } else if (type == 'wire') {
        addWire(simContainer);
    } else if (type == 'switch') {
        addSwitch(simContainer);
    } else if (type == 'nmosfet') {
        addnMOSFET(simContainer);
    } else if (type == 'pmosfet') {
        addpMOSFET(simContainer);
    }
    simContainer.updateLinks();
}

function addBattery(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 100,
        1
    ));
}

function addWire(simContainer) {
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 - 100,
        canvas.width/2 + 50,
        canvas.height/2 - 100
    ));
}

function addResistor(simContainer) {
    simContainer.elements.push(new Resistor(
        canvas.width/2,
        canvas.height/2 + 50,
        1
    ));
}

function addCapacitor(simContainer) {
    simContainer.elements.push(new Capacitor(
        canvas.width/2,
        canvas.height/2,
        0.001,
        0
    ));
}

function addInductor(simContainer) {
    simContainer.elements.push(new Inductor(
        canvas.width/2, 
        canvas.height/2 - 50, 
        1
    )); 
}

function addSwitch(simContainer) {
    simContainer.elements.push(new Switch(
        canvas.width/2,
        canvas.height/2
    ));
}

function addnMOSFET(simContainer) {
    simContainer.elements.push(new nMOSFET(
        canvas.width/2,
        canvas.height/2 - 50,
        1
    ));
}

function addpMOSFET(simContainer) {
    simContainer.elements.push(new pMOSFET(
        canvas.width/2,
        canvas.height/2 + 50,
        1
    ));
}

export { addElement };
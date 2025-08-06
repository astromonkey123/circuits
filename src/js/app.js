import { Battery, Wire, Resistor, Capacitor, Inductor } from './element.js';
import { Connection } from './connection.js';
import { graphAll, resetGraph } from './graphing.js';
import { simulate_periodic } from './circuit_sim.js';
import { Container } from './container.js';

export const container = new Container('canvas');

const canvas = container.canvas;
const ctx = container.ctx;

const input_box = document.getElementById('input-box');
const input_type = document.getElementById('input-type');
const input_field = document.getElementById('input-field');
const accept_button = document.getElementById('accept');
const cancel_button = document.getElementById('cancel');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        new Battery(canvas.width/2, canvas.height/2 + 100, 1);
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        new Resistor(canvas.width/2, canvas.height/2 + 50, 1);
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        new Capacitor(canvas.width/2, canvas.height/2, 0.001, 0);
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        new Inductor(canvas.width/2, canvas.height/2 - 50, 1);
    });
    document.getElementById('addWire').addEventListener('click', () => {
        new Wire(canvas.width/2 - 50, canvas.height/2 - 100, canvas.width/2 + 50, canvas.height/2 - 100);
    });
    document.getElementById('addRC').addEventListener('click', () => {
        new Battery(canvas.width/2, canvas.height/2 + 50, 10);
        new Resistor(canvas.width/2 + 50, canvas.height/2 - 50, 1);
        new Capacitor(canvas.width/2 - 50, canvas.height/2 - 50, 0.5, 0);
        new Wire(canvas.width/2 - 100, canvas.height/2 - 50, canvas.width/2 - 100, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 100, canvas.height/2 - 50, canvas.width/2 + 100, canvas.height/2 + 50);
        new Wire(canvas.width/2 - 100, canvas.height/2 + 50, canvas.width/2 - 50, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 100, canvas.height/2 + 50, canvas.width/2 + 50, canvas.height/2 + 50);
    });
    document.getElementById('addRL').addEventListener('click', () => {
        new Battery(canvas.width/2, canvas.height/2 + 50, 10);
        new Resistor(canvas.width/2 + 50, canvas.height/2 - 50, 1);
        new Inductor(canvas.width/2 - 50, canvas.height/2 - 50, 0.5);
        new Wire(canvas.width/2 - 100, canvas.height/2 - 50, canvas.width/2 - 100, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 100, canvas.height/2 - 50, canvas.width/2 + 100, canvas.height/2 + 50);
        new Wire(canvas.width/2 - 100, canvas.height/2 + 50, canvas.width/2 - 50, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 100, canvas.height/2 + 50, canvas.width/2 + 50, canvas.height/2 + 50);
    });
    document.getElementById('addRLC').addEventListener('click', () => {
        new Battery(canvas.width/2, canvas.height/2 + 50, 10);
        new Resistor(canvas.width/2 + 100, canvas.height/2 - 50, 1);
        new Inductor(canvas.width/2, canvas.height/2 - 50, 0.5);
        new Capacitor(canvas.width/2 - 100, canvas.height/2 - 50, 0.01, 0);
        new Wire(canvas.width/2 - 150, canvas.height/2 - 50, canvas.width/2 - 150, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 150, canvas.height/2 - 50, canvas.width/2 + 150, canvas.height/2 + 50);
        new Wire(canvas.width/2 - 50, canvas.height/2 + 50, canvas.width/2 - 150, canvas.height/2 + 50);
        new Wire(canvas.width/2 + 50, canvas.height/2 + 50, canvas.width/2 + 150, canvas.height/2 + 50);
    });
    document.getElementById('clearCanvas').addEventListener('click', () => {
        const clear_text = document.getElementById('clearText');
        const slider_cover = document.getElementById('slider-cover');

        if (clear_text.innerHTML === "Clear") {
            clear_text.innerHTML = "Confirm?"
            slider_cover.style.width = "80%";
            setTimeout(() => {
                clear_text.innerHTML = "Clear";
                slider_cover.style.width = "85%";
            }, 2000); // Cancel after 2000ms

        } else if (clear_text.innerHTML === "Confirm?") {
            clear_text.innerHTML = "Clear"
            slider_cover.style.width = "85%";
            clearCanvas();

        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let object of container.objects) {
        if (object.type == 'wire') {
            if (object.connection1.contains(mouseX, mouseY)) {
                container.dragging = object.connection1;
            } else if (object.connection2.contains(mouseX, mouseY)) {
                container.dragging = object.connection2;
            }
        } else {
            if (object.contains(mouseX, mouseY)) {
                container.dragging = object;
                container.offsets.x = mouseX - container.dragging.x;
                container.offsets.y = mouseY - container.dragging.y;
                container.offsets.rotation = Math.atan2(container.offsets.x, container.offsets.y) + container.dragging.rotation;
            }
        }
    }
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let object of objects) {
        if (object.type == 'wire') continue;

        if (object.contains(mouseX, mouseY)) {
            if (object.type == 'capacitor') {
                showInputBox(object, 1);
            } else {
                showInputBox(object, 2);
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!container.dragging) return;
    const rect = canvas.getBoundingClientRect();
    if (container.dragging instanceof Connection) {
        container.dragging.move(e.clientX - rect.left, e.clientY - rect.top);
    } else {
        if (e.shiftKey) {
            container.offsets.x = e.clientX - rect.left - container.dragging.x;
            container.offsets.y = e.clientY - rect.top - container.dragging.y;
            container.dragging.rotate(-Math.atan2(container.offsets.x, container.offsets.y) +  container.offsets.rotation);
        } else {
            container.dragging.move(e.clientX - rect.left - container.offsets.x, e.clientY - rect.top - container.offsets.y);
        }
    }
    drawAll();
});

canvas.addEventListener('mouseup', () => {
    container.dragging = null;
});

accept_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";

    if (edit_object.type == 'battery') {
        container.editing.emf = parseFloat(input_field.value);

    } else if (edit_object.type == 'resistor') {
        container.editing.resistance = parseFloat(input_field.value);

    } else if (edit_object.type == 'capacitor') {
        container.editing.capacitance = parseFloat(input_field.value);

    } else if (edit_object.type == 'inductor') {
        container.editing.inductance = parseFloat(input_field.value);

    }
});

cancel_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";
});

function appPeriodic() {
    drawAll();
    simulate_periodic();
    display_info();
    graphAll();
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of container.objects) {
        obj.draw(ctx);
        // console.log(obj);
    }
    for (let connection of container.connections) {
        connection.draw(ctx);
        connection.checkLinks();
    }
}

function clearCanvas() {
    canvas_circuits = [];
    objects = [];
    connections = [];
    dragging = null;
    resetGraph();
}

function display_info() {
    if (container.circuits.length === 0) return;

    let circuit = container.circuits[0];
    document.getElementById("current").innerHTML = "Current: " + "<br>" + circuit.current.toFixed(3) + "A";
    document.getElementById("integral").innerHTML = "Integral: " + "<br>" + circuit.current_idt.toFixed(3) + "As";
    document.getElementById("derivative").innerHTML = "Derivative: " + "<br>" + circuit.current_ddt.toFixed(3) + "A/s";
    document.getElementById("time").innerHTML = "Time: " + "<br>" + circuit.elapsed_time.toFixed(3) + "s";
}

function showInputBox(object) {
    input_box.style.visibility = "visible";

    edit_object = object;

    if (object.type == 'battery') {
        input_type.innerHTML = "Voltage";
        input_field.value = object.emf;

    } else if (object.type == 'resistor') {
        input_type.innerHTML = "Resistance";
        input_field.value = object.resistance;

    } else if (object.type == 'capacitor') {
        input_type.innerHTML = "Capacitance";
        input_field.value = object.capacitance;

    } else if (object.type == 'inductor') {
        input_type.innerHTML = "Inductance";
        input_field.value = object.inductance;

    }
}



setInterval(appPeriodic, 1000);
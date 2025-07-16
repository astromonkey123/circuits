import { Circuit } from './circuit.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from './element.js';
import { Connection } from './connection.js';
import { simulate_periodic } from './circuit_sim.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export let circuits = [];
export let objects = [];
export let connections = [];
let dragging = null;
let offsetX = 0;
let offsetY = 0;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        let temp = new Battery(350, 250, 10);
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        let temp = new Resistor(350, 250, 10);
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        let temp = new Capacitor(350, 250, 10, 0);
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        let temp = new Inductor(350, 250, 10);
    });
    document.getElementById('addWire').addEventListener('click', () => {
        let temp = new Wire(350, 250);
    });
    document.getElementById('clear').addEventListener('click', () => {
        clearCanvas();
    });
});

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of objects) {
        obj.draw(ctx);
    }
    for (let connection of connections) {
        connection.draw(ctx);
        connection.checkLinks();
    }
    for (let connection of connections) {
        connection.findVoltage();
    }
}

function clearCanvas() {
    objects = [];
    connections = [];
    dragging = null;
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let object of objects) {
        if (object.type == 'wire') {
            if (object.connection1.contains(mouseX, mouseY)) {
                dragging = object.connection1;
            } else if (object.connection2.contains(mouseX, mouseY)) {
                dragging = object.connection2;
            }
        } else {
            if (object.contains(mouseX, mouseY)) {
                dragging = object;
                offsetX = mouseX - dragging.x;
                offsetY = mouseY - dragging.y;
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    if (dragging instanceof Connection) {
        dragging.move(e.clientX - rect.left, e.clientY - rect.top)
    } else {
        dragging.move(e.clientX - rect.left - offsetX, e.clientY - rect.top - offsetY)
    }
    drawAll();
});

canvas.addEventListener('mouseup', () => {
    dragging = null;
});

function display_info() {
    if (circuits.length === 0) return;

    let circuit = circuits[0];
    document.getElementById("current").innerHTML = circuit.I;
    document.getElementById("integral").innerHTML = circuit.integral_Idt;
    document.getElementById("derivative").innerHTML = circuit.dIdt;
}

setInterval(drawAll, 30);
setInterval(simulate_periodic, 1000);
setInterval(display_info, 1000);
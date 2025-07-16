import { Circuit } from './circuit.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from './element.js';
import { Connection } from './connection.js';
import { simulate_periodic } from './circuit_sim.js';
import { graphAll } from './graphing.js';

const canvas = document.getElementById('canvas');
// const graph = document.getElementById('graph');
const ctx = canvas.getContext('2d');

export let circuits = [];
export let objects = [];
export let connections = [];
let dragging = null;
let offsetX = 0;
let offsetY = 0;
let offsetRot = 0;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        let temp = new Battery(350, 250, 10);
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        let temp = new Resistor(350, 250, 10);
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        let temp = new Capacitor(350, 250, 0.001, 0);
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
}

function clearCanvas() {
    circuits = [];
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
                offsetRot = Math.atan2(offsetX, offsetY) + dragging.rotation;
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    if (dragging instanceof Connection) {
        dragging.move(e.clientX - rect.left, e.clientY - rect.top);
    } else {
        if (e.shiftKey) {
            offsetX = e.clientX - rect.left - dragging.x;
            offsetY = e.clientY - rect.top - dragging.y;
            dragging.rotate(-Math.atan2(offsetX, offsetY) +  offsetRot);
        } else {
            dragging.move(e.clientX - rect.left - offsetX, e.clientY - rect.top - offsetY);
        }
    }
    drawAll();
});

canvas.addEventListener('mouseup', () => {
    dragging = null;
});

function display_info() {
    if (circuits.length === 0) return;

    let circuit = circuits[0];
    document.getElementById("current").innerHTML = circuit.I.toFixed(3);
    document.getElementById("integral").innerHTML = circuit.integral_Idt.toFixed(3);
    document.getElementById("derivative").innerHTML = circuit.dIdt.toFixed(3);
}

setInterval(drawAll, 30);
setInterval(simulate_periodic, 100);
setInterval(display_info, 100);
setInterval(graphAll, 100);
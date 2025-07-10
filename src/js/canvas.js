import { Circuit } from './circuit.js';
import { Element } from './element.js';
import { Connection } from './connection.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export let objects = [];
export let connections = [];
let dragging = null;
let offsetX = 0;
let offsetY = 0;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        addObject('battery');
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        addObject('resistor');
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        addObject('capacitor');
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        addObject('inductor');
    });
    document.getElementById('addWire').addEventListener('click', () => {
        addObject('wire');
    });
    document.getElementById('clear').addEventListener('click', () => {
        clearCanvas();
    });
});

function addObject(type) {
    let new_object = new Element(350, 250, type, 0, 0, 0);
}

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

setInterval(drawAll, 30);
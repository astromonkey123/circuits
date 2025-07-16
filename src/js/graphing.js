import { circuits, objects, connections } from './canvas.js';

const graph = document.getElementById('graph');
const ctx = graph.getContext('2d');

let currents = [0];

export function graphAll() {
    if (circuits.length !== 0) currents.push(circuits[0].I);

    ctx.clearRect(0, 0, graph.width, graph.height);

    let num_currents = currents.length;
    let spacing = graph.width / num_currents;
    let height_scale = 1/Math.max(...currents);

    draw_grid();


    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x < num_currents; x++) {
        ctx.lineTo((x + 1) * spacing, -currents[x] * height_scale * graph.height/2);
    }
    ctx.stroke();
    ctx.restore();
}

function draw_grid() {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.save();
    ctx.translate(0, graph.height/2);
    for (let h = -graph.height/2; h <= graph.height/2; h+= graph.height/4) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(graph.width, h);
        ctx.stroke();
    }
    ctx.restore();
}
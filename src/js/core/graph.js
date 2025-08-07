import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { simContainer, graphContainer } from './app.js';

function drawGraph() {
    const graph = graphContainer.canvas;
    const ctx = graphContainer.ctx;

    for (const circuit of simContainer.circuits) {
        while (circuit.data.currents.length > graphContainer.num_times * ( 7/8 )) {
            circuit.data.currents.shift();
            circuit.data.times.shift();
        }
    }

    if (simContainer.circuits.length == 0) {
        graphContainer.height_scale = 0;
    } else {
        let limits = [];
        for (const circuit of simContainer.circuits) {
            const max_current = Math.max( ...circuit.data.currents );
            const min_current = Math.min( ...circuit.data.currents );
            limits.push( Math.max( Math.abs( max_current ), Math.abs( min_current ) ) );
        }
        graphContainer.updateScale( Math.max( ...limits ) );
    }
    
    // Clear the graph
    ctx.clearRect(0, 0, graph.width, graph.height);

    // Draw the horizontal lines
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.save();
    ctx.translate(0, graph.height/2);
    for (let h = -graph.height/3; h <= graph.height/3; h += graph.height/6) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(graph.width, h);
        ctx.stroke();
    }
    ctx.restore();

    for (let i = 0; i < simContainer.circuits.length; i++) {
        const circuit = simContainer.circuits[i];
        plot(ctx, circuit.data.times, circuit.data.currents, i);
    }

    const display_current = 1 / graphContainer.height_scale;
    let display_text = "";

    if (display_current == Infinity) {
        display_text = "0A";
    } else if (display_current >= 1) {
        display_text = display_current + "A";
    } else if (display_current >= 1e-3) {
        display_text = (1000 * display_current) + "mA"
    } else {
        const scaling = ( 1 / (height_scale *  (Math.pow(10, Math.floor( Math.log10( display_current ) ) ) ) ) ).toFixed(3)
        const exponential = Math.floor( Math.log10( display_current ) );
        display_text = scaling + "e" + exponential + "A";
    }

    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.font = "18px serif";
    ctx.fillText( display_text, 6, -graph.height/2 + 18 );
    ctx.restore();
}

function plot(ctx, times, currents, i) {
    const colors = ['#F28B82', '#FBBC04', '#FFF475', '#81C995', '#AECBFA', '#D7AEFB'];

    // Plot the current
    ctx.fillStyle = colors[i % colors.length];
    ctx.strokeStyle = colors[i % colors.length];
    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.beginPath();
    ctx.moveTo(0, -(2/3) * currents[0] * graphContainer.height_scale * graph.height/2);
    for (let x = 1; x < currents.length; x++) {
        ctx.lineTo((x + 1) * graphContainer.spacing, -(2/3) * currents[x] * graphContainer.height_scale * graph.height/2);
    }
    ctx.stroke();

    // Plot the time increments
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.font = "18px serif";
    for (let x = 0; x < currents.length; x++) {
        if (times[x] % 0.25 == 0) {
            ctx.beginPath();
            ctx.moveTo(x * graphContainer.spacing, graph.height/2);
            ctx.lineTo(x * graphContainer.spacing, -graph.height/2);
            ctx.stroke();
            ctx.fillText(times[x].toFixed(3) + "s", x * graphContainer.spacing + 4, graph.height/2 - 4);
        }
    }
    ctx.restore();
}

export { drawGraph };
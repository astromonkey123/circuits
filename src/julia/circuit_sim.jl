"""
Script to simulate circuits with batteries, resistors, inductors, and capacitors.

Works for elements in series and in parallel.

Prototype for the actual circuit simulation which will be done in JavaScript.
"""
    
using GLMakie

mutable struct Circuit
    elements::Vector
end

mutable struct Battery
    Emf::Float64 # Electromotive force
end

mutable struct Resistor
    R::Float64 # Resistance
end

mutable struct Inductor
    L::Float64 # Inductance
end

mutable struct Capacitor
    C::Float64 # Capacitance
    Q::Float64 # Stored initial charge
end

function simulate(circuit, duration)
    """ Simulate the given circuit for the specified duration """

    circuit_loops = find_loops(circuit) # Break the circuit into Kirchhoff Loops
    num_loops = length(circuit_loops)

    dt = 1e-3 # Simulation time step
    I_previous = zeros(num_loops) # Currents from the previous time step
    ∫Idt = zeros(num_loops) # Integrals of currents wrt time

    # Keep track of time and total current for plotting
    ts = []
    currents = []

    # Loop through time steps
    for t in 0:dt:duration
        I_total = 0

        # Calculate the current in each loop
        for (i, circuit) in enumerate(circuit_loops)
            I, ∫Idt[i], dIdt = circuit_solver(circuit, I_previous[i], ∫Idt[i], dt) # Find current, its integral, and its derivative
            I_previous[i] = I # Store the current for the next time step

            I_total += I # Add this loop's current to the total
        end

        # Push the time and current to the vectors for plotting
        push!(ts, t)
        push!(currents, I_total)
    end

    display(lines(ts, currents)) # Time vs current line graph
end

function find_loops(circuit)
    """ Break complex circuits into Kirchhoff Loops """

    loops = [[]] # Kirchhoff loops

    for element in circuit.elements
        if element isa Vector
            # Create a new loop with each sub-element for each loop
            new_loops = [[loop..., sub_element] for loop in loops for sub_element in element]
        else
            # Add the element to the end of each loop
            new_loops = [[loop..., element] for loop in loops]
        end
        loops = new_loops
    end

    circuit_loops = [Circuit(loop) for loop in loops] # Convert the loops into circuits

    return circuit_loops
end

function circuit_solver(circuit, I_previous, ∫Idt, dt)
    """
    Solve the given circuit based on its elements and its state
    
    Operates on Kirchhoff's Law, i.e. ΔV around a closed loop must be 0.
    """

    ΔV_total = [] # Contributions to the voltage around the loop

    # Find the voltage contribution from each element as a function of current, its integral, and its derivative
    for element in circuit.elements
        if typeof(element) == Battery
            # Battery -> dV is constant: the EMF of the battery
            push!(ΔV_total, (I, ∫Idt, dIdt) -> element.Emf)

        elseif typeof(element) == Resistor
            # Resistor -> dV is proportional to current by Ohm's Law: ΔV = I * R
            push!(ΔV_total, (I, ∫Idt, dIdt) -> -(I * element.R))

        elseif typeof(element) == Capacitor
            # Capacitor -> dV is proportional to the charge stored: ΔV = ∫ I dt / C
            push!(ΔV_total, (I, ∫Idt, dIdt) -> -((∫Idt + element.Q) / element.C))

        elseif typeof(element) == Inductor
            # Inductor -> dV is proportional to the derivative of current by Faraday's Law: ΔV = L * dIdt
            push!(ΔV_total, (I, ∫Idt, dIdt) -> -(dIdt * element.L))

        end
    end

    # TODO: I'm pretty sure dI/dt in the voltage calculation below is always 0, but I
    # get the expected graphical results so I'm not really sure how this is working.
    # However, like all good programmers, I'll gladly follow the "if it ain't broken,
    # don't fix it" line of thought.

    I = 0

    # Sum up the voltage contributions from each element
    ΔV(I) = sum([ΔV_element(I, ∫Idt + I * dt, (I - I_previous) / dt) for ΔV_element in ΔV_total])

    # Estimate the current (similar to Newton's Method)
    slope = ΔV(1) - ΔV(0)
    I = ( -ΔV(0)/slope )

    # Ideally dV(I) = 0, but I've been getting dV(I) <= 1e-12 which is a more
    # than small enough error for it not to matter to me

    ∫Idt += I * dt # Find the integral of current
    dIdt = (I - I_previous) / dt # Find the derivative of current

    return I, ∫Idt, dIdt
end

""" Example of a circuit with resistors in parallel """
b1 = Battery(10)
r1 = Resistor(1)
r2 = Resistor(2)
circuit = Circuit([b1, [r1, r2]])

simulate(circuit, 1)

#TODO: Make it so it works with more layers, both parallel and series
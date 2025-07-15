using GLMakie

mutable struct Circuit
    elements::Vector
end

mutable struct Battery
    Emf::Float64
end

mutable struct Resistor
    I::Float64
    ΔV::Float64
    R::Float64
end

mutable struct Inductor
    I::Float64
    ΔV::Float64
    L::Float64
end

mutable struct Capacitor
    I::Float64
    ΔV::Float64
    C::Float64
    Q::Float64
end

bat = Battery(10)
r1 = Resistor(0, 0, 5)
c1 = Capacitor(0, 0, 1, 0)
l1 = Inductor(0, 0, 0.049)

c1 = Circuit([bat, r1, l1, c1])

function simulate()
    dt = 0.01
    I_previous = 0
    ∫_I_dt = 0
    dIdt = 0

    ts = []
    currents = []

    for t in 0:dt:10
        I, ∫_I_dt, dIdt = circuit_solver(c1, I_previous, ∫_I_dt, dt)

        ∫_I_dt += I * dt
        dIdt = ( I - I_previous ) / dt
        I_previous = I

        # println("Integral: $(∫_I_dt)")
        # println("Current: $I")
        # println("Derivative: $(dIdt)")
        # println("--------------------")

        push!(ts, t)
        push!(currents, I)
    end

    fig = Figure()
    ax = Axis(fig[1, 1])
    lines!(ax, ts, currents)

    display(fig)
end

function circuit_solver(c1, I_previous, ∫_I_dt, dt)
    I = 0
    dIdt = 0

    for n in 0:1
        dV_functions = []

        for element in c1.elements
            if typeof(element) == Battery
                push!(dV_functions, I -> element.Emf)
            elseif typeof(element) == Resistor
                push!(dV_functions, I -> -(I * element.R))
            elseif typeof(element) == Capacitor
                push!(dV_functions, I -> -(∫_I_dt * element.C))
            elseif typeof(element) == Inductor
                push!(dV_functions, I -> -(dIdt * element.L))
            end
        end

        dV(I) = sum([dV_function(I) for dV_function in dV_functions])
        slope = dV(1) - dV(0)
        I = ( -dV(0)/slope )

        if abs(dV(I)) > 1e-10
            println(dV(I))
        end

        ∫_I_dt += I * dt
        dIdt = (I - I_previous) / dt
    end

    return I, ∫_I_dt, dIdt
end

simulate()
// Wait for DOM to be ready
$(document).ready(function() {
    const settings = {
        frictionAir: 0.0006,
        itemVelocity: 0.2,
        pushTreshold: 0.5
    };

    const randomVelocity = () => (Math.random() - 0.5) * settings.itemVelocity;
    const wrapper = document.querySelector('.freiraum-25-floats');

    const poolPhysics = function () {
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies;
    
        // create engine
        var engine = Engine.create(),
            world = engine.world;
    
        // create renderer
        var render = Render.create({
            element: wrapper,
            engine: engine,
            options: {
                width: wrapper.clientWidth,
                height: wrapper.clientHeight,
                showAngleIndicator: false,
                showCollisions: false,
                showVelocity: false,
                background: "transparent",
                wireframeBackground: "transparent",
                wireframes: false
            }
        });
    
        Render.run(render);
    
        // set gravity
        engine.gravity.x = 0;
        engine.gravity.y = 0;
    
        // create runner
        var runner = Runner.create();
        Runner.run(runner, engine);
    
        // add bodies
        var rest = 1,
            space = wrapper.clientWidth / 2;
    
        // add our numbers
        const two = Bodies.rectangle(200 + space * 0, 250, 200, (200 / 506) * 651, {
            restitution: rest,
            frictionAir: settings.frictionAir,
            render: {
                sprite: {
                    texture: "./assets/images/5.png",
                    xScale: 0.2,
                    yScale: 0.2
                }
            }
        });
        const five = Bodies.rectangle(200 + space * 0.5, 250, 200, (200 / 507) * 651, {
            restitution: rest,
            angle: -Math.PI * 0.15,
            frictionAir: settings.frictionAir,
            render: {
                sprite: {
                    texture: "./assets/images/17.png",
                    xScale: 0.2,
                    yScale: 0.2
                }
            }
        });
        const four = Bodies.rectangle(200 + space * 1, 250, 200, (200 / 507) * 651, {
            restitution: rest,
            frictionAir: settings.frictionAir,
            render: {
                sprite: {
                    texture: "./assets/images/16.png",
                    xScale: 0.2,
                    yScale: 0.2
                }
            }
        });

        Composite.add(world, [
            two,
            five,
            four,
    
            // walls
            Bodies.rectangle(0, wrapper.clientHeight / 2, 50, wrapper.clientHeight, {
                isStatic: true,
                restitution: rest,
                render: { fillStyle: "transparent", lineWidth: 0 }
            }),
            Bodies.rectangle(
                wrapper.clientWidth,
                wrapper.clientHeight / 2,
                50,
                wrapper.clientHeight,
                {
                    isStatic: true,
                    restitution: rest,
                    render: { fillStyle: "transparent", lineWidth: 0 }
                }
            ),
            Bodies.rectangle(wrapper.clientWidth / 2, 0, wrapper.clientWidth, 50, {
                isStatic: true,
                restitution: rest,
                render: { fillStyle: "transparent", lineWidth: 0 }
            }),
            Bodies.rectangle(
                wrapper.clientWidth / 2,
                wrapper.clientHeight,
                wrapper.clientWidth,
                50,
                {
                    isStatic: true,
                    restitution: rest,
                    render: { fillStyle: "transparent", lineWidth: 0 }
                }
            )
        ]);
    
        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
    
        Composite.add(world, mouseConstraint);
    
        // keep the mouse in sync with rendering
        render.mouse = mouse;
    
        // fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: wrapper.clientWidth, y: wrapper.clientHeight }
        });
    
        // add velocity to numbers if they are below a certain threshold
        Matter.Events.on(engine, "beforeUpdate", () => {
            if (Matter.Body.getSpeed(two) < settings.pushTreshold) {
                Matter.Body.applyForce(two, two.position, {
                    x: randomVelocity(),
                    y: randomVelocity()
                });
                $(settings.backgroundSelector).ripples(
                    "drop",
                    two.position.x,
                    two.position.y,
                    settings.rippleRadius,
                    settings.rippleStrength
                );
            }
    
            if (Matter.Body.getSpeed(five) < settings.pushTreshold) {
                Matter.Body.applyForce(five, five.position, {
                    x: randomVelocity(),
                    y: randomVelocity()
                });
                $(settings.backgroundSelector).ripples(
                    "drop",
                    five.position.x,
                    five.position.y,
                    settings.rippleRadius,
                    settings.rippleStrength
                );
            }
        });
    
        // add resize events
        window.addEventListener("resize", () => {
            render.options.width = wrapper.clientWidth;
            render.options.height = wrapper.clientHeight;
            Matter.Render.setPixelRatio(render, window.devicePixelRatio); // added this
        });
    };
    
    poolPhysics();
});
  
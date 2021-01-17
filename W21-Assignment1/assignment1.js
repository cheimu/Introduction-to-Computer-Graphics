import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        //this.positions.push(...Vec.cast(
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [-1,  1, -1], [-1,  1, -1], [ 1,  1, -1], [ 1,  1, -1], [ 1, -1, -1],[ 1, -1, -1], [-1, -1, -1],
            [-1, -1,  1], [-1,  1,  1], [-1,  1,  1], [ 1,  1,  1], [ 1,  1,  1], [ 1, -1,  1], [ 1, -1,  1], [-1, -1,  1],
            [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1], [ 1,  1, -1], [ 1,  1,  1], [ 1, -1, -1], [ 1, -1,  1]);
        this.arrays.color = Array(24).fill(color(1, 1, 1, 1));
        this.indices = false;
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("positions", "normals");
        // TODO (Extra credit part I)
         this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'single_strip': new Cube_Single_Strip(),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment1 extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    constructor() {
        super();
        this.OutlineFlag = false;
        this.StillFlag = false;
        this.ExtraCredit1Flag = false;
        this.ExtraCredit2Flag = false;

        /* Set up box colors. */
        this.colorTable = [color(1,1,1,1), color(1,0,0,1), color(1,.5,0,1), color(0,1,1,1),
                           color(0,1,0,1), color(0,0,1,1), color(0,.6,.6,1), color(1,.7,.8,1)];
        this.set_colors();
        this.maxAngle = 0.04 * Math.PI;
        this.numOfSwing = 5;
    }

    set_colors() {
        // TODO:  Create a class member variable to store your cube's colors.
        this.colorTable = [color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
            color(this.random_number_generator(), this.random_number_generator(), this.random_number_generator(), 1),
        ];
    }

    random_number_generator() {
        return Math.random() * (0.0 - 1.5) + 1.5
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
            this.OutlineFlag ^= 1;
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
            this.StillFlag ^= 1;
        });
        this.key_triggered_button("Extra Credit 1: Draw Triangle Strip", ["g"], () => {
            // TODO:  Requirement extra credit 1:  
            this.ExtraCredit1Flag ^= 1;
        });
        this.key_triggered_button("Extra Credit 2: Scale the Y axis of base box 1.5x", ["l"], () => {
            // TODO:  Requirement extra credit 2: Scale the box to 1.5x along the Y axis.
            this.ExtraCredit2Flag ^= 1;
        });
    }

    draw_box(context, program_state, model_transform, idx) {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        this.shapes.cube.draw(context, program_state, model_transform,
                 this.materials.plastic.override({color: this.colorTable[idx]}));
        return model_transform;
    }

    draw_outline(context, program_state, model_transform) {
        // TODO: Helperfunction for requirement 5 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
        return model_transform;
    }

    draw_triangle_strip(context, program_state, model_transform, idx) {
        this.shapes.single_strip.draw(context, program_state, model_transform,
                this.materials.plastic.override({color: this.colorTable[idx]}), "TRIANGLE_STRIP");
        return model_transform;      
    }

    rotation_angle_function(frequency, t) {
        return ((this.maxAngle/2) + ((this.maxAngle/2) * Math.sin(frequency * Math.PI * t)));
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();

        // Example for drawing a cube, you can remove this line if needed
        // this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color:blue}));
        // TODO:  Draw your entire scene here.  Use this.draw_box( graphics_state, model_transform ) to call your helper.
        const t = this.t = program_state.animation_time / 1000;
        let curAngle = this.rotation_angle_function(this.numOfSwing, t);
        if (this.StillFlag) {
            curAngle = this.maxAngle;
        }
        // base box without rotation;
        let scaleFactor = this.ExtraCredit2Flag? 1.5: 1;
        model_transform = model_transform.times(Mat4.translation(1, 1, 0))
             .times(Mat4.scale(1, scaleFactor, 1))
             .times(Mat4.translation(-1, 1, 0));
        this.ExtraCredit1Flag? this.draw_triangle_strip(context, program_state, model_transform, 0): this.draw_box(context, program_state, model_transform, 0);
        for (let i = 1; i < 8; i++) {
            model_transform = model_transform.times(Mat4.translation(1, 1, 0))
                .times(Mat4.rotation(curAngle, 0, 0, -1))
                .times(Mat4.translation(-1, 1, 0));
            this.OutlineFlag? this.draw_outline(context, program_state, model_transform) : this.draw_box(context, program_state, model_transform, i);
        }                       
    }
}
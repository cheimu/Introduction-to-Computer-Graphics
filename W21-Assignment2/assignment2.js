import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong, ExtraCredit} = defs

export class Assignment2 extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        this.shapes = {
            box_1: new Cube(),
            box_2: new Cube(),
            axis: new Axis_Arrows(),
            extra_credit: new ExtraCredit()
        }
        console.log(this.shapes.box_1.arrays.texture_coord)
        this.shapes.box_2.arrays.texture_coord.forEach(p => p.scale_by(2));


        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials = {
            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
            }),
            texture: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/stars.png")
            }),
            text: new Material(new Texture_Rotate(), {
                color: color(0, 0, 1, 1),
                ambient: .6, diffusivity: 0.2, specularity: 0.2,
                texture: new Texture("assets/text.png", "NEAREST")
            }),
            star: new Material(new Texture_Scroll_X(), {
                color: color(1, 1, 1, 1),
                ambient: .4, diffusivity: 0.2, specularity: 0.3,
                texture: new Texture("assets/stars.png", "LINEAR_MIPMAP_LINEAR")
            }),
            rgb: new Material(new Textured_Phong(), {
                color: color(1, 1, 1, 1),
                ambient: .4, diffusivity: 0.2, specularity: 0.3,
                texture: new Texture("assets/rgb.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
        }
        
        this.box_1 = {};
        this.box_2 = {};
        this.extra = {};
        this.angle_1 = 0;
        this.angle_2 = 0;
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
         this.key_triggered_button("Rotate", ["c"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
            this.RotationFlag ^= 1;
        });
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -10));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_position = vec4(10, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        // let model_transform = Mat4.identity();

        // TODO:  Draw the required boxes. Also update their stored matrices.
        //this.shapes.axis.draw(context, program_state, model_transform, this.materials.phong.override({color: hex_color("#ffff00")}));
        if (this.RotationFlag) {
            this.angle_1 += dt * Math.PI;
            this.angle_2 += dt * Math.PI * 2 / 3;
        }
        /* box 1 */
        //const angle_1 = 30*2*Math.PI/60;
        this.box_1.transform = Mat4.identity();
        this.box_1.transform = this.box_1.transform.times(Mat4.translation(-2, 0, 0));
        this.box_1.transform = this.box_1.transform.times(Mat4.rotation(this.angle_1, 1, 0, 0));
        //if (this.RotationFlag) this.box_1.transform = this.box_1.transform.times(Mat4.rotation(angle_1*t, 1, 0, 0)); 
        this.shapes.box_1.draw(context, program_state, this.box_1.transform, this.materials.text );

        /* box 2 */
        //const angle_2 = 20*2*Math.PI/60;
        this.box_2.transform = Mat4.identity();
        //if (this.RotationFlag) this.box_2.transform = this.box_2.transform.times(Mat4.rotation(angle_2*t, 0, 1, 0)); 
        this.box_2.transform = this.box_2.transform.times(Mat4.translation(2, 0, 0));
        this.box_2.transform = this.box_2.transform.times(Mat4.rotation(this.angle_2, 0, 1, 0));
        this.shapes.box_2.draw(context, program_state, this.box_2.transform, this.materials.star );

        /* extra_credit */
        this.extra.transform = Mat4.identity().times(Mat4.translation(0, -3.5, 0)).times(Mat4.scale(0.3, 0.3, 0.3));
        this.shapes.extra_credit.draw(context, program_state, this.extra.transform, this.materials.rgb );

    }
}


class Texture_Scroll_X extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #6.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec2 curr_coord = vec2(f_tex_coord.x-animation_time*2.0, f_tex_coord.y);
                vec4 tex_color = texture2D( texture, curr_coord);
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}


class Texture_Rotate extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // Sample the texture image in the correct place:
                float pi = 3.1415926;
                float angle = 15.0 * 2.0 * pi * animation_time / (60.0);
                mat2 rotation_m = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
                // model*translation*rotation*-translation
                vec2 curr_coord = rotation_m * (f_tex_coord-0.5) + 0.5 ;
                vec4 tex_color = texture2D( texture, curr_coord);
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}


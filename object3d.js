class Object3D {

    /**
     * Create a new 3D object
     * @param {Render3D} render
     * @param {number[][]} vertices
     * @param {number[][]}faces
     * @param {number[][]}materials
     */
    constructor(render, vertices = [], faces = [], materials = []) {
        this.render = render;
        this.vertices = vertices;
        this.faces = faces;
        this.materials = materials;
        // Move the object slightly to avoid division by zero
        this.colorFaces = this.faces.map(face => {
            let color = face[face.length - 1];
            let onlyFaces = face.slice(0, face.length - 1);
            return {color: color, face: onlyFaces}
        });
        this.drawer = new ObjectDrawer(this.render, this.colorFaces, this.materials);
        this.objMovement = new ObjectMovementSimple(this);
        this.objMovement.translate([0.0001, 0.0001, 0.0001]);
    }

    /**
     * Draw the object
     */
    draw() {
        const vertices = this.screenProjectionCalc();
        this.drawer.drawObj(vertices)
        this.objMovement.animate();
    }



    /**
     * Divide the vertices by the homogeneous coordinate
     * This operation is known as homogeneous division or perspective division, and it's a common step in the process
     * of projecting 3D points onto a 2D screen in computer graphics. It essentially converts the homogeneous coordinates
     * back to regular 3D coordinates.
     * @param {number[][]} vertices
     * @returns {number[][]}
     */
    #homogeneousDivision(vertices) {
        return vertices.map(vertex => {
            const w = vertex[3];
            return vertex.map(value => value / w);
        });
    }


    /**
     * Project the 3D object to the 2D screen
     *
     * @returns {number[][]}
     */
    screenProjectionCalc() {
        const cameraStateMatrix = this.render.camera.getCameraStateMatrix();
        // console.log(cameraStateMatrix)
        let vertices = matMulti(this.vertices, cameraStateMatrix);
        // Project the vertices to the 2D screen
        vertices = matMulti(vertices, this.render.projection.get2DProjectionMatrix());
        vertices = this.#homogeneousDivision(vertices);
        // Clip the vertices to 2x the screen size
        vertices = vertices.map(value => value > 2 || value < -2 ? 0 : value);
        // Denormalize the vertices to the screen size
        vertices = matMulti(vertices, this.render.projection.getScreenDenormalizeMatrix());

        for (let i = 0; i < vertices.length; i++) {
            // Remove the z and homogeneous coordinate. We only need the x and y coordinates.
            vertices[i] = vertices[i].slice(0, 2);
        }
        return vertices;
    }


}
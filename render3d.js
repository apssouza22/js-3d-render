
class Render3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.WIDTH = this.canvas.clientWidth;
        this.HEIGHT = this.canvas.clientHeight;
        this.HALF_WIDTH = this.WIDTH / 2;
        this.HALF_HEIGHT = this.HEIGHT / 2;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.mouseControl = new MouseControl(this.canvas);
        this.camera = new Camera3d(this, new CameraPosition(0.5, 1, -10));
        this.projection = new Projection(this);
    }

    setCameraZoom(depth) {
        this.camera.position = [this.camera.position[0], this.camera.position[1], depth, 1.0];
    }

    loadObject3d(file) {
        /** @type {Object3D} **/
        this.object = this.getObjectFromFile(file);
    }

    /**
     * Get the object vertices from the obj file
     * @param {string} file
     * @return {Object3D}
     */
    getObjectFromFile(file) {
        let objectReader = new ObjectReader();
        const objData = objectReader.readObjFile(file);
        const material = objectReader.readMtlFile(file);
        const dataHandler = new ObjDataHandler();
        objData.vert = dataHandler.addHomogeneous(objData.vert)
        let faces = dataHandler.sortFaces(objData.face, objData.vert);
        return new Object3D(this, objData.vert, faces, material);
    }

    draw() {
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.object.draw();
    }

    /**
     * Start the render loop
     */
    run() {
        const loop = () => {
            this.draw();
            requestAnimationFrame(loop);
        };
        loop();
    }
}
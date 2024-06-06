
class Render3D {
    constructor(canvas, objFile) {
        this.canvas = canvas;
        this.objFile = objFile;
        this.WIDTH = this.canvas.clientWidth;
        this.HEIGHT = this.canvas.clientHeight;
        this.HALF_WIDTH = this.WIDTH / 2;
        this.HALF_HEIGHT = this.HEIGHT / 2;
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.mouseControl = new MouseControl(this.canvas);
        this.createObjects();
    }

    createObjects() {
        this.camera = new Camera3d(this, new CameraPosition(0.5, 1, -10));
        this.projection = new Projection(this);
        /** @type {Object3D} **/
        this.object = this.getObjectFromFile(this.objFile);
        this.object.rotateY(-Math.PI / 4);
    }

    /**
     * @param {string} file
     * @return {Object3D}
     */
    getObjectFromFile(file) {
        let objectReader = new ObjectReader(canvas);
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

    run(fn) {
        const loop = () => {
            // fn();
            this.draw();
            requestAnimationFrame(loop);
        };
        loop();
    }
}
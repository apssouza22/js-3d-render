/**
 * Two classes for moving objects in 3D space.
 * The first class uses simple mathematical operations to move the object.
 * The second class uses matrix multiplication to move the object.
 */

class ObjectMovementSimple {

    /** @type {Object3D} */
    object3D;
    rotationSpeed = 90; //Smaller = faster. 100 is a good speed
    zoomSpeed = 0.0161; //0-1. 0.2 or 0.3 are good speeds
    moveSpeed = 0.01;
    animateFlag = true;

    constructor(object3D) {
        this.object3D = object3D;
        this.mouseControl = new MouseControl(this);
        this.mouseControl.addEventListener();
    }

    translate(pos) {
        this.object3D.vertices = this.object3D.vertices.map(vertex => {
            return [vertex[0] + pos[0], vertex[1] + pos[1], vertex[2] + pos[2], vertex[3]];
        });
    }

    animate() {
        if (this.animateFlag && !this.mouseControl.mouseDown) {
            this.rotateY(-(Date.now() % 0.005) * this.rotationSpeed);
            this.rotateX(-(Date.now() % 0.005) * this.rotationSpeed);
        }
    }

    moveHorizontal(distanceX) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][0] = this.object3D.vertices[i][0] + distanceX * this.moveSpeed;
        }
    }

    moveVertical(distanceY) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][1] = this.object3D.vertices[i][1] + distanceY * this.moveSpeed;
        }
    }

    rotateY(angle) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            let x = this.object3D.vertices[i][0];
            let z = this.object3D.vertices[i][2];
            this.object3D.vertices[i][0] = x * Math.cos(angle / this.rotationSpeed) - z * Math.sin(angle / this.rotationSpeed);
            this.object3D.vertices[i][2] = z * Math.cos(angle / this.rotationSpeed) + x * Math.sin(angle / this.rotationSpeed);
        }
    }

    rotateX(angle) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            let y = this.object3D.vertices[i][1];
            let z = this.object3D.vertices[i][2];
            this.object3D.vertices[i][1] = y * Math.cos(angle / this.rotationSpeed) - z * Math.sin(angle / this.rotationSpeed);
            this.object3D.vertices[i][2] = z * Math.cos(angle / this.rotationSpeed) + y * Math.sin(angle / this.rotationSpeed);
        }
    }

    zoom(val) {
        let scale = 1 + val * this.zoomSpeed;
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][0] = this.object3D.vertices[i][0] * scale;
            this.object3D.vertices[i][1] = this.object3D.vertices[i][1] * scale;
            this.object3D.vertices[i][2] = this.object3D.vertices[i][2] * scale;
        }
    }
}

class ObjectMovementMatrix {

    /** @type {Object3D} */
    object3D;
    rotationSpeed = 90; //Smaller = faster. 100 is a good speed
    zoomSpeed = 0.0161; //0-1. 0.2 or 0.3 are good speeds
    moveSpeed = 0.01;
    movementFlag = true;

    constructor(object3D) {
        this.object3D = object3D;
        this.mouseControl = new MouseControl(this);
        this.mouseControl.addEventListener();
    }

    move() {
        if (this.movementFlag && !this.mouseControl.mouseDown) {
            this.rotateY(-(Date.now() % 0.005) * this.rotationSpeed);
            this.rotateX(-(Date.now() % 0.005) * this.rotationSpeed);
        }
    }

    moveHorizontal(distanceX) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][0] = this.object3D.vertices[i][0] + distanceX * this.moveSpeed;
        }
    }

    moveVertical(distanceY) {
        for (let i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][1] = this.object3D.vertices[i][1] + distanceY * this.moveSpeed;
        }
    }

    /**
     * Translate the object to a new position
     * @param pos
     */
    translate(pos) {
        this.object3D.vertices = matMulti(this.object3D.vertices, translate(pos));
    }

    /**
     * Scale the object to a new size [0-1]
     * @param {float} val
     */
    zoom(val) {
        let scaleTo = 1 + val * this.zoomSpeed;
        this.object3D.vertices = matMulti(this.object3D.vertices, scale(scaleTo));
    }

    /**
     * Rotate the object around the x-axis
     * @param angle
     */
    rotateX(angle) {
        this.object3D.vertices = matMulti(this.object3D.vertices, rotateX(angle / this.rotationSpeed));
    }

    /**
     * Rotate the object around the y-axis
     * @param angle
     */
    rotateY(angle) {
        this.object3D.vertices = matMulti(this.object3D.vertices, rotateY(angle / this.rotationSpeed));
    }

    /**
     * Rotate the object around the z-axis
     * @param angle
     */
    rotateZ(angle) {
        this.vertices = matMulti(this.vertices, rotateZ(angle / this.rotationSpeed));
    }

}

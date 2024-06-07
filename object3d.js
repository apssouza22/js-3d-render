class ObjectMovement {
    /** @type {Object3D} */
    object3D;
    rotationSpeed = 90; //Smaller = faster. 100 is a good speed
    zoomSpeed = 0.161; //0-1. 0.2 or 0.3 are good speeds
    moveSpeed = .5;
    movementFlag = true;
    mouseDown = false;
    constructor(object3D) {
        this.object3D = object3D;
        this.addEventListener()   
    }

    move() {
        if (this.movementFlag && !this.mouseDown) {
            console.log("moving ")
            this.rotateY(-(Date.now() % 0.005));
            this.rotateX(-(Date.now() % 0.005));
        }
    }

    addEventListener() {
        let pX = null;
        let pY = null;
        let mDown = this.mouseDown;
        let canvas = this.object3D.render.canvas;
        let thisObJS = this;
        let pinchScale = 0;
        let pinch = false;
        canvas.addEventListener('mousedown', function (e) {}).bind(this);
        canvas.onmousedown = function (e) {
            pX = e.offsetX === undefined ? e.layerX : e.offsetX;
            pY = e.offsetY === undefined ? e.layerY : e.offsetY;
            mDown = true;
        };

        canvas.onmouseup = function (e) {
            pX = null;
            pY = null;
            mDown = false;
        };

        canvas.onmousemove = function (e) {
            if (!mDown) {
                return;
            }
            let x = e.offsetX === undefined ? e.layerX : e.offsetX;
            let y = e.offsetY === undefined ? e.layerY : e.offsetY;
            if (e.shiftKey) {
                thisObJS.moveHorizontal(x - pX);
                thisObJS.moveVertical(y - pY);
            } else {
                thisObJS.rotateY(x - pX);
                thisObJS.rotateX(y - pY);
            }
            pX = x;
            pY = y;
            return false;
        };

        canvas.onmouseout = function (e) {
            if (mDown) {
                mDown = false;
            }
        }

        canvas.addEventListener('mousewheel', function (e) {
            e.preventDefault();
            if (event.wheelDelta > 0) {
                thisObJS.zoom(1);
            } else {
                thisObJS.zoom(-1);
            }
            return false;
        }, false);

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 2) {
                pinch = true;
                pinchScale = thisObJS.getPinchScale(e);
            }
            return false;
        }, false);

        canvas.addEventListener('touchend', function (e) {
            if (pinch) {
                pinch = false;
            }
            return false;
        }, false);

        canvas.addEventListener('touchcancel', function (e) {
            if (pinch) {
                pinch = false;
            }
            return false;
        }, false);

        canvas.addEventListener('touchleave', function (e) {
            if (pinch) {
                pinch = false;
            }
            return false;
        }, false);

        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (pinch) {
                let dist = thisObJS.getPinchScale(e);
                if (dist > pinchScale) {
                    thisObJS.zoom(1);
                } else if (dist < pinchScale) {
                    thisObJS.zoom(-1);
                }
                pinchScale = dist;
            } else {
                let x = e.touches[0].clientX
                let y = e.touches[0].clientY;
                thisObJS.rotateY(x - pX);
                thisObJS.rotateX(y - pY);
                pX = x;
                pY = y;
            }
            return false;
        }, false);
    }

    /**
     * The getPinchScale function is used to calculate the distance between two touch points on a touch screen.
     * used in a pinch-to-zoom functionality on mobile devices.
     * @param e
     * @returns {number}
     */
    getPinchScale(e) {
        return Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
    }

    moveHorizontal(des) {
        for (var i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][0] = (this.object3D.vertices[i][0] * 1) + des * (this.moveSpeed / 50);
        }
    }

    moveVertical(des) {
        for (var i = 0; i < this.object3D.vertices.length; i++) {
            this.object3D.vertices[i][1] = (this.object3D.vertices[i][1] * 1) + des * (this.moveSpeed / 50);
        }
    }

    rotateY(des) {
        for (var i = 0; i < this.object3D.vertices.length; i++) {
            var x = this.object3D.vertices[i][0];
            var z = this.object3D.vertices[i][2];
            this.object3D.vertices[i][0] = x * Math.cos(des / this.rotationSpeed) - z * Math.sin(des / this.rotationSpeed);
            this.object3D.vertices[i][2] = z * Math.cos(des / this.rotationSpeed) + x * Math.sin(des / this.rotationSpeed);
        }
    }

    rotateX(des) {
        for (var i = 0; i < this.object3D.vertices.length; i++) {
            var y = this.object3D.vertices[i][1];
            var z = this.object3D.vertices[i][2];
            this.object3D.vertices[i][1] = y * Math.cos(des / this.rotationSpeed) - z * Math.sin(des / this.rotationSpeed);
            this.object3D.vertices[i][2] = z * Math.cos(des / this.rotationSpeed) + y * Math.sin(des / this.rotationSpeed);
        }
    }

    zoom(val) {
        this.scale = this.scale + val * this.scale * this.zoomSpeed;
    }
}

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
        this.translate([0.0001, 0.0001, 0.0001]);
        this.colorFaces = this.faces.map(face => {
            let color = face[face.length - 1];
            let onlyFaces = face.slice(0, face.length - 1);
            return {color: color, face: onlyFaces}
        });
        this.movementFlag = true;
        this.drawer = new ObjectDrawer(this.render, this.colorFaces, this.materials);
        this.objMovement = new ObjectMovement(this);
    }

    /**
     * Draw the object
     */
    draw() {
        const vertices = this.screenProjectionCalc();
        this.drawer.drawObj(vertices)
        this.objMovement.move();
    }

    /**
     * Move the object
     */
    move() {
        // if (this.movementFlag) {
        //     this.rotateY(-(Date.now() % 0.005));
        //     this.rotateX(-(Date.now() % 0.005));
        //     return
        // }
        // Multiplies the ratios by Math.PI to convert it to radians
        // const roll = (this.render.mouseControl.drag.offset.x / this.render.canvas.width) * Math.PI;
        // const pitch = (this.render.mouseControl.drag.offset.y / this.render.canvas.height) * Math.PI;
        // this.rotateY(roll);
        // this.rotateX(pitch);
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


    /**
     * Translate the object to a new position
     * @param pos
     */
    translate(pos) {
        this.vertices = matMulti(this.vertices, translate(pos));
    }

    /**
     * Scale the object to a new size [0-1]
     * @param {float} scaleTo
     */
    scale(scaleTo) {
        this.vertices = matMulti(this.vertices, scale(scaleTo));
    }

    /**
     * Rotate the object around the x-axis
     * @param angle
     */
    rotateX(angle) {
        this.vertices = matMulti(this.vertices, rotateX(angle));
    }

    /**
     * Rotate the object around the y-axis
     * @param angle
     */
    rotateY(angle) {
        this.vertices = matMulti(this.vertices, rotateY(angle));
    }

    /**
     * Rotate the object around the z-axis
     * @param angle
     */
    rotateZ(angle) {
        this.vertices = matMulti(this.vertices, rotateZ(angle));
    }
}
class ObjectMovementSimple {

    /** @type {Object3D} */
    object3D;
    rotationSpeed = 90; //Smaller = faster. 100 is a good speed
    zoomSpeed = 0.0161; //0-1. 0.2 or 0.3 are good speeds
    moveSpeed = 0.01;
    movementFlag = false;
    mouseDown = false;
    pinch = false;

    constructor(object3D) {
        this.object3D = object3D;
        const mouseControl = new MouseControl(this);
        mouseControl.addEventListener();
    }

    move() {
        if (this.movementFlag && !this.mouseDown) {
            this.rotateY(-(Date.now() % 2));
            this.rotateX(-(Date.now() % 2));
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
    movementFlag = false;
    mouseDown = false;
    pinch = false;

    constructor(object3D) {
        this.object3D = object3D;
        this.addEventListener()
    }

    move() {
        if (this.movementFlag && !this.mouseDown) {
            this.rotateY(-(Date.now() % 2));
            this.rotateX(-(Date.now() % 2));
        }
    }

    addEventListener() {
        this.object3D.render.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.object3D.render.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.object3D.render.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.object3D.render.canvas.addEventListener('onmouseout', this.onMouseOut.bind(this))
        this.object3D.render.canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this));
        this.object3D.render.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.object3D.render.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.object3D.render.canvas.addEventListener('touchcancel', this.onTouchEnd.bind(this));
        this.object3D.render.canvas.addEventListener('touchleave', this.onTouchEnd.bind(this));
        this.object3D.render.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    onMouseWheel(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            this.zoom(1);
        } else {
            this.zoom(-1);
        }
    }

    onTouchStart(e) {
        if (e.touches.length === 2) {
            this.pinch = true;
            this.pinchScale = this.getPinchScale(e);
        }
    }

    onTouchEnd() {
        if (this.pinch) {
            this.pinch = false;
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        if (this.pinch) {
            let dist = this.getPinchScale(e);
            if (dist > this.pinchScale) {
                this.zoom(1);
            } else if (dist < this.pinchScale) {
                this.zoom(-1);
            }
            this.pinchScale = dist;
            return
        }
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY;
        this.rotateY(x - this.pX);
        this.rotateX(y - this.pY);
        this.pX = x;
        this.pY = y;

    }

    onMouseOut() {
        if (this.mouseDown) {
            this.mouseDown = false;
        }
    }

    onMouseMove(e) {
        if (!this.mouseDown) {
            return;
        }
        let x = e.offsetX === undefined ? e.layerX : e.offsetX;
        let y = e.offsetY === undefined ? e.layerY : e.offsetY;
        let distanceX = x - this.pX;
        let distanceY = y - this.pY;
        if (e.shiftKey) {
            this.moveHorizontal(distanceX);
            this.moveVertical(distanceY);
        } else {
            this.rotateY(distanceX);
            this.rotateX(distanceY);
        }
        console.log(distanceX, distanceY)
        this.pX = x;
        this.pY = y;
        return false;
    }

    onMouseUp(e) {
        this.pX = null;
        this.pY = null;
        this.mouseDown = false;
    }

    onMouseDown(e) {
        this.pX = e.offsetX === undefined ? e.layerX : e.offsetX;
        this.pY = e.offsetY === undefined ? e.layerY : e.offsetY;
        this.mouseDown = true;
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

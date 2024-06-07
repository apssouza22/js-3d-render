class MouseControl {
    mouseDown = false;
    pinch = false;

    constructor(objectMovement) {
        this.objectMovement = objectMovement;
        this.canvas = objectMovement.object3D.render.canvas;
    }

    addEventListener() {
        this.canvas.addEventListener('mousedown', this.#onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.#onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.#onMouseMove.bind(this));
        this.canvas.addEventListener('onmouseout', this.#onMouseOut.bind(this))
        this.canvas.addEventListener('mousewheel', this.#onMouseWheel.bind(this));
        this.canvas.addEventListener('touchstart', this.#onTouchStart.bind(this));
        this.canvas.addEventListener('touchend', this.#onTouchEnd.bind(this));
        this.canvas.addEventListener('touchcancel', this.#onTouchEnd.bind(this));
        this.canvas.addEventListener('touchleave', this.#onTouchEnd.bind(this));
        this.canvas.addEventListener('touchmove', this.#onTouchMove.bind(this));
    }

    #onMouseWheel(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            this.objectMovement.zoom(1);
        } else {
            this.objectMovement.zoom(-1);
        }
    }

    #onTouchStart(e) {
        if (e.touches.length === 2) {
            this.pinch = true;
            this.pinchScale = this.#getPinchScale(e);
        }
    }

    #onTouchEnd() {
        if (this.pinch) {
            this.pinch = false;
        }
    }

    #onTouchMove(e) {
        e.preventDefault();
        if (this.pinch) {
            let dist = this.#getPinchScale(e);
            if (dist > this.pinchScale) {
                this.objectMovement.zoom(1);
            } else if (dist < this.pinchScale) {
                this.objectMovement.zoom(-1);
            }
            this.pinchScale = dist;
            return
        }
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY;
        this.objectMovement.rotateY(x - this.pX);
        this.objectMovement.rotateX(y - this.pY);
        this.pX = x;
        this.pY = y;

    }

    #onMouseOut() {
        if (this.mouseDown) {
            this.mouseDown = false;
        }
    }

    #onMouseMove(e) {
        if (!this.mouseDown) {
            return;
        }
        let x = e.offsetX === undefined ? e.layerX : e.offsetX;
        let y = e.offsetY === undefined ? e.layerY : e.offsetY;
        let distanceX = x - this.pX;
        let distanceY = y - this.pY;
        if (e.shiftKey) {
            this.objectMovement.moveHorizontal(distanceX);
            this.objectMovement.moveVertical(distanceY);
        } else {
            this.objectMovement.rotateY(distanceX);
            this.objectMovement.rotateX(distanceY);
        }
        this.pX = x;
        this.pY = y;
        return false;
    }

    #onMouseUp(e) {
        this.pX = null;
        this.pY = null;
        this.mouseDown = false;
    }

    #onMouseDown(e) {
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
    #getPinchScale(e) {
        return Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
    }

}
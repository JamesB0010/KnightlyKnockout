//credits https://www.youtube.com/watch?v=oqKzxPMLWxo
const startBlock = new Event("startBlock");
const endBlock = new Event("endBlock");
const spacePressed = new Event("Insult");
class InputController {
    constructor() {
        this.initialise_();
    }

    initialise_() {
        this.current_ = {
            leftButton: false,
            leftButtonDownTimer: 0,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0
        };
        this.previous_ = null;
        this.keys_ = {};
        this.previousKeys = {};
        this.touchDown = false;
        this.prevTouchDown = false;
        this.timeSinceLastAttack = 0.0;

        //add event listeners for mousemove events

        //credits for the if statement https://github.com/bobboteck/JoyStick/blob/master/joy.js
        if ("ontouchstart" in document.documentElement) {

        }
        else {
            document.addEventListener("mousedown", e => this.onMouseDown_(e), false);
            document.addEventListener("mouseup", e => this.onMouseUp_(e), false);
            document.addEventListener("mousemove", e => this.onMouseMove_(e), false);
            document.addEventListener("keydown", e => this.onKeyDown_(e), false);
            document.addEventListener("keyup", e => this.onKeyUp_(e), false);
            document.getElementById("attackIconWrapper").style["display"] = "none";
            document.getElementById("joy1Div").style["display"] = "none";
            document.getElementById("blockIconWrapper").style["display"] = "none";
        }

        window.addEventListener('touchstart', e => {
            this.prevTouchDown = this.touchDown;
            this.touchDown = true;
            //console.log(e.target);
            if (e.target == document.getElementById("attackIconWrapper") || e.target == document.getElementById("attackIcon")) {
                e.preventDefault();
                e.button = 0;
                this.onMouseDown_(e);
            }
            else if (e.target == document.getElementById("blockIconWrapper") || e.target == document.getElementById("blockIcon")) {
                e.preventDefault();
                e.button = 2;
                this.onMouseDown_(e);
            }
        })

        window.addEventListener('touchend', e => {
            this.prevTouchDown = this.touchDown;
            this.touchDown = false;
            //console.log(this.touchDown);
            if (e.target == document.getElementById("attackIconWrapper") || e.target == document.getElementById("attackIcon")) {
                e.button = 0;
                this.onMouseUp_(e);
            }
            else if (e.target == document.getElementById("blockIconWrapper") || e.target == document.getElementById("blockIcon")) {
                e.button = 2;
                this.onMouseUp_(e);
            }
        })

        window.addEventListener('touchmove', e => {
            if (e.target != document.getElementById("joystick")) {
                this.onTouchMove(e);
            }
        })
    };

    onMouseDown_(e) {
        switch (e.button) {
            case 0: {
                this.current_.leftButton = true;
                break;
            }
            case 2: {
                this.current_.leftButton = false;
                document.dispatchEvent(startBlock);
                //console.log("start blocking");
                break;
            }
        }
    };
    onMouseUp_(e) {
        switch (e.button) {
            case 0: {
                if (this.timeSinceLastAttack < 2.5) {
                    this.current_.leftButton = false;
                    this.current_.leftButtonDownTimer = 0;
                    return;
                }
                let attackTypeThreshold = 0.5;
                const attack = new CustomEvent("Attack", { detail: { attackName: this.current_.leftButtonDownTimer >= attackTypeThreshold ? "heavyAttack" : "lightAttack" } });
                document.dispatchEvent(attack);
                this.timeSinceLastAttack = 0.0;
                this.current_.leftButton = false;
                this.current_.leftButtonDownTimer = 0;
                break;
            }
            case 2: {
                this.current_.leftButton = false;
                document.dispatchEvent(endBlock);
                //console.log("end blocking");
                break;
            }
        }
    };
    onMouseMove_(e) {
        this.current_.mouseX += e.movementX;
        this.current_.mouseY += e.movementY;

        if (this.previous_ === null) {
            this.previous_ = { ...this.current_ };
        }

        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    };

    onTouchMove(e) {
        let touch = e.touches[0];

        let lastMovementX = this.current_.mouseX;
        let lastMovementY = this.current_.mouseY;


        let movementX = touch.screenX;
        let movementY = touch.screenY;


        let differenceX = movementX - lastMovementX;
        let differenceY = movementY - lastMovementY;

        this.current_.mouseX = movementX;
        this.current_.mouseY = movementY;

        if (this.previous_ === null) {
            this.previous_ = { ...this.current_ };
        }

        if (this.prevTouchDown == false && this.touchDown == true) {
            this.current_.mouseXDelta = 0;
            this.current_.mouseYDelta = 0;
            this.prevTouchDown = true;
        }
        else {
            this.current_.mouseXDelta = differenceX;
            this.current_.mouseYDelta = differenceY;
        }
    }
    onKeyDown_(e) {
        this.keys_[e.keyCode] = true;
        if (e.keyCode == 32) {
            document.dispatchEvent(spacePressed);
        }
    };
    onKeyUp_(e) {
        this.keys_[e.keyCode] = false;
    };

    update(deltaTime) {
        if (this.previous_ !== null) {
            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

            this.previous_ = { ...this.current_ };
        }
        if (this.current_.leftButton) {
            this.current_.leftButtonDownTimer += deltaTime;
        }
        if (this.timeSinceLastAttack < 3) {
            this.timeSinceLastAttack += deltaTime;
        }
    }

    key(keyCode) {
        return !!this.keys_[keyCode];
    }
}

export { InputController };
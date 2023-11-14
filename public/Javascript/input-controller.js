//credits https://www.youtube.com/watch?v=oqKzxPMLWxo
const startBlock = new Event("startBlock");
const endBlock = new Event("endBlock");
const spacePressed = new Event("Insult");
class InputController{
    constructor(){
        this.initialise_();
    }

    initialise_(){
        this.current_ = {
            leftButton: false,
            leftButtonDownTimer: 0,
            rightButton: false,
            mouseX: 0,
            mouseY:0,
            mouseXDelta: 0,
            mouseYDelta: 0
        };
        this.previous_ = null;
        this.keys_ = {};
        this.previousKeys = {};

        //add event listeners for mousemove events

        document.addEventListener("mousedown", e => this.onMouseDown_(e), false);
        document.addEventListener("mouseup", e => this.onMouseUp_(e), false);
        document.addEventListener("mousemove", e => this.onMouseMove_(e), false);
        document.addEventListener("keydown", e => this.onKeyDown_(e), false);
        document.addEventListener("keyup", e => this.onKeyUp_(e), false);
    };

    onMouseDown_(e){
        switch(e.button){
            case 0:{
                this.current_.leftButton = true;
                break;
            }
            case 2:{
                this.current_.leftButton = true;
                document.dispatchEvent(startBlock);
                break;
            }
        }
    };
    onMouseUp_(e){
        switch(e.button){
            case 0:{
                let attackTypeThreshold = 0.3;
                const attack = new CustomEvent("Attack", {detail: {attackAnimIndex: this.current_.leftButtonDownTimer >= attackTypeThreshold? 4: 7}});
                this.current_.leftButton = false;
                this.current_.leftButtonDownTimer = 0;
                document.dispatchEvent(attack);
                break;
            }
            case 2:{
                this.current_.leftButton = false;
                document.dispatchEvent(endBlock);
                break;
            }
        }
    };
    onMouseMove_(e){
        this.current_.mouseX += e.movementX;
        this.current_.mouseY += e.movementY;

        if (this.previous_ === null){
            this.previous_ = {...this.current_};
        }

        this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
        this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
    };
    onKeyDown_(e){
        this.keys_[e.keyCode] = true;
        if(e.keyCode == 32){
            document.dispatchEvent(spacePressed);
        }
    };
    onKeyUp_(e){
        this.keys_[e.keyCode] = false;
    };

    update(deltaTime){
        if(this.previous_ !== null){
            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

            this.previous_ = {...this.current_};
        }
        if(this.current_.leftButton){
            this.current_.leftButtonDownTimer += deltaTime;
        }
    }

    key(keyCode){
        return !!this.keys_[keyCode];
    }
}

export {InputController};
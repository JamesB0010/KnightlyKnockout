//credits https://www.youtube.com/watch?v=oqKzxPMLWxo
const lightAttackDown = new Event("lightAttack");
const heavyAttack = new Event("HeavyAttack");
class InputController{
    constructor(){
        this.initialise_();
    }

    initialise_(){
        this.current_ = {
            leftButton: false,
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
                document.dispatchEvent(lightAttackDown);
                break;
            }
            case 2:{
                this.current_.leftButton = true;
                document.dispatchEvent(heavyAttack);
                break;
            }
        }
    };
    onMouseUp_(e){
        switch(e.button){
            case 0:{
                this.current_.leftButton = false;
                break;
            }
            case 2:{
                this.current_.leftButton = false;
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
    };
    onKeyUp_(e){
        this.keys_[e.keyCode] = false;
    };

    update(){
        if(this.previous_ !== null){
            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

            this.previous_ = {...this.current_};
        }
    }

    key(keyCode){
        return !!this.keys_[keyCode];
    }
}

export {InputController};
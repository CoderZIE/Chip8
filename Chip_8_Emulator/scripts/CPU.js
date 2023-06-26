

class CPU{
    constructor(renderer, keyboard,speaker){
        this.renderer = renderer;
        this.speaker = speaker;
        this.keyboard = keyboard;

        //initializing 4k bytes of memory
        this.memory = new Uint8Array(4096);

        //initializing 16 8-bit registers
        this.V = new Uint8Array(16);

        //intializing the index register
        this.indexRegister = 0;

        //initializing the timer registers
        this.delayTimer = 0;
        this.soundTimer = 0;

        //initializing the program counter
        this.programCounter = 0x200;

        //initializing the stack pointer
        this.stack= new Array();

        //initializing the pausing state
        this.paused = false;

        this.speed = 10;

        
       

    }

    //loading spirites into memory
    loadSpiritesIntoMemory(){

        //we have 16 sprites each of 5 bytes

        const sprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ]

        //loading the spirts into the memory in the range 0x000 to 0x1FF(interpreter area)
        for(let i=0;i<sprites.length;i++){
            this.memory[i]=sprites[i];
        }

    }

    //loading the program into the memory from location 0x200
    loadProgramIntoMemory(program){
        for(let i=0;i<program.length;i++){
            this.memory[0x200+i]=program[i];
        }
    }

    //loading the ROM 
    loadROM(romName){
        var request = new XMLHttpRequest();
        var self = this;

        request.onload = function(){

            //if request has content
            if(request.response){}
                 // Store the contents of the response in an 8-bit array
                let program = new Uint8Array(request.response);

                // Load the ROM/program into memory
                self.loadProgramIntoMemory(program);
        }

        //initializing the request
        request.open('GET', 'roms/' + romName);

        request.responseType = 'arraybuffer';

        // Send the request to the server
        request.send();

        
    }

    //emulating one cycle of the CPU
    cycle(){
        for(let i=0;i<this.speed;i++){
            if(!this.paused){
                //fetching the opcode

                //big endian
                let opcode = this.memory[this.programCounter]<<8 | this.memory[this.programCounter+1];

                //executing the opcode
                this.executeOpcode(opcode);
            }
        }

        //updating the timers
        if(!this.paused){
            this.updateTimer();
        }

        this.playSound();
        this.renderer.render();

    }

    //update the timers
    updateTimer(){
        if(this.delayTimer>0){
            this.delayTimer--;
        }

        if(this.soundTimer>0){
            this.soundTimer--;
        }

    }

    playSound() {
        if (this.soundTimer > 0) {
            this.speaker.play(440);
        } else {
            this.speaker.stop();
        }
    }

    
    //executing the instruction opcode
    executeOpcode(opcode){

        //incrementing the program counter
        this.programCounter+=2;

        //extracting the nibbles from the opcode
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;

        switch (opcode & 0xF000) {
            case 0x0000:
                switch (opcode) {
                    case 0x00E0: //clear the screen
                        this.renderer.clear();
                        break;
                    case 0x00EE: //return from subroutine
                        this.programCounter = this.stack.pop();
                        break;
                }
        
                break;
            case 0x1000: //jump to address
                this.programCounter = opcode & 0x0FFF;
                break;
            case 0x2000: //call subroutine
                this.stack.push(this.programCounter);
                this.programCounter = opcode & 0x0FFF;
                break;
            case 0x3000: //skip next instruction if Vx = kk
                if (this.V[x] === (opcode & 0x00FF)) {
                    this.programCounter += 2;
                }
                break;
            case 0x4000: //skip next instruction if Vx != kk
                if (this.V[x] !== (opcode & 0x00FF)) {
                    this.programCounter += 2;
                }
                break;  
            case 0x5000: //skip next instruction if Vx = Vy
                if (this.V[x] === this.V[y]) {
                    this.programCounter += 2;
                }
                break;
            case 0x6000: //set Vx = kk
                this.V[x] = opcode & 0x00FF;
                break;
            case 0x7000: //set Vx = Vx + kk
                this.V[x] += opcode & 0x00FF;
                break;
            case 0x8000:
                switch (opcode & 0xF) {
                    case 0x0:   //set Vx = Vy
                        this.V[x] = this.V[y];
                        break;
                    case 0x1:  //set Vx = Vx OR Vy
                        this.V[x] |= this.V[y];
                        break;
                    case 0x2: //set Vx = Vx AND Vy
                        this.V[x] &= this.V[y];
                        break;
                    case 0x3: //set Vx = Vx XOR Vy
                        this.V[x] ^= this.V[y];
                        break;
                    case 0x4: //set Vx = Vx + Vy, set VF = carry
                        this.V[0xF] = (this.V[x] + this.V[y] > 255) ? 1 : 0;
                        this.V[x] += this.V[y];
                        break;
                    case 0x5: //set Vx = Vx - Vy, set VF = NOT borrow
                        this.V[0xF] = (this.V[x] > this.V[y]) ? 1 : 0;
                        this.V[x] -= this.V[y];
                        break;
                    case 0x6: //set Vx = Vx SHR 1
                        this.V[0xF] = this.V[x] & 0x1;
                        this.V[x] >>= 1;
                        break;
                    case 0x7:  //set Vx = Vy - Vx, set VF = NOT borrow
                        this.V[0xF] = (this.V[y] > this.V[x]) ? 1 : 0;
                        this.V[x] = this.V[y] - this.V[x];
                        break;
                    case 0xE: //set Vx = Vx SHL 1
                        this.V[0xF] = (this.V[x] & 0x80) >> 7;
                        this.V[x] <<= 1;
                        break;
                }
        
                break;
            case 0x9000: //skip next instruction if Vx != Vy
                if (this.V[x] !== this.V[y]) {
                    this.programCounter += 2;
                }
                break;
            case 0xA000: //set I = nnn
                this.indexRegister = opcode & 0x0FFF;
                break;
            case 0xB000: //jump to location nnn + V0   
                this.programCounter = (opcode & 0x0FFF) + this.V[0];
                break;
            case 0xC000: //set Vx = random byte AND kk
                this.V[x] = (Math.random() * 0xFF) & (opcode & 0x00FF);
                break;
            case 0xD000: //display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision
                let width = 8;
                let height = opcode & 0x000F;

                this.V[0xF] = 0;

                for (let row = 0; row < height; row++) {
                    let sprite = this.memory[this.indexRegister + row];
                    for (let col = 0; col < width; col++) {
                        if ((sprite & 0x80) > 0) {
                            if (this.renderer.setPixel(this.V[x] + col, this.V[y] + row)) {
                                this.V[0xF] = 1;
                            }
                        }
                        sprite <<= 1;
                    }
                }
                break;
            case 0xE000: 
                switch (opcode & 0xFF) {
                    case 0x9E:  //skip next instruction if key with the value of Vx is pressed
                        this.programCounter += (this.keyboard.isKeyPressed(this.V[x])) ? 2 : 0;
                        break;
                    case 0xA1: //skip next instruction if key with the value of Vx is not pressed
                        this.programCounter += (this.keyboard.isKeyPressed(this.V[x])) ? 0 : 2;
                        break;
                }
                break;
            case 0xF000:
                switch (opcode & 0xFF) {
                    case 0x07: //set Vx = delay timer value
                        this.V[x] = this.delayTimer;
                        break;
                    case 0x0A:  //wait for a key press, store the value of the key in Vx
                        this.paused = true;
                        this.keypad.onNextKeyPress = function(key) {
                        this.V[x] = key;
                        this.paused = false;
                        }.bind(this);
                        break;
                    case 0x15: //set delay timer = Vx
                        this.delayTimer = this.V[x];
                        break;
                    case 0x18: //set sound timer = Vx
                        this.soundTimer = this.V[x];
                        break;
                    case 0x1E: //set I = I + Vx
                        this.indexRegister += this.V[x];
                        break;
                    case 0x29: //set I = location of sprite for digit Vx
                        this.indexRegister = this.V[x] * 0x5;
                        break;
                    case 0x33: //store BCD representation of Vx in memory locations I, I+1, and I+2
                        this.memory[this.indexRegister] = parseInt(this.V[x] / 100);
                        this.memory[this.indexRegister + 1] = parseInt((this.V[x] % 100) / 10);
                        this.memory[this.indexRegister + 2] = parseInt(this.V[x] % 10);
                        break;
                    case 0x55: //store registers V0 through Vx in memory starting at location I
                        for (let i = 0; i <= x; i++) {
                            this.memory[this.indexRegister + i] = this.V[i];
                        }
                        break;
                    case 0x65: //read registers V0 through Vx from memory starting at location I
                        for (let i = 0; i <= x; i++) {
                            this.V[i] = this.memory[this.indexRegister + i];
                        }
                        break;
                }
        
                break;
        
            default:
                throw new Error('Unknown opcode ' + opcode);
        }


    }



} export default CPU;
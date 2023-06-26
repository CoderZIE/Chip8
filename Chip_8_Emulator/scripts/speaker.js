
class Speaker{
    constructor(){

        //create the audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        //create a gain node for volume control
        this.gainNode = this.audioCtx.createGain();

        //create a target node
        this.destination = this.audioCtx.destination;

        //connect the gain node to the destination
        this.gainNode.connect(this.destination);

        //volume control
        //mute the audio
        // this.gainNode.setValueAtTime(0, this.audioCtx.currentTime);

        // //unmute the audio
        // this.gainNode.setValueAtTime(1, this.audioCtx.currentTime);
    }

    play(frequency){
        //check if there is a occilator node and audio context is available
        if(this.audioCtx && !this.oscillator){
            //create an occilator node
            this.oscillator = this.audioCtx.createOscillator();

            //set the frequency
            this.oscillator.frequency.setValueAtTime(frequency || 440, this.audioCtx.currentTime);

            //set the type of the occilator
            this.oscillator.type = 'square';

            //connect the gain node to the occilator node
            this.oscillator.connect(this.gainNode);

            //start the occilator node
            this.oscillator.start();
        }

    }

    //stop the occilator node
    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }



}

export default Speaker;
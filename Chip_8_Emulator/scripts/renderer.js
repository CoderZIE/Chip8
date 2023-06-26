//It will be used to render pixels on the screen and Graphics related stuff

class Renderer {

    //scale the canvas
    constructor(scale) {
        this.cols = 64;
        this.rows = 32;
        this.scale = scale;      

        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.cols * this.scale;
        this.canvas.height = this.rows * this.scale;

        //creating a display
        this.display = new Array(this.cols * this.rows);
    }

    //set the pixel
    setPixel(x, y) {

        //wrapping the pixels around the display
        if (x > this.cols) {
            x -= this.cols;
        } else if (x < 0) {
            x += this.cols;
        }

        if (y > this.rows) {
            y -= this.rows;
        } else if (y < 0) {
            y += this.rows;
        }

        //calculating the pixel location
        let pixelLoc = x + (y * this.cols);

        //setting the pixel to 1 if it is already 1 then return true
        this.display[pixelLoc] ^= 1;

        return !this.display[pixelLoc];
    }

    //clear the display
    clear() {
        this.display = new Array(this.cols * this.rows);
    }

    //Render the display with 60fps
    render(){
        //Clear the display
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Loop through the display array
        for(let i = 0; i < this.cols * this.rows; i++){
            //Get the x position of the pixel
            let x = (i % this.cols) * this.scale;
            //Get the y position of the pixel
            let y = Math.floor(i / this.cols) * this.scale;

            //If the value at the display array is 1 then draw the pixel
            if(this.display[i]){
                //Set the fill color to white
                this.ctx.fillStyle = '#000';

                //Set the pixel
                this.ctx.fillRect(x, y, this.scale, this.scale);
            }
        }
    }

    //test the renderer
    testRender() {
        this.setPixel(0, 0);
        this.setPixel(5, 2);
    }

} export default Renderer;



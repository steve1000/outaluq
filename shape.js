/**
 * Create a canvas shape
 * @type {Shape}
 * @param params
 *      - points {Array} (Required)
 *          - x {number}
 *          - y {number}
 *      - colour {string} - RGB X, Y, Z
 *      - fill {boolean}
 *      - border {boolean}
 */
var Shape = function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    function cls(params) {
        var self = this;

        //Shape parameters
        this.data = {
            colour: params.colour || '255, 255, 255',
            fill: params.fill || false,
            border: params.border || 0,
            length: params.length || 20,
            width: params.width || 20,
            sides: params.sides || 4,
            offsetX: params.offsetX || 0,
            offsetY: params.offsetY || 0,
            offsetRotation: params.offsetRotation || 0,
            point: params.point || 0
        }

        //Determine the points of the shape
        self.data['points'] = [];
        for(var i = 1; i <= self.data.sides; i++) {
            self.data['points'].push({
                x: self.data.width/2 * Math.cos((2 * Math.PI * (i / self.data.sides) - ((90 + self.data.offsetRotation) * Math.PI / 180))) + self.data.offsetX,
                y: self.data.length/2 * Math.sin((2 * Math.PI * (i / self.data.sides) - ((90 + self.data.offsetRotation) * Math.PI / 180))) + self.data.offsetY
            });
        }

        /**
         * Set the object colour
         * @param colour
         * @returns {Shape}
         */
        this.setColour = function(colour) {
            self.data['colour'] = colour;
            return this;
        }

        /**
         * Draw the shape
         * @param x
         * @param y
         * @param rotation
         */
        this.draw = function(x, y, rotation) {
            //Save canvase state
            ctx.save();

            //Translate canvas to the point to draw
            ctx.translate(x, y);

            //Rotate shape
            ctx.rotate(Math.PI / 180 * ((rotation || 0)));

            //Start shape
            ctx.beginPath();

            //Draw the edges
            self.data.points.forEach(function(point) {
                ctx.lineTo(point.x, point.y);
            });

            //Set the colour
            ctx.fillStyle = 'rgb(' + self.data.colour + ')';

            //Fill shape
            if(self.data.fill) {
                ctx.fill();
            }

            //End shape
            ctx.closePath();

            //Add border
            if(self.data.border) {
                var colourString = self.data.colour.split(',');

                colourString[0] = 255 - colourString[0];
                colourString[1] = 255 - colourString[1];
                colourString[2] = 255 - colourString[2];
                var myLineColour = colourString.join(',');

                ctx.strokeStyle = 'rgb('+myLineColour+')';
                ctx.lineWidth = self.data.border;
                ctx.stroke();
            }

            //Add a circle to the front of the shape
            if(self.data.point) {
                ctx.beginPath();
                ctx.arc(0, -self.data.length/2, self.data.point, 0, Math.PI*2, false);
                ctx.fillStyle = 'rgb(' + self.data.colour + ')';
                ctx.fill();
                ctx.closePath();
            }

            //Restore canvas state
            ctx.restore();
        }

    }
    return cls;
}();
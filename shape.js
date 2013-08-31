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
    var data,
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    function cls(params) {
        var self = this;

        //Shape parameters
        data = {
            colour: params.colour || '255, 255, 255',
            fill: params.fill || false,
            border: params.border || 0,
            length: params.length || 20,
            width: params.width || 20,
            sides: params.sides || 4,
            offsetX: params.offsetX || 0,
            offsetY: params.offsetY || 0,
            point: params.point || 0
        }

        //Determine the points of the shape
        data['points'] = [];
        for(var i = 1; i <= data.sides; i++) {
            data['points'].push({
                x: data.width/2 * Math.cos((2 * Math.PI * (i / data.sides) - (90 * Math.PI / 180))) + data.offsetX,
                y: data.length/2 * Math.sin((2 * Math.PI * (i / data.sides) - (90 * Math.PI / 180))) + data.offsetY
            });
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
            data.points.forEach(function(point) {
                ctx.lineTo(point.x, point.y);
            });

            //Set the colour
            ctx.fillStyle = 'rgb(' + data.colour + ')';

            //Fill shape
            if(data.fill) {
                ctx.fill();
            }

            //End shape
            ctx.closePath();

            //Add border
            if(data.border) {
                var colourString = data.colour.split(',');

                colourString[0] = 255 - colourString[0];
                colourString[1] = 255 - colourString[1];
                colourString[2] = 255 - colourString[2];
                var myLineColour = colourString.join(',');

                ctx.strokeStyle = 'rgb('+myLineColour+')';
                ctx.lineWidth = data.border;
                ctx.stroke();
            }

            //Add a circle to the front of the shape
            if(data.point) {
                ctx.beginPath();
                ctx.arc(0, -data.length/2, data.point, 0, Math.PI*2, false);
                ctx.fillStyle = 'rgb(' + data.colour + ')';
                ctx.fill();
                ctx.closePath();
            }

            //Restore canvas state
            ctx.restore();
        }

    }
    return cls;
}();
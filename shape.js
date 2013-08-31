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

        //Various shape modifiers
        data = {
            colour: params.colour || '255, 255, 255',
            fill: params.fill || false,
            border: params.border || false,
            length: params.length || 20,
            width: params.width || 20
        }

        //Determine the type of shape
        switch(params.type) {
            case 'triangle':
                data['points'] = [
                    {x: -data.width/2, y: data.length/2},
                    {x: data.width/2, y: data.length/2},
                    {x: 0, y: -data.length/2}
                ];
                break;
            case 'rectangle':
            default:
                //draw rectangle
                break;
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
            ctx.rotate(Math.PI / 180 * (rotation || 0));

            //Start shape
            ctx.beginPath();

            //Draw the points
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

            //Restore canvas state
            ctx.restore();
        }

    }
    return cls;
}();
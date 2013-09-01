/**
 * Create a ship
 * @type {Ship}
 *
 * @author Jarred Mack
 */
var Ship = function() {
    function cls(params) {
        var self = this;

        this.lastX = 0;
        this.lastY = 0;
        this.size = params.size || 20;
        this.colour = params.colour || '255, 255, 255';

        this.body = new Shape({
            edges: 30,
            colour: self.colour || '255, 255, 255',
            fill: true,
            border: 2,
            point: 3,
            length: self.size || 20,
            width: self.size || 20
        });
        this.engineR = new Shape({
           edges: 4,
            colour: self.colour || '255, 255, 255',
            fill: true,
            border: 2,
            length: self.size * 1.5,
            width: self.size / 4,
            offsetX: -(self.size / 2),
            offsetY: (self.size / 2),
            offsetRotation: 45
        });
        this.engineL = new Shape({
           edges: 4,
            colour: self.colour || '255, 255, 255',
            fill: true,
            border: 2,
            length: self.size * 1.5,
            width: self.size / 4,
            offsetX: (self.size / 2),
            offsetY: (self.size / 2),
            offsetRotation: 45
        });
        this.thrusterR = new Shape({
            edges: 3,
            colour: '255, 0, 0',
            fill: true,
            offsetX: self.size / 2,
            offsetY: self.size * (4 / 3),
            length: self.size * (5 / 4),
            width: self.size / 4,
            offsetRotation: 180
        });
        this.thrusterL = new Shape({
            edges: 3,
            colour: '255, 0, 0',
            fill: true,
            offsetX: -(self.size / 2),
            offsetY: self.size * (4 / 3),
            length: self.size * (5 / 4),
            width: self.size / 4,
            offsetRotation: 180
        });

        this.draw = function(x, y, direction) {
            self.body.draw(x, y, direction);
            self.engineR.draw(x, y, direction);
            self.engineL.draw(x, y, direction);

            if(self.lastX != x || self.lastY != y) {
                self.thrusterR.draw(x, y, direction);
                self.thrusterL.draw(x, y, direction);
            }
            self.lastX = x;
            self.lastY = y;
        };
    }
    return cls;
}();
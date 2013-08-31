/**
 * Create a player
 * @type {Player}
 */
var Player = function() {
    function cls(x,y,colour,id,direction,screenName,playerLuck) {
//@todo fix the params
        var self = this;
        this.x = x;
        this.y = y;
        this.h = triangleSideLength;
        this.direction = direction;
        this.colour = colour;
        this.username = screenName;
        this.lastX = x;
        this.lastY = y;
        this.lastDirection = direction;
        this.mapX = x;
        this.mapY = y;
        this.luck = playerLuck;
        this.socketId = id;
        this.player = new Shape({
            edges: 5,
            colour: this.colour,
            fill: true,
            border: 2,
            point: 3
        });
        this.luckBar = new Shape({
            edges: 4,
            fill: true,
            offsetX: 20,
            width: 5,
            offsetRotation: -45
        });

        this.draw = function() {

            // have I been hit?
            var p = ctx.getImageData(self.x, self.y, 1, 1).data;

            var collidedObject = findObjectICollidedWith(p);

            if(collidedObject !== false) {
                // we hit something... let's return that object to cody
                playerEvent({type: 'hit', data: collidedObject });
            }

            //@todo move this to its own method and set a self.dead property
            //game's over
            if(ded) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText('You dedboi! you got: ' + globalScoreThatJarredWillNeedToRefactor,canvas.width / 2,canvas.height / 2);
                ctx.font = '20px Lucida Console';
                ctx.closePath();
            }

            //@todo move this to its own method
            if(socketId == this.socketId) {
                self.mapY = self.y + Math.abs(mapOffsetY);
                self.mapX = self.x + Math.abs(mapOffsetX);
//                        ctx.translate(self.x,self.y);
            } else {
                // everyone else
//                        ctx.translate(this.x + mapOffsetX,this.y + mapOffsetY);
            }
            self.player.draw(self.x, self.y, self.direction);
            self.luckBar.setColour(getHealthColour(this.luck))
                .setLength(luck/2)
                .draw(self.x, self.y, self.direction);

            this.update();

        };
        this.updateCoords = function(x, y, direction) {
            var yMovement;
            if(typeof direction === 'undefined') {
                yMovement = x;
                direction = y;
            }
            if(socketId == this.socketId) {
                if(yMovement) {
                    // reset the move rate so it only moves when a key is pressed
                    moveRate = 0;
                    // move viewport x axis
                    if(this.x > canvas.width - (Math.floor(canvas.width / 4)) && Math.abs(mapOffsetX) < map.width - canvas.width) {
                        // right hand side
                        if(yMovement < 0) {
                            if(this.direction > 0 && this.direction < 180) {
                                if(mapOffsetX > canvas.width - map.width) {
                                    if(moveX(this.x,this.y,yMovement,direction,this.h/2,-1) != 0) {
                                        mapOffsetX += moveSteps * Math.sin(direction * Math.PI / 180);
                                    }
                                } else {
                                    mapOffsetX = canvas.width - map.width;
                                }
                            } else {
                                //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,-1);
                            }
                        } else {
                            // I'm not allowing for players to reverse into the boundaries for the scrolling viewport... *sigh*
                            if(this.direction < 360 && this.direction > 180) {
                                if(mapOffsetX > canvas.width - map.width) {
                                    if(moveX(this.x,this.y,yMovement,direction,this.h/2,1) != 0) {
                                        mapOffsetX += moveSteps * Math.sin(direction * Math.PI / 180);
                                    }
                                } else {
                                    mapOffsetX = canvas.width - map.width;
                                }
                            } else {
                                //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,1);
                            }
                        }
                    } else if(this.x < 0 + Math.floor((canvas.width / 4)) && mapOffsetX < 0) {
                        // left hand side
                        if(yMovement < 0) {
                            if(this.direction < 360 && this.direction > 180) {
                                if(mapOffsetX < 0) {
                                    if(moveX(this.x,this.y,yMovement,direction,this.h/2,1) != 0) {
                                        mapOffsetX -= moveSteps * Math.abs(Math.sin(direction * Math.PI / 180));
                                    }
                                } else {
                                    mapOffsetX=0;
                                }
                            } else {
                                //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,1);
                            }
                        } else {
                            if(this.direction > 0 && this.direction < 180) {
                                if(mapOffsetX < 0) {
                                    if(moveX(this.x,this.y,yMovement,direction,this.h/2,-1) != 0) {
                                        mapOffsetX += moveSteps * Math.abs(Math.sin(direction * Math.PI / 180));
                                    }
                                } else {
                                    mapOffsetX=0;
                                }
                            } else {
                                //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,-1);
                            }
                        }
                    } else if(this.x < this.h/2) {
                        // if going forward
                        if(yMovement < 0) {
                            if(this.direction < 360 && this.direction > 180) {
                                // we've reached the bounds of the map to the left and we don't want to go any further
                            } else {
                                // change the x position based on the movement and angle
                                // this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,1);
                            }
                        } else {
                            // backward
                            if(this.direction > 0 && this.direction < 180) {
                                // we've reached the bounds of the map to the left and we don't want to go any further
                            } else {
                                // change the x position based on the movement and angle
                                //this.x += yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,-1);
                            }
                        }
                    } else if(this.x > canvas.width - this.h/2) {
                        if(yMovement < 0) {
                            if(this.direction > 0 && this.direction < 180) {
                                // we've reached the bounds of the map to the right and we don't want to go any further
                            } else {
                                // change the x position based on the movement and angle
                                //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,-1);
                            }
                        } else {
                            if(this.direction < 360 && this.direction > 180) {
                                // we've reached the bounds of the map to the right and we don't want to go any further
                            } else {
                                // change the x position based on the movement and angle
                                // this.x += yMovement * Math.sin(direction * Math.PI / 180);
                                this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,1);

                            }
                        }
                    } else {
                        if(this.direction < 360 && this.direction > 180) {
                            this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,1);
                        } else {
                            this.x -= moveX(this.x,this.y,yMovement,direction,this.h/2,-1);
                        }
                    }
                    // viewport move y axis
                    // bottom
                    if(this.y > canvas.height - (Math.floor(canvas.height / 4)) && Math.abs(mapOffsetY) < map.height - canvas.height) {
                        if(yMovement < 0) {
                            if(this.direction > 90 && this.direction < 270) {
                                if(mapOffsetY > canvas.height - map.height) {
                                    if(moveY(this.x,this.y,yMovement,direction,this.h/2,1) != 0) {
                                        mapOffsetY += moveSteps * Math.abs(Math.cos(direction * Math.PI / 180));
                                    }
                                } else {
                                    mapOffsetY=canvas.height - map.height;
                                }

                            } else {
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        } else {
                            if(this.direction < 90 || this.direction > 270) {
                                if(mapOffsetY > canvas.height - map.height) {
                                    if(moveY(this.x,this.y,yMovement,direction,this.h/2,-1) != 0) {
                                        mapOffsetY -= moveSteps * Math.abs(Math.cos(direction * Math.PI / 180));
                                    }
                                } else {
                                    mapOffsetY=canvas.height - map.height;
                                }
                            } else {
                                this.y -= yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        }
                    } else if(this.y < 0 + Math.floor((canvas.height / 4)) && mapOffsetY < 0) {
                        if(yMovement < 0) {
                            if(this.direction < 90 || this.direction > 270) {
                                if(mapOffsetY < 0) {
                                    if(moveY(this.x,this.y,yMovement,direction,this.h/2,-1) != 0) {
                                        mapOffsetY -= moveSteps * Math.cos(direction * Math.PI / 180);
                                    }
                                } else {
                                    mapOffsetY=0;
                                }
                            } else {
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        } else {
                            if(this.direction > 90 && this.direction < 270) {
                                if(mapOffsetY < 0) {
                                    if(moveY(this.x,this.y,yMovement,direction,this.h/2,1) != 0) {
                                        mapOffsetY -= moveSteps * Math.cos(direction * Math.PI / 180);
                                    }
                                } else {
                                    mapOffsetY=0;
                                }
                            } else {
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        }
                    } else if(this.y < this.h/2) {
                        if(yMovement < 0) {
                            if(this.direction < 90 || this.direction > 270) {
                                // we've reached the bounds of the map to the top and we don't want to go any further
                            } else {
                                // change the y position based on the movement and angle
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        } else {
                            if(this.direction > 90 && this.direction < 270) {
                                // we've reached the bounds of the map to the top and we don't want to go any further
                            } else {
                                // change the y position based on the movement and angle
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        }
                    } else if(this.y > canvas.height - this.h/2) {
                        if(yMovement < 0) {
                            if(this.direction > 90 && this.direction < 270) {
                                // we've reached the bounds of the map to the bottom and we don't want to go any further
                            } else {
                                // change the y position based on the movement and angle
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        } else {
                            if(this.direction < 90 || this.direction > 270) {
                                // we've reached the bounds of the map to the bottom and we don't want to go any further
                            } else {
                                // change the y position based on the movement and angle
                                this.y += yMovement * Math.cos(direction * Math.PI / 180);
                            }
                        }
                    } else {
                        if(this.direction > 90 && this.direction < 270) {
                            this.y += moveY(this.x,this.y,yMovement,direction,this.h/2,1);
                        } else {
                            this.y += moveY(this.x,this.y,yMovement,direction,this.h/2,-1);
                        }
                    }
                }
            } else {
                this.x = x;
                this.y = y;
            }
            this.direction = direction;
        };
        this.update = function() {

            if(socketId == this.socketId) {
                if(this.lastX == this.x && this.lastY == this.y && this.lastDirection == this.direction) {
                    return;
                }
                this.lastDirection = this.direction;
                this.lastX = this.x;
                this.lastY = this.y;

                socket.emit('playerMoved', {
                    coords: {
                        x: this.mapX,
                        y: this.mapY,
                        vpx: mapOffsetX,
                        vpy: mapOffsetY
                    },
                    direction: this.direction
                });

//                            gameSounds.ac.listener.setPosition(this.mapX, this.mapY, 0);
            }
        };
        this.updatePlayerState = function(data,isMe) {
            switch (data.type) {
                case 'luckUpdate' :
                    if(isMe) {
                        log('testasdf');
                        luck = data.data;
                    } else {
                        this.luck = data.data;
                    }
                    break;
                case 'itemsUpdate' :
                    items = data.data;
                    break;
                // and so on and so forth
            }

        };
    }

    /**
     * Generate health bar colour on a green -> red scale
     * @param luck
     * @returns {string}
     */
    function getHealthColour(luck) {
        var r = 255 - (255 * (luck / 100));
        var g = 255 * (luck / 100);
        var b = 0;
        return 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+',0.9)';
    }
    return cls;
}();
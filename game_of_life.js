/**
* The following program contains source code for a game called Game of Life created by John Horton Conway.
* @author   Jorge Aires
* @license  "GNU General Public License v3.0"
*/

/**
 * Usefull class to handle Canvas
 */
class Canvas {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.Width = this.ctx.canvas.clientWidth;
        this.Height = this.ctx.canvas.clientHeight;
    }

    rectangle(x, y, width, height, colorBorder, colorInside) {
        this.ctx.fillStyle = colorInside;
        this.ctx.strokeStyle = colorBorder;
        if (colorInside) this.ctx.fillRect(x, y, width, height);
        if (colorBorder) this.ctx.strokeRect(x, y, width, height);
    }

    point(x, y, color, height) {
        color = color || "black";
        height = height || 1;
        let m = height / 2;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x -m, y - m, height, height);
    }

    circ(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color || "black";
        this.ctx.arc(x, y, radius, 0 , 2 * Math.PI);
        this.ctx.closePath();
        if (color) this.ctx.fill();
        else this.ctx.stroke();
    }

    line (x1, y1 , x2 , y2) {
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(x1 , y1);
        this.ctx.lineTo(x2 , y2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    rect(x1 , y1, x2, y2, color, full) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        let _width = x2 - x1;
        let _height = y2 - y1;
        if (full) this.ctx.fillRect(x1, y1, _width, _height);
        else this.ctx.strokeRect(x1, y1, _width, _height);
    }

    centralize(x , y) {
        this.ctx.translate(mx, my);
    }

    clear(color) {
        if (color) this.rectangule(0, 0, this.Width, this.Height, color, color);
        else this.ctx.clearRect(0, 0, this.Width, this.Height);
    }
}

/**
 * Usefull methods to generate random values
 */

 function getRandom(min, max) {
    let r = Math.random();
    let m = (max - min);
    let res = r * m + min;
    return res;
}

function getRandomColor() {
    let r = Math.floor(getRandom(0, 255));
    let g = Math.floor(getRandom(0, 255));
    let b = Math.floor(getRandom(0, 255));
    let c = "rgb(" + r + "," + g + ", " + b + ")";
    return c;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
* Here start the Game Of Life implementation
*/
const colorAlive = "black";
const colorDead = "white";
const colorBorder = "black";

class GameOfLife {

    /** 
    * Constructor
    * Create the canvas with specific cell dimension
    * @param {Integer} _width number of cells horizontally
    * @param {Integer} _height number of cells vertically
    * @param {Integer} _underPopulationFactor factor to consider under population
    * @param {Integer} _overPopulationFactor factor to consider over population
    * @param {Integer} _reproductionFactor factor to consider reproduction
    */
    constructor(_width, _height, _underPopulationFactor = 2, _overPopulationFactor = 3, _reproductionFactor = 3) {

        this.UnderPopulationFactor = _underPopulationFactor;
        this.OverPopulationFactor = _overPopulationFactor;
        this.ReproductionFactor = _overPopulationFactor;

        this.Canvas = new Canvas();
        this.BorderSize = {
            Width: _width,
            Height: _height
        };
        this.CellSize = {
            Width: this.Canvas.Width / _width,
            Height: this.Canvas.Height / _height
        };
        this.Cells = [];

        // Initialize grid
        this.startCells();
        this.startNeighbors();
    }

    /** 
    * Generate the cells grid based on canvas dimensions
    */
    startCells() {
        for (var y = 0; y < this.BorderSize.Height; y++) {

            let line = [];
            for (var x = 0; x < this.BorderSize.Width; x++) {
                let cell = {
                    alive: getRandomInt(0 , 2), // current status
                    x: x * this.CellSize.Width, // position X
                    y: y * this.CellSize.Height, // position Y
                    next: 0 // next status (Dead)
                }
                line.push(cell);
            };
            this.Cells.push(line);
        }
    }

    /**
     * Generate previously the neighbors in each cell to avoid looking for in each generation
     */
    startNeighbors() {
        this.Cells.forEach((line, y) => {
            line.forEach((cell, x) => {
                
                cell.neighbors = [];
                for (var deltaY = -1; deltaY <= 1; deltaY++) {
                    for (var deltaX = -1; deltaX <= 1; deltaX++) {

                        //With deltaX/deltaY equals 0, corresponds the cell itself
                        if (deltaX !== 0 || deltaY !== 0) {
                        
                            let neighborX = x + deltaX; // Identify neighbor existing by line
                            let neighborY = y + deltaY; // Identify neighbor existing by column

                            if (neighborX >= 0 && 
                                neighborX < this.BorderSize.Width &&
                                neighborY >= 0 && 
                                neighborY < this.BorderSize.Height) {
                                
                                let ncell = this.Cells[neighborY][neighborX];
                                cell.neighbors.push(ncell);
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * Calculate the next status based on neighbors in each cell
     */
    calculate() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                
                let neighbors = 0;
                cell.neighbors.forEach(ncell => {
                    neighbors += ncell.alive;
                });

                if (cell.alive) {
                    cell.next = +(
                        neighbors >= this.UnderPopulationFactor && 
                        neighbors <= this.OverPopulationFactor
                    );
                }
                else {
                    cell.next = +(neighbors == this.ReproductionFactor);
                }
            });
        });
    }

    /**
     * Define the current status in each cell
     */
    update() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                cell.alive = cell.next;
            });
        });        
    }

    /**
     * Draw the cells based on current status
     */
    render() {
        this.Cells.forEach(line => {
            line.forEach(cell => {

                this.Canvas.rectangle(
                    cell.x,
                    cell.y,
                    this.CellSize.Width,
                    this.CellSize.Height,
                    colorBorder,
                    (cell.alive ? colorAlive : colorDead)
                );
            });
        });
    }

    /**
     * Main method to execute the flow:
     * - Calculate the next status before each generation
     * - Draw the cells
     * - Update the current status
     */
    execute() {
        this.calculate();
        this.render();
        this.update();
    }
}

// Create a new game instance
var game = new GameOfLife(50, 50);

// Execute each generation loop
function executeGame() {
    game.execute();
    requestAnimationFrame(executeGame);
}

requestAnimationFrame(executeGame);
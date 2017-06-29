class Cell {
    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.nextStatus;
    }

    setStatus() {
        this.alive = this.nextStatus;
    }

    update(grid) {
        if (!this.alive) {
        let neighborsAlive = this.checkNeighborsOfDead(grid);
            this.nextStatus = neighborsAlive === 3;
            return;
        }
        let neighborsAlive = this.checkNeighborsOfAlive(grid);        
        this.nextStatus = neighborsAlive === 2 || neighborsAlive === 3;
    }

    checkNeighborsOfDead(grid) {
        let x = this.x;
        let y = this.y;
        let yminus = y - 1;
        let yplus = y + 1;
        let xminus = x - 1;
        let xplus = x + 1;
        let neighborsAlive = 0;
        if (grid[yminus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][x].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (neighborsAlive === 0) return neighborsAlive;
        if (grid[yplus][x].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        return neighborsAlive;
    }
    checkNeighborsOfAlive(grid) {
        let x = this.x;
        let y = this.y;
        let yminus = y - 1;
        let yplus = y + 1;
        let xminus = x - 1;
        let xplus = x + 1;
        let neighborsAlive = 0;
        if (grid[yminus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][x].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][x].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        return neighborsAlive;
    }

    checkNeighborsOld(grid) {
        let x = this.x;
        let y = this.y;
        let yminus = y - 1;
        let yplus = y + 1;
        let xminus = x - 1;
        let xplus = x + 1;
        let neighborsAlive = 0;
        // neighborsAlive = neighborsAlive + grid[y][xminus].alive
        // neighborsAlive = neighborsAlive + grid[yminus][xminus].alive
        // neighborsAlive = neighborsAlive + grid[yplus][xminus].alive
        // neighborsAlive = neighborsAlive + grid[y][xplus].alive
        // neighborsAlive = neighborsAlive + grid[yminus][xplus].alive
        // neighborsAlive = neighborsAlive + grid[yplus][xplus].alive
        // neighborsAlive = neighborsAlive + grid[yminus][x].alive
        // neighborsAlive = neighborsAlive + grid[yplus][x].alive
        if (grid[y][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][x].alive) neighborsAlive = neighborsAlive + 1;
        if (neighborsAlive === 0) return neighborsAlive;
        if (grid[yplus][x].alive) neighborsAlive = neighborsAlive + 1;
        return neighborsAlive;
    }
}

class Grid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.pixelWidth = width * cellSize;
        this.pixelHeight = height * cellSize;
        this.grid = [];
        this.alive = [];
    }

    fill() {
        for(let y = 0; y < this.height; y += 1) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x += 1) {
                if (Math.random() > .6 && y !== 0 && y !== this.height - 1 && x !== 0 && x !== this.width - 1)  {
                    this.grid[y][x] = new Cell(x, y, true);
                    this.alive.push(this.grid[y][x]);
                } else {
                    this.grid[y][x] = new Cell(x, y, false);
                }
            }
        }
    }

    reset(size) {
        let self = this;
        this.cellSize = size || this.cellSize;
        this.width = Math.floor(this.pixelWidth / this.cellSize);
        this.height = Math.floor(this.pixelHeight / this.cellSize);
        this.pixelWidth = this.width * this.cellSize;
        this.pixelHeight = this.height * this.cellSize;
        self = new Grid(this.width, this.height, this.cellSize);
        this.fill();
    }

    render() {
        let size = this.cellSize;
        ctx.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
        _.each(this.alive, cell => {
            ctx.fillRect(cell.x * size, cell.y * size, size, size);
        });
    }

    update() {
        this.alive = [];

        for (let i = 1; i < this.grid.length - 1; i = i + 1) {
            for (let j = 1; j < this.grid[i].length - 1; j = j + 1) {
                this.grid[i][j].update(grid.grid);
            }
        }

        for (let i = 1; i < this.grid.length - 1; i = i + 1) {
            for (let j = 1; j < this.grid[i].length - 1; j = j + 1) {
                this.grid[i][j].setStatus();
                if (this.grid[i][j].alive) this.alive.push(this.grid[i][j]);
            }
        }
    }
}


let size = 3;
const width = window.innerWidth;
const height = window.innerHeight;
const gridWidth = Math.floor(width / size);
const gridHeight = Math.floor(height / size);
const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'hsl(' + Math.random() * 360 + ', 70%, 50%)';
let grid = new Grid(gridWidth, gridHeight, size);
grid.fill();

var perf = [];
var timeSinceLastPerfCheck = 0;
var perfCheckInterval = 1000;
var runTime = 0;
function runPerf() {
    let rt = performance.now();
    let t0 = performance.now();
    grid.render();
    grid.update();
    let t1 = performance.now();
    perf.push(t1 - t0);
    timeSinceLastPerfCheck = timeSinceLastPerfCheck + runTime;
    if (timeSinceLastPerfCheck > perfCheckInterval) {
        let average = perf.reduce((previous, current) => previous + current, 0) / perf.length;
        console.log('Avg perf in last ' + perfCheckInterval + 'ms:\n' + average.toFixed(2) + 'ms');
        let ratio = grid.width * grid.height / 100;
        console.log('Alive/cell: ' + Math.round(grid.alive.length / ratio) + '/100');
        timeSinceLastPerfCheck = 0;
        perf = [];
    }
    runTime = performance.now() - rt;
    window.requestAnimationFrame(runPerf);
}

function run() {
    grid.render();
    grid.update();
    window.requestAnimationFrame(run)
}

document.body.addEventListener('click',event => {
    grid.reset();
});

run();
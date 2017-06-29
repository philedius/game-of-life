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
        let neighborsAlive = this.checkNeighbors(grid);
        if (!this.alive) {
            this.nextStatus = neighborsAlive === 3;
            return;
        }
        this.nextStatus = neighborsAlive === 2 || neighborsAlive === 3;
    }

    checkNeighbors(grid) {
        let x = this.x;
        let y = this.y;
        let yminus = y - 1;
        let yplus = y + 1;
        let xminus = x - 1;
        let xplus = x + 1;
        let neighborsAlive = 0;
        if (grid[y][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xminus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[y][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yplus][xplus].alive) neighborsAlive = neighborsAlive + 1;
        if (grid[yminus][x].alive) neighborsAlive = neighborsAlive + 1;
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
        for (let y = 0; y < this.height; y += 1) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x += 1) {
                if (Math.random() > .7 && y !== 0 && y !== this.height - 1 && x !== 0 && x !== this.width - 1) {
                    this.grid[y][x] = new Cell(x, y, true);
                    this.alive.push(this.grid[y][x]);
                } else {
                    this.grid[y][x] = new Cell(x, y, false);
                }
            }
        }
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

const size = 4;
const width = window.innerWidth;
const height = window.innerHeight;
const gridWidth = Math.floor(width / size);
const gridHeight = Math.floor(height / size);
const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
let grid = new Grid(gridWidth, gridHeight, size);
grid.fill();
const color = 'hsl(' + 340 + ', 70%, 50%)';
ctx.fillStyle = 'hsl(' + 340 + ', 70%, 50%)';

var perf = [];
var loops = 0;
function run() {
    let t0 = performance.now();
    grid.render();
    grid.update();
    let t1 = performance.now();
    loops = loops + 1;
    perf.push(t1 - t0);
    if (loops === 5) {
        let average = perf.reduce((previous, current) => previous + current, 0) / perf.length;
        console.log(average);
        loops = 0;
        perf = [];
    }
    window.requestAnimationFrame(run);
}

document.body.addEventListener('click', event => {
    grid = new Grid(gridWidth, gridHeight, size);
    grid.fill();
});

run();
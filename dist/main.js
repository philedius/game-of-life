

class Cell {
    constructor(x, y, status) {
        this.x = x;
        this.y = y;
        this.status = status;
        this.nextStatus;
        this.speed = 1;
    }

    isAlive(speed) {
        if (this.status === 'alive') {
            if (speed > 4) {
                this.speed += 1;
            } else if (speed > 1) {
                this.speed += speed * 0.25;
            }
            return true;
        }
        return false;
    }

    SetNextStatus(status, speed) {
        this.status = status || this.nextStatus;
        this.speed = speed || this.speed;
    }

    update(grid) {
        let neighborsAlive = this.checkNeighbors(grid);
        if (this.status === 'dead') {
            if (neighborsAlive === 3) {
                this.nextStatus = 'alive';
            } else {
                this.nextStatus = 'dead';
            }
        } else {
            if (neighborsAlive === 2 || neighborsAlive === 3) {
                this.nexStatus = 'alive';
            } else {
                this.nextStatus = 'dead';
            }
        }
        // if (this.status === 'dead') this.nextStatus = (neighborsAlive === 3) ? 'alive' : 'dead';
        // if (this.status === 'alive') this.nextStatus = (neighborsAlive === 2 || neighborsAlive === 3) ? 'alive' : 'dead';
        if (this.status === this.nextStatus && this.speed > 1) {
            this.speed -= 5;
        } else if (this.speed > 1) this.speed -= 0.1;
    }

    checkNeighbors(grid) {
        let x = this.x;
        let y = this.y;
        let neighborsAlive = 0;
        if (x !== 0) {
            neighborsAlive += grid[y][x - 1].isAlive(this.speed);
            if (y !== 0) neighborsAlive += grid[y - 1][x - 1].isAlive(this.speed);
            if (y !== grid.length - 1) neighborsAlive += grid[y + 1][x - 1].isAlive(this.speed);
        }

        if (x !== grid[0].length - 1) {
            neighborsAlive += grid[y][x + 1].isAlive(this.speed);
            if (y !== 0) neighborsAlive += grid[y - 1][x + 1].isAlive(this.speed);
            if (y !== grid.length - 1) neighborsAlive += grid[y + 1][x + 1].isAlive(this.speed);
        }

        if (y !== 0) neighborsAlive += grid[y - 1][x].isAlive(this.speed);
        if (y !== grid.length - 1) neighborsAlive += grid[y + 1][x].isAlive(this.speed);

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
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                if (Math.random() > 1) {
                    this.grid[y][x] = new Cell(x, y, 'alive');
                    this.alive.push(this.grid[y][x]);
                } else {
                    this.grid[y][x] = new Cell(x, y, 'dead');
                }
            }
        }
    }

    render() {
        let size = this.cellSize;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.pixelWidth, this.pixelHeight);
        ctx.globalAlpha = 1;
        this.alive.forEach(cell => {
            ctx.fillStyle = 'hsl(' + (color + cell.speed) % 360 + ',72%, 42%)';
            ctx.fillRect(cell.x * size, cell.y * size, size, size);
        });
    }

    update() {
        this.alive = [];
        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.update(grid.grid);
            });
        });

        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.SetNextStatus();
                if (cell.status === 'alive') this.alive.push(cell);
            });
        });
    }
}

const size = 12;
const width = window.innerWidth;
const height = window.innerHeight + 50;
const gridWidth = Math.floor(width / size);
const gridHeight = Math.floor(height / size);
const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
let grid = new Grid(gridWidth, gridHeight, size);
grid.fill();
let color = 200;
ctx.fillStyle = 'hsl(' + color + ', 70%, 40%)';
let loops = 0;

function updateColor() {
    color += .33 % 360;
    document.getElementById('title').style.textShadow = '0px 0px 35px hsl(' + color + ',72%, 42%)';
}

const titles = ['HELLO THERE', 'WELCOME TO WEBSITE', 'THIS IS MY WEBSITE', 'WELCOME', 'TO WEBSITE', 'ON WORLD WIDE WEB', 'WELCOME', 'PLAY WITH MOUSE', 'CLICK LINKS', 'THIS IS WORLD WIDE WEB'];

var currentTitle = 0;

function run() {
    grid.render();
    updateColor();
    grid.update();

    if (loops % 200 === 0) {
        if (currentTitle === titles.length) currentTitle = 0;
        document.getElementById('title').innerHTML = titles[currentTitle];
        currentTitle += 1;
    }
    loops += 1;
    window.requestAnimationFrame(run);
}

function mouseMove(event) {
    x = Math.round(event.clientX / size);
    y = Math.round(event.clientY / size);
    let speed = Math.abs(event.movementX + event.movementY);
    grid.grid[y][x].SetNextStatus('alive', speed);
    grid.grid[y + 1][x].SetNextStatus('alive', speed);
    grid.grid[y - 1][x].SetNextStatus('alive', speed);
    grid.grid[y + 1][x + 1].SetNextStatus('alive', speed);

    if (speed > 2) {
        grid.grid[y + 1][x - 1].SetNextStatus('alive', speed);
    }

    if (speed > 3) {
        grid.grid[y][x + 1].SetNextStatus('alive', speed);
    }

    if (speed > 5) {
        grid.grid[y - 1][x + 2].SetNextStatus('alive', speed);
        grid.grid[y - 2][x + 1].SetNextStatus('alive', speed);
        grid.grid[y - 1][x + 1].SetNextStatus('alive', speed);
        grid.grid[y - 3][x].SetNextStatus('alive', speed);
        grid.grid[y][x + 2].SetNextStatus('alive', speed);
        grid.grid[y - 2][x].SetNextStatus('alive', speed);
        grid.grid[y - 3][x - 1].SetNextStatus('alive', speed);
        grid.grid[y + 3][x].SetNextStatus('alive', speed);
        grid.grid[y + 3][x - 2].SetNextStatus('alive', speed);
        grid.grid[y + 2][x - 2].SetNextStatus('alive', speed);
    }

    if (speed > 10) {
        grid.grid[y + 2][x].SetNextStatus('alive', speed);
        grid.grid[y][x + 3].SetNextStatus('alive', speed);
        grid.grid[y][x - 3].SetNextStatus('alive', speed);
        grid.grid[y + 1][x - 2].SetNextStatus('alive', speed);
        grid.grid[y + 1][x - 3].SetNextStatus('alive', speed);
        grid.grid[y][x - 1].SetNextStatus('alive', speed);
        grid.grid[y + 2][x - 1].SetNextStatus('alive', speed);
        grid.grid[y - 4][x].SetNextStatus('alive', speed);
        grid.grid[y + 4][x + 1].SetNextStatus('alive', speed);
        grid.grid[y + 3][x - 4].SetNextStatus('alive', speed);
        grid.grid[y - 4][x + 1].SetNextStatus('alive', speed);
        grid.grid[y - 3][x + 4].SetNextStatus('alive', speed);
        grid.grid[y - 1][x - 4].SetNextStatus('alive', speed);
        grid.grid[y - 1][x - 3].SetNextStatus('alive', speed);
        grid.grid[y - 1][x - 2].SetNextStatus('alive', speed);
    }
}

document.body.addEventListener('mousemove', event => {
    mouseMove(event);
});

run();
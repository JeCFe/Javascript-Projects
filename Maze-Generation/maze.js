const input = document.querySelector(".top-banner input");
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let buttonControls = document.getElementById('buttonCon');
let currentCell;
let mazeComplete = false;



window.addEventListener("submit", e=>{
    e.preventDefault();
    let mazeSize = input.value;
    if (mazeSize <= 0){mazeSize = 10;}
    else if(mazeSize > 70){mazeSize = 70;}
    newMaze = new Maze(mazeSize);
    newMaze.mazeSetup();
    newMaze.draw();
})

class Maze{
    constructor(RowColumns) {
        this.size = RowColumns * 10;
        this.rows = RowColumns;
        this.columns = RowColumns;
        this.grid = [];
        this.stack = [];
    }
    mazeSetup(){
        mazeComplete = false;
        for (let forRow = 0; forRow<this.rows; forRow++){
            let row = [];
            for (let forColumn = 0; forColumn<this.columns; forColumn++){
                let cell = new Cell(forRow, forColumn, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        currentCell = this.grid[0][0];

        this.grid[this.rows - 1][this.columns - 1].goal = true;
    }
    draw(){
        buttonControls.style.visibility = 'hidden';
        buttonControls.style.display = 'none';
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        currentCell.visited = true;

        for (let forRow = 0; forRow<this.rows; forRow++) {
            for (let forColumn = 0; forColumn<this.columns; forColumn++){
                let grid = this.grid;
                grid[forRow][forColumn].showWalls(this.size, this.rows, this.columns);
            }
        }
        let nextNode = currentCell.checkNeighbours();
        if (nextNode){
            nextNode.visited = true;
            this.stack.push(currentCell);
            currentCell.cellHeightlight(this.columns, this.rows);
            currentCell.removeWall(currentCell, nextNode);
            currentCell = nextNode;


        }else if(this.stack.length > 0){
            let cell = this.stack.pop();
            currentCell = cell;
            currentCell.cellHeightlight(this.columns, this.rows);
        }
        if (this.stack.length === 0){
            mazeComplete = true;
            buttonControls.style.visibility = 'visible';
            buttonControls.style.display = 'block';
            return ;
        }
        window.requestAnimationFrame(()=>{

            this.draw();
        })
    }

}

class Cell{
    constructor(rowNum, colNum, parentGrid, parentSize) {

        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall :true,
            rightWall:true,
            bottomWall: true,
            leftWall: true,
        };
        this.goal = false;
    }

    removeWall(cellOne, cellTwo){
        let x = cellOne.colNum - cellTwo.colNum;
        if (x === 1) {
            cellOne.walls.leftWall = false;
            cellTwo.walls.rightWall = false;
        } else if (x === -1) {
            cellOne.walls.rightWall = false;
            cellTwo.walls.leftWall = false;
        }
        let y = cellOne.rowNum - cellTwo.rowNum;
        if (y === 1) {
            cellOne.walls.topWall = false;
            cellTwo.walls.bottomWall = false;
        } else if (y === -1) {
            cellOne.walls.bottomWall = false;
            cellTwo.walls.topWall = false;
        }
    }
    cellHeightlight(columns, rows){
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
        ctx.fillStyle = "#F57D7F";
        ctx.fillRect(x, y,this.parentSize/columns -3, this.parentSize / columns-3);
    }

    checkNeighbours(){
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        if (top && !top.visited) {
            neighbours.push(top);
        }
        if (right && !right.visited) {
            neighbours.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom);
        }
        if (left && !left.visited) {
            neighbours.push(left);
        }
        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
        }
    }

    drawTop(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / columns, y);
        ctx.stroke();
    }

    drawRight(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x + size / columns, y);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawBottom(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawLeft(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows);
        ctx.stroke();
    }

    showWalls(size, rows, columns){
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        if (this.walls.topWall) {
            this.drawTop(x, y, size, columns, rows);
        }
        if (this.walls.rightWall) {
            this.drawRight(x, y, size, columns, rows);
        }
        if (this.walls.bottomWall) {
            this.drawBottom(x, y, size, columns, rows);
        }
        if (this.walls.leftWall) {
            this.drawLeft(x, y, size, columns, rows);
        }
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
        if (this.goal) {
            ctx.fillStyle = "rgb(83, 247, 43)";
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}




let newMaze = new Maze(30);
newMaze.mazeSetup();
newMaze.draw();
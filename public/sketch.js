const floor_ = Math.floor;
const random_ = Math.random;


let fr =5;
let cellSize = 20;
let hCells = 25;
let vCells = 20;
let canvWidth = cellSize * hCells;
let canvHeight = cellSize * vCells;
let Over = false;
let score = 0;
let highScore = 0;

const scoreboard = document.querySelector("#score");
const hscoreboard = document.querySelector("#hi-score");





if(innerWidth < 500){
    cellSize = 20;
    hCells = floor_(innerWidth/cellSize);
    vCells = floor_((innerHeight * 0.8)/cellSize);
    canvWidth = cellSize * hCells;
    canvHeight = cellSize * vCells;
}

window.addEventListener("resize", ()=>{
    if(innerWidth < 500){
        cellSize = 20;
        hCells = floor_(innerWidth/cellSize);
        vCells = floor_((innerHeight * 0.8)/cellSize);
        canvWidth = cellSize * hCells;
        canvHeight = cellSize * vCells;
        createCanvas(canvWidth, canvHeight);
    }else {
        hCells = 25;
        vCells = 25;
        canvWidth = cellSize * hCells;
        canvHeight = cellSize * vCells;
        createCanvas(canvWidth, canvHeight);
    }
    console.log(vCells);
    init();
})



function Board(w, h, food, snake){
    this.w = w;
    this.h = h;
    this.food = food;
    this.snake = snake;

    this.update = ()=>{
        if (this.food.x == this.snake.head[0] && this.food.y == this.snake.head[1]){
            this.food.pickLoc(this.snake.body);
            this.snake.grow();
            score++;
            highScore = Math.max(score, highScore);
            scoreboard.innerHTML = score;
            hscoreboard.innerHTML = highScore;

            if (score !== 0 && score%5 == 0){
                fr += (innerWidth < 500? 1 : 2);
                frameRate(fr);
            }
        }
    }

    this.draw = ()=> {
        this.update();
        this.food.draw();
        this.snake.draw();
        
    }
}


function Food() {
    this.x = floor_(random_() * hCells) * cellSize;
    this.y = floor_(random_() * vCells) * cellSize;

    this.pickLoc = (arr)=>{
        this.x = floor_(random_() * hCells) * cellSize;
        this.y = floor_(random_() * vCells) * cellSize;
    }
    this.draw = ()=>{
        fill("#f00");
        ellipse(this.x+floor_(cellSize/2), this.y+floor_(cellSize/2), cellSize);
    }
}


function Snake() {
    this.head = [floor_(random_() * hCells)* cellSize, floor_(random_() * vCells)* cellSize];
    this.body = [this.head, [this.head[0] - cellSize, this.head[1]], [this.head[0] - 2*cellSize, this.head[1]]];
    this.len = 3;
    this.dx = cellSize;
    this.dy = 0;

    this.grow = ()=>{
        this.body.push([0,0]);
        this.len++;
    }

    this.changeDir = (code)=> {
        if(code == 37 && this.dx == 0){this.dx = -(cellSize);this.dy = 0;}
        else if (code == 38 && this.dy == 0){this.dy = -(cellSize);this.dx = 0;}
        else if(code == 39 && this.dx == 0){this.dx = abs(cellSize);this.dy = 0;}
        else if (code == 40 && this.dy == 0){this.dy = abs(cellSize);this.dx = 0;}
        else if (code == 32){this.dy = 0;this.dx = 0;}
    }

    this.update = ()=>{
        for (let index = this.len-1; index > 0; index--) {
            this.body[index][0] = this.body[index-1][0];
            this.body[index][1] = this.body[index-1][1];
        }
        this.body[0][0] += this.dx;
        this.body[0][1] += this.dy;

        if (this.body[0][0] >= canvWidth)this.body[0][0] = 0;
        else if (this.body[0][0] < 0)this.body[0][0] = canvWidth - (canvWidth%cellSize);
        if (this.body[0][1] >= canvHeight)this.body[0][1] = 0;
        else if (this.body[0][1] < 0)this.body[0][1] = canvHeight - (canvHeight%cellSize);

        for (let index = 1; index < this.len; index++) {
            const element = this.body[index];
            if (this.head[0] === element[0] && this.head[1] === element[1]){
                Over = true;
            }
        }
    }
    
    this.draw = ()=>{
        this.update();
        this.body.forEach(ele => {
            fill("#0f0");
            rect(ele[0], ele[1], cellSize, cellSize);
        });
    }

}

var food = new Food();
var snake = new Snake();
var board = new Board(canvWidth, canvHeight, food, snake);


function init() {
    fr = 5;
    frameRate(fr);
    food = new Food();
    snake = new Snake();
    board = new Board(canvWidth, canvHeight, food, snake);
    score = 0;
    scoreboard.innerHTML = score;

}
function keyPressed(e) {
    if (37 <= keyCode && 40 >= keyCode || keyCode == 32){
        e.preventDefault();
        snake.changeDir(keyCode);
    }
}

let x = 0;
let y = 0;
document
    .querySelector("body")
    .addEventListener("touchstart", (e) => {
        e.preventDefault()
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
    });

document.addEventListener("touchend", (e) => {
    console.log(e.changedTouches);
    x = x - e.changedTouches[0].pageX;
    y = (y - e.changedTouches[0].pageY);

    if (abs(x) > abs(y)){
        if(x < 0) snake.changeDir(39);
        else snake.changeDir(37);
    }else{
        if(y < 0) snake.changeDir(40);
        else snake.changeDir(38);

    }
});



let button;
function setup() {
    createCanvas(canvWidth, canvHeight);
    frameRate(fr);
}

function draw() {
    background("#ffa");
    if (!Over) board.draw();
    else{
        Over = alert("You Lost! wanna play agian?");
        init();
    }
}
    
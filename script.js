const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth ;
canvas.height = window.innerHeight;

let score = 0;
let gameFrame = 0;
let gameover = false;
ctx.font = "50px Georgia";

let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x:canvas.width/2,
    y:canvas.height/2,
    click:false
}

canvas.addEventListener('mousedown',function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
});

const playerLeft = new Image();
playerLeft.src = 'red_swim_left.png';
const playerRight = new Image();
playerRight.src = 'red_swim_right.png';

const bubbleArray = [];
const bubbleimage = new Image()
bubbleimage.src = 'bubble_pop_frame_01.png'
class Bubble{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 5+1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1': 'sound2';
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx+dy*dy)
    }
    draw(){
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x ,this.y , this.radius , 0 , Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleimage , this.x -68 , this.y-68 , this.radius*2.7 , this.radius*2.7)
    }
}

const bubblepop1 = document.createElement('audio');
bubblepop1.src = 'Plop.ogg';
const bubblepop2 = document.createElement('audio');
bubblepop2.src = 'bubbles-single2.wav';


function handlebubbles(){
    if(gameFrame % 50 == 0){
        bubbleArray.push(new Bubble());
    }
    //console.log(bubbleArray.length)
    for(let i=0;i<bubbleArray.length;i++){
        bubbleArray[i].update();
        bubbleArray[i].draw();
        //console.log(bubbleArray[i])
        if(bubbleArray[i].y < 0){
            bubbleArray.splice(i,1);
            i--;
        }
        else if(bubbleArray[i].distance < bubbleArray[i].radius + player.radius){
            if(!bubbleArray[i].counted){
                if(bubbleArray[i].sound == 'sound1'){
                    bubblepop1.play();
                }
                else if(bubbleArray[i].sound == 'sound2'){
                    bubblepop2.play();
                }
                score++;
                bubbleArray[i].counted = true;
                bubbleArray.splice(i,1);
            }
        }
    }
}


class Player{
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height;
        this.radius = 20;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy , dx);
        this.angle = theta;
        if(this.x != mouse.x){
            this.x -=dx/10 ;
        }
        if(this.y != mouse.y){
            this.y -=dy/10 ;
        }
        if(gameFrame % 5 == 0){
            this.frame++;
            if(this.frame >= 12 ) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame ==11){
                this.frameX = 0; 
            }
            else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if(this.frame < 7) this.frameY = 1;
            else if(this.frame < 12) this.frameY = 2;
            else this.frameY = 0; 
        }
    }
    draw(){
        // if(mouse.click){
        //     ctx.lineWidth = 0.2;
        //     ctx.beginPath();
        //     ctx.moveTo(this.x , this.y);
        //     ctx.lineTo(mouse.x , mouse.y);
        //     ctx.stroke();
        // }
        // ctx.fillStyle = "red";
        // ctx.beginPath();
        // ctx.arc(this.x , this.y , this.radius , 0 , Math.PI *2);
        // ctx.fill();
        // ctx.closePath();

        ctx.save();
        ctx.translate(this.x , this.y);
        ctx.rotate(this.angle)

        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft , this.frameX * this.spriteWidth , this.frameY * this.spriteHeight,
                this.spriteWidth , this.spriteHeight , 0 - 45 ,0 - 45 , this.spriteWidth/5 , this.spriteHeight/5 )
        }
        else{
        ctx.drawImage( playerRight, this.frameX * this.spriteWidth , this.frameY * this.spriteHeight,
            this.spriteWidth , this.spriteHeight , 0 - 45 , 0 - 45 , this.spriteWidth/4 , this.spriteHeight/4 )
        }

        ctx.restore();
    }
}

const player = new Player();


const enemyimage = new Image();
enemyimage.src = 'enemyfish.png'

class Enemy{
    constructor(){
        this.x =  canvas.width + 300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 50;
        this.speed = Math.random() * 2  + Math.random() * 3;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(){
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x , this.y , this.radius , 0 , Math.PI * 2);
        // ctx.fill();
        ctx.drawImage(enemyimage , this.frameX * this.spriteWidth , this.frameY * this.spriteHeight , this.spriteWidth ,
            this.spriteHeight , this.x - 50 , this.y - 50 , this.spriteWidth/4 , this.spriteHeight/4);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0-this.radius * 2){
            this.x = canvas.width + 200
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2  + 2;
        }
        if(gameFrame % 5 == 0){
            this.frame++;
            if(this.frame >= 12 ) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame ==11){
                this.frameX = 0; 
            }
            else{
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if(this.frame < 7) this.frameY = 1;
            else if(this.frame < 12) this.frameY = 2;
            else this.frameY = 0; 
        }
        this.dx = this.x - player.x;
        this.dxy = this.y - player.y;
        const dist = Math.sqrt(this.dx*this.dx + this.dxy*this.dxy);
        if(dist < this.radius + player.radius - 10){
            handlegameover();
        }
    }
}

function handlegameover(){
    ctx.fillStyle = 'white';
    ctx.fillText("Game Over , Your Score: "+ score , canvas.width/4 , canvas.height/2)
    gameover = true;
}

const enemyarray = [];
for(let i=0 ; i<5;i++){
    enemyarray.push(new Enemy());
}
function handleenemy(){
    
    for(let i=0 ;i<enemyarray.length ;i++){
        enemyarray[i].draw();
        enemyarray[i].update();
    }
}



const background = new Image()
background.src = 'background1.png'


const BG = {
    x1 : 0,
    x2 : canvas.width,
    y : 0,
    width : canvas.width,
    height : canvas.height
}

function handlebackground(){
    BG.x1 --
    if(BG.x1 < -BG.width) BG.x1 = BG.width ;
    BG.x2--
    if(BG.x2 < -BG.width) BG.x2 = BG.width ;
    ctx.drawImage(background , BG.x1 , BG.y , BG.width , BG.height);
    ctx.drawImage(background , BG.x2 , BG.y , BG.width , BG.height);
}

function animate(){
    ctx.clearRect(0 ,0 , canvas.width , canvas.height)
    handlebackground();
    handleenemy();
    player.update();
    player.draw();
    handlebubbles();
    ctx.fillStyle = 'black';
    ctx.fillText('score:'+score  , 10 , 50);
    gameFrame++;
    if(!gameover) requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize' , function(){
    canvasPosition = canvas.getBoundingClientRect();
});
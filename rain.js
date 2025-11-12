let balls=[];
const maxBalls=80;
const removeCount=30;

function setup(){
    let cnv=createCanvas(windowWidth, windowHeight);
    cnv.style('background','transparent');
    for (let i=0;i<40;i++){
        balls.push(new Ball(random(width),random(-height,0)));
    };
}
 function draw(){
    clear();
    for (let b of balls){
    b.update();
    b.show();}
    let stopped=balls.filter(b=>b.stopped);
    if(stopped.length>=30){
    balls.splice(0,removeCount);}
    while(balls.length<maxBalls){
    balls.push(new Ball(random(width),random(-height,0)));}
}
class Ball{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.vx=random(-0.3,0.3);
        this.vy=random(2,5);
        this.r=random(3,8);
        this.color=color(255);
        this.stopped=false;
    }
    update(){
        if(!this.stopped){
            this.y+=this.vy;
            this.x+=this.vx;
            if(this.y+this.r>height){
              this.y=height-this.r;
              this.vy*=-0.3;
             if(abs(this.vy)<0.2){
                this.vy=0;
                this.stopped=true;
             }
          }
          else{
            this.vy+=0.2;
          }
        }  
    }
    show(){
        noStroke();
        fill(this.color);
        circle(this.x,this.y,this.r*2);
    }
}
function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}
   
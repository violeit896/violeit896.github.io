let circles=[];
let uploadedImage=null;
let userText='';

function setup(){
    let cnv=createCanvas(windowWidth,windowHeight);
    cnv.parent('maincontainer');
    cnv.style('background','transparent');
    noStroke();
}

function draw(){
    clear();
    noStroke();
    fill (255,255,255,100);
    circles.forEach(c=>{
        ellipse(c.x,c.y,c.size);
        c.y+=c.speed;
        if(c.y>height){
            c.y=random(-100,0);
            c.x=random(width);
        }
    });
    if (frameCount%10===0){
        circles.push({x:random(width),y:random(-50,0),size:random(20,60),speed:random(1,3)});
        if (circles.length>100)circles.shift();
    }
}
document.getElementById('upload').addEventListener('click',()=>{
    document.getElementById('imageUpload').click();
});
document.getElementById('imageUplaod').addEventListener('change',function(e){
    const file=e.target.files[0];
    if(file){
        const reader=new FileReader;
        reader.onload=function(event){
            uplaodImage=event.target.result;
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById('saveBtn').addEventListener('click',()=>{
    if (!uploadedImage)return alert("Please upload an image first.");
    userText=document.getElementById('userText').value;
    if(!userText) return alert("Please type something first.");
    const slot=document.getElementById('img-slot-1');

    

})
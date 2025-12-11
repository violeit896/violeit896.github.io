const container=document.getElementById("container");
const centerX=250;
const centerY=250;
const radiusnum=40;
for(let ring=1;ring<=5;ring++){
    for(let i=0;i<5;i++){
        let angle=(Math.PI*2/5)*i;
        let radius=ring*radiusnum;
        let x = centerX + Math.cos(angle)*radius-20;
        let y = centerY + Math.sin(angle)*radius-20;
        let dot=document.createElement("div");
        dot.className="dot";
        if(ring%2===0){
            dot.style.border="2px solid gray";
        }
        dot.style.left=x+"px";
        dot.style.top=y+"px";
        container.appendChild(dot);
    }
}
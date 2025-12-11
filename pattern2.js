const container=document.getElementById("container");
const centerX=250;
const centerY=250;
const ringCounts=[5,10,15];

for(let ring=0;ring<ringCounts.length;ring++){
    let count = ringCounts[ring];
    let angleStep = Math.PI*2/count;
    let size=60-ring*15;
    let opacity=1-ring*0.3;
    let radius=60+ring*50;

    for(let i=0;i<count;i++){

        let angle=angleStep*i;

        let x = centerX + Math.cos(angle)*radius-size/2;
        let y = centerY + Math.sin(angle)*radius-size/2;
        let dot=document.createElement("div");
        dot.className="dot";
        
        dot.style.opacity=opacity;
        dot.style.width=size+"px";
        dot.style.height=size+"px";
        dot.style.left=x+"px";
        dot.style.top=y+"px";

        container.appendChild(dot);
    }
}
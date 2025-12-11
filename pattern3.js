const container=document.getElementById("container");

for(let col=0;col<5;col++){
    let size=(col%2 === 0)?50:25;

    for(let row=0;row<6;row++){
        let dot=document.createElement("div");
        dot.className="dot";
        dot.style.width=size+"px";
        dot.style.height=size+"px";
        let x=60+col*80;
        let y=50+row*60+(col%2 === 0 ? 0:30);

        dot.style.left=x+"px";
        dot.style.top=y+"px";
        container.appendChild(dot);
    }
}
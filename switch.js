const btn = document.querySelector(".switch");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

btn.addEventListener("click", function () {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-theme");
  } else {
    document.body.classList.toggle("dark-theme");
  }
});
document.querySelector(".blur").addEventListener("click",function (){
         document.body.classList.toggle("blurred");
});
const shapes=document.querySelectorAll(".shape");

shapes.forEach(shape =>{
    shape.addEventListener("dragstart",e =>{
        shape.classList.add("dragging");
    });
    shape.addEventListener("dragend",e =>{
        shape.classList.remove("dragging");
        shape.style.position = "absolute";
        shape.style.left=e.pageX-shape.offsetWidth/2+"px";
        shape.style.top=e.pageY-shape.offsetHeight/2+"px";
    });
});
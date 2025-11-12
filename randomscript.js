const shapeContainer=document.querySelector('.shapecontainer');
let currentshape=null;

function createShape(){

    if (currentshape){
        currentshape.remove();
    }
  const shape = document.createElement('div');
  const randomshape = Math.floor(Math.random()*6)+1;
  const randomposition = Math.floor(Math.random()*3)+1;

  switch(randomshape){
    case 1:
        shape.className='shape circle-black';
        break;
    case 2:
        shape.className='shape circle-white';
        break;
    case 3:
        shape.className='shape rect-red';
        break;
    case 4:
        shape.className='shape square-or';
        break;
    case 5:
        shape.className='shape oval-blue';
        break;
    case 6:
        shape.className='shape star-pink';
        break;
   }
   let top,left;
   switch(randomposition){
    case 1:
        top=330;
        left=530;
        break;
    case 2:
        top=330;
        left=790;
        break;
    case 3:
        top=550;
        left=650;
        break;
   }
   shape.style.position='absolute';
   shape.style.top=`${top}px`;
   shape.style.left=`${left}px`;
   shape.style.transform='translate(-50%, -50%)';

   shapeContainer.appendChild(shape);
   currentshape=shape;
}
createShape();
setInterval(createShape,1000);


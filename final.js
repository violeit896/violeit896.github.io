let uploadedImage= null;
let userText='';
let selectedMood= null;
let userName='';
let drawcanvas=null;
let drawingMode=false;
let diaryEntries=[];
function setup(){
    drawcanvas=createCanvas(windowWidth,windowHeight);
    drawcanvas.parent('maincontainer');
    drawcanvas.style('background','transparent');
    noStroke();
    loadEntriesFromStorage();
    renderEntries(diaryEntries);
}
function draw(){}
function loadEntriesFromStorage(){
    const storedEntries=localStorage.getItem('diaryEntries');
    if(storedEntries){
        diaryEntries=JSON.parse (storedEntries);
    }
}
function saveEntriesToStorage(){
    try {
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        alert(
            'Storage is full – cannot save more images.\n' +
            'Please delete some older diary entries (Clear button) or use smaller images.'
        );
    }
}
function renderEntries(entriesToRender) {
    const grid = document.getElementById('diaryGrid');
    grid.innerHTML = '';

    entriesToRender.forEach(entry => {
        const newItem = document.createElement('div');
        newItem.className = 'grid-item';
        newItem.setAttribute('data-mood', entry.mood);
        newItem.setAttribute('data-timestamp', entry.timestamp); 

        const textElement = document.createElement('div');
        textElement.className = "text-overlay";
        const contentSpan = document.createElement('p');
        contentSpan.innerHTML = entry.content; 
        textElement.appendChild(contentSpan);

        const maskCanvas = document.createElement('canvas');
        maskCanvas.className = 'grid-item-mask';

        newItem.appendChild(textElement);
        newItem.appendChild(maskCanvas);
        grid.appendChild(newItem);

        const rect=newItem.getBoundingClientRect();
        maskCanvas.width=rect.width||300;
        maskCanvas.height=rect.height||300;
        const ctx = maskCanvas.getContext('2d');
        const img=new Image();
        maskCanvas.dataset.imgSrc=entry.image;
        img.onload=function(){
            ctx.globalCompositeOperation='source-over';
            ctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
            const canvasW = maskCanvas.width;
            const canvasH = maskCanvas.height;
            const imgW = img.width;
            const imgH = img.height;

            const canvasRatio = canvasW / canvasH;
            const imgRatio = imgW / imgH;

            let drawW, drawH, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
              drawH = canvasH;
              drawW = imgW * (drawH / imgH);
            } else {
             drawW = canvasW;
             drawH = imgH * (drawW / imgW);
            }
            offsetX = (canvasW - drawW) / 2;
            offsetY = (canvasH - drawH) / 2;
            ctx.drawImage(img,offsetX,offsetY,drawW,drawH);
        };
        img.src=entry.image;
    });
}

document.addEventListener('DOMContentLoaded',()=>{
    const dateEl=document.getElementById('currentDate');
    if(dateEl){
        const today=new Date();
        const options ={ weekday:'short', year:'numeric',month:'short', day:'numeric'}
        dateEl.textContent=today.toLocaleDateString('en-US',options);
    }
    const galleryBtn=document.getElementById('btnGallery');
    const clearBtn=document.getElementById('btnClear');
    if(galleryBtn){
        galleryBtn.addEventListener("click",()=>{
            window.location.href= 'thememoryrepository.html';
        });
    }
    if(clearBtn){
        clearBtn.addEventListener('click',()=>{
            if(confirm("Are you sure to clear all the diaries?")){
                localStorage.removeItem('diaryEntries');
                diaryEntries=[];
                renderEntries([]);
            }
        });
    }

    const moodBtn=document.getElementById('moodBtn');
    const moodOptions=document.getElementById('moodOptions');
    moodOptions.classList.add('hidden');
    moodBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      moodOptions.classList.toggle('hidden');
    });
    document.querySelectorAll('.moodopt').forEach(button=>{
        button.addEventListener('click',(e)=>{
           selectedMood=e.target.getAttribute('data-value');
            moodBtn.textContent=selectedMood;
            moodOptions.classList.add('hidden');
        });
    }); 
    document.addEventListener('click',(e)=>{
        if(!moodBtn.contains(e.target)&&!moodOptions.contains(e.target)){
            moodOptions.classList.add('hidden');
        }
    });

  const uploadBtn = document.getElementById('upload');
  const imageUploadInput = document.getElementById('imageUpload');
  uploadBtn.addEventListener('click', () => {
        imageUploadInput.click();
  });
  imageUploadInput.addEventListener('change',function(e){
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const maxSize = 900; 
            let w = img.width;
            let h = img.height;

            if (w > h && w > maxSize) {
                h = h * (maxSize / w);
                w = maxSize;
            } else if (h >= w && h > maxSize) {
                w = w * (maxSize / h);
                h = maxSize;
            }

            const offCanvas = document.createElement('canvas');
            offCanvas.width = w;
            offCanvas.height = h;
            const offCtx = offCanvas.getContext('2d');
            offCtx.drawImage(img, 0, 0, w, h);
            uploadedImage = offCanvas.toDataURL('image/jpeg', 0.3);
            uploadBtn.textContent = `SELECTED: ${file.name.substring(0, 20)}...`;
        };
        img.src = event.target.result;
       };
       reader.readAsDataURL(file);
    });

  const drawBtn=document.getElementById('drawBtn');
  const eraseBtn=document.getElementById('eraseBtn');
  const body=document.body;
  drawBtn.addEventListener('click',()=>{
    drawingMode=!drawingMode;
    if(drawingMode){
        body.classList.add('draw-mode');
        drawBtn.classList.add('active-pencil');
    }else{
        body.classList.remove('draw-mode');
        drawBtn.classList.remove('active-pencil');
    }
  });
  eraseBtn.addEventListener('click',()=>{
    eraseAllGridMasks();
    drawingMode=false;
    body.classList.remove('draw-mode');
  });
  function eraseAllGridMasks() {
        document.querySelectorAll('.grid-item-mask').forEach(maskCanvas => {
            const src = maskCanvas.dataset.imgSrc;
            if(!src)return;
            const restorectx=maskCanvas.getContext('2d');
            const img=new Image();
            img.onload=function(){
                ctx.globalCompositeOperation = 'source-over';
                ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                const canvasRatio = maskCanvas.width / maskCanvas.height;
                const imgRatio = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;
                if (imgRatio > canvasRatio) {
                  drawHeight = maskCanvas.height;
                  drawWidth = img.width * (drawHeight / img.height);
                  offsetX = (maskCanvas.width - drawWidth) / 2;
                  offsetY = 0;
                } else {
                  drawWidth = maskCanvas.width;
                  drawHeight = img.height * (drawWidth / img.width);
                  offsetX = 0;
                  offsetY = (maskCanvas.height - drawHeight) / 2;
                }
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            };
            img.src=src;
        });
    }

    const filterBtn=document.getElementById('filterBtn');
    const filteroptions=document.getElementById('filteroption');
    filteroptions.classList.add('hidden');
    filterBtn.addEventListener('click',(e)=>{
        e.stopPropagation();
        filteroptions.classList.toggle('hidden');
    });
    document.addEventListener('click',(e)=>{
        if(!filterBtn.contains(e.target)&&!filteroptions.contains(e.target)){
            filteroptions.classList.add('hidden');
        }
    });
    document.querySelectorAll('.filter-opt').forEach(button=>{
        button.addEventListener('click',(e)=>{
            const filterType=e.target.getAttribute('data-filter');
            filterBtn.textContent=e.target.textContent;
            filteroptions.classList.add('hidden');
            applyFilterAndSort(filterType);
        });
    });
    function applyFilterAndSort(filterType){
        let filteredAndSorted=[...diaryEntries];
        if (filterType !== 'None' && filterType !== 'Recent') {
            filteredAndSorted = filteredAndSorted.filter(entry => entry.mood === filterType);
        }
        if (filterType === 'Recent') {
            filteredAndSorted.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            filteredAndSorted.sort((a, b) => a.timestamp - b.timestamp);
        }
        renderEntries(filteredAndSorted);
    }

    const userNameInput=document.getElementById('userName');

  document.getElementById('saveBtn').addEventListener('click',()=>{
    if (!uploadedImage)return alert("Please upload an image first.");
    userText=document.getElementById('userText').value;
    userName=userNameInput.value||'Annonymous';
    if(!userText) return alert("Please type something first.");
    if(!selectedMood)return alert("Please select a mood.");

    const now = new Date();
    const timestamp=now.getTime();
    const timeString=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const contentHTML = `<b>${userName}</b><br>[${selectedMood} | ${timeString}]<br>${userText}`;
    
    const newEntry={
        id:timestamp,
        timestamp:timestamp,
        mood:selectedMood,
        userName:userName,
        image:uploadedImage,
        content:contentHTML,
    };
    diaryEntries.push(newEntry);
    saveEntriesToStorage();
    renderEntries(diaryEntries);

    document.getElementById('userText').value = '';
    userNameInput.value='';
    uploadBtn.textContent = 'Upload your picture of the day ';
    document.getElementById('moodBtn').textContent = 'Mood';
    imageUploadInput.value = '';
    uploadedImage=null;
    selectedMood=null;

  });
  
  const diaryGrid=document.getElementById('diaryGrid');
  const brushSize=40;

  diaryGrid.addEventListener('mousedown',(e)=>{
    if (!drawingMode || !e.target.classList.contains('grid-item-mask')) return;
    let isDrawing = true;
    const maskCanvas = e.target;
    const ctx=maskCanvas.getContext('2d');

    ctx.globalCompositeOperation='destination-out';
    ctx.fillStyle='rgba(0,0,0,1)';
    drawCircle(e,maskCanvas,ctx);
    const onMouseMove=(moveEvent)=>{
        if(!isDrawing) return;
        drawCircle(moveEvent,maskCanvas,ctx);
    };
    const onMouseUp=()=>{
        isDrawing=false;
        window.removeEventListener('mousemove',onMouseMove);
        window.removeEventListener('mouseup',onMouseUp);
    };
    window.addEventListener('mousemove',onMouseMove);
    window.addEventListener('mouseup',onMouseUp);
  });
  function drawCircle(event,canvas,ctx){
    const rect=canvas.getBoundingClientRect();
    const x=event.clientX-rect.left;
    const y=event.clientY-rect.top;
    ctx.beginPath();
    ctx.arc(x,y,brushSize/2,0,Math.PI*2);
    ctx.fill();
  };
});
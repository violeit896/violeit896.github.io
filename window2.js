document.addEventListener('DOMContentLoaded',()=>{
    const dateEl=document.getElementById('currentDate');
    if(dateEl){
        const today=new Date();
        const options ={ weekday:'short', year:'numeric',month:'short', day:'numeric'}
        dateEl.textContent=today.toLocaleDateString('en-US',options);
    }
    const clearBtn=document.getElementById('btnClear');
    const diaryBtn=document.getElementById('btnDiary');
    const galleryBtn=document.getElementById('btnGallery');
    if(diaryBtn){
        diaryBtn.addEventListener("click",()=>{
            window.location.href= 'software.html';
        });
    }
    if(galleryBtn){
        galleryBtn.addEventListener("click",()=>{
            window.location.href= 'thememoryrepository.html';
        });
    }
    if(clearBtn){
        clearBtn.addEventListener('click',()=>{
            if(confirm('Clear all saved diary entries?')){
                localStorage.removeItem('diaryEntries');
                document.querySelectorAll('.mood-ball').forEach(b=>b.remove());
            }
        });
    }
    window.addEventListener('load',initMoodBalls);
});
function initMoodBalls(){
    const tankhitbox=document.getElementById('tank-hitarea');
    if(!tankhitbox)return;
    const rect=tankhitbox.getBoundingClientRect();
    const stored=localStorage.getItem('diaryEntries');
    if(!stored)return;
    let entries;
    try{
        entries=JSON.parse(stored);
    }catch(e){
        console.error('failed to parse diaryEntries',e);
        return;
    }
    if(!Array.isArray(entries)||entries.length === 0)return;
    const moodColors={
         'Happy': '#ff96c2ff', 
         'So-so': '#ffc905ff', 
         'Tired': '#6df49aff', 
         'Sad': '#ff0000ff',
    };

    const balls=[];
    const BALL_SIZE=30;
    const radius=BALL_SIZE/2;
    const gravity=0.4;
    const bounce=0.55;

    entries.forEach(entry=>{
        const color=moodColors[entry.mood]||'#cccccc';
        const ballEl=document.createElement('div');
        ballEl.className='mood-ball';
        ballEl.style.backgroundColor=color;
        document.body.appendChild(ballEl);
        const x=random(rect.left+radius,rect.right-radius);
        const y=random(-window.innerHeight*0.6,-radius);
        balls.push({
            el:ballEl,
            x,
            y,
            vy:0,
            radius
        });
    });

    function animate(){
        const r=tankhitbox.getBoundingClientRect();
        const floor=r.bottom-radius;
        const left=r.left+radius;
        const right=r.right-radius;

        balls.forEach(ball=>{
            ball.vy+=gravity;
            ball.y+=ball.vy;
            if(ball.y>floor){
                ball.y=floor;
                ball.vy=-ball.vy*bounce;
                if(Math.abs(ball.vy)<0.2){
                    ball.vy=0;
                }
            }
            if (ball.x<left) ball.x=left;
            if(ball.x>right) ball.x=right;
            ball.el.style.left=(ball.x-ball.radius)+'px';
            ball.el.style.top=(ball.y-ball.radius)+'px';
        });
        requestAnimationFrame(animate);
    }
    animate();
}
function random(min,max){
    return Math.random()*(max-min)+min;
}
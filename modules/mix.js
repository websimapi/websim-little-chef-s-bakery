import { el, state } from './state.js';
import { chefSay } from './chef.js';
import { playSound } from './audio.js';
import { startBakePhase } from './bake.js';

export function startMixingPhase() {
    state.phase = 'stir';
    chefSay("Use the spoon to stir the batter! Mix it well!");

    const bowl = document.getElementById('bowl');
    
    bowl.innerHTML = `
        <img src="asset_bowl.png" style="width:100%; height:100%; object-fit:contain; position:absolute; top:0; left:0; pointer-events:none;">
        <div id="batter" style="
            width: 60%; 
            height: 60%; 
            background: ${state.currentRecipe.mixColor}; 
            border-radius: 50%; 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%) scale(0.8);
            box-shadow: inset 5px 5px 20px rgba(0,0,0,0.1);
            transition: transform 0.1s;
        "></div>
        <img id="spoon" src="asset_tool_spoon.png" draggable="false" style="
            width: 100px; 
            height: 100px; 
            position: absolute; 
            top: 40%; 
            left: 50%; 
            transform: translate(-50%, -50%) rotate(15deg); 
            cursor: grab;
            z-index: 100;
            filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.2));
        ">
    `;

    const batter = document.getElementById('batter');
    const spoon = document.getElementById('spoon');

    el.progress.classList.remove('hidden');
    state.mixProgress = 0;
    updateProgress();

    let isStirring = false;
    let lastX = 0;
    let lastY = 0;
    let totalDist = 0;

    const getLocalPos = (e) => {
        const rect = bowl.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleStart = (e) => {
        e.preventDefault();
        isStirring = true;
        spoon.style.cursor = 'grabbing';
        const pos = getLocalPos(e);
        lastX = pos.x;
        lastY = pos.y;
        updateSpoonPos(pos.x, pos.y);
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, {passive: false});
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
    };

    const handleMove = (e) => {
        if (!isStirring) return;
        e.preventDefault();
        const pos = getLocalPos(e);
        updateSpoonPos(pos.x, pos.y);

        const dist = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2));
        if (dist > 150) { 
             lastX = pos.x;
             lastY = pos.y;
             return;
        }

        totalDist += dist;
        lastX = pos.x;
        lastY = pos.y;

        if (totalDist > 15) {
            state.mixProgress += 3;
            totalDist = 0;
            updateProgress();
            
            const swirl = (state.mixProgress * 5) % 360;
            const scale = 0.8 + (state.mixProgress / 500); 
            batter.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${swirl}deg)`;
            
            if (state.mixProgress >= 100) {
                handleEnd();
                finishMixing();
            }
        }
    };

    const handleEnd = () => {
        isStirring = false;
        spoon.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
    };

    const updateSpoonPos = (x, y) => {
        const cx = 125;
        const cy = 125;
        const radius = 80;
        let dx = x - cx;
        let dy = y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > radius) {
            const angle = Math.atan2(dy, dx);
            x = cx + Math.cos(angle) * radius;
            y = cy + Math.sin(angle) * radius;
        }
        const tilt = (x - cx) * 0.2;
        spoon.style.left = `${x}px`;
        spoon.style.top = `${y}px`;
        spoon.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
    };

    bowl.addEventListener('mousedown', handleStart);
    bowl.addEventListener('touchstart', handleStart, {passive: false});
}

function updateProgress() {
    el.progressFill.style.width = `${Math.min(state.mixProgress, 100)}%`;
}

function finishMixing() {
    playSound('correct');
    el.progress.classList.add('hidden');
    const bowl = document.getElementById('bowl');
    const newBowl = bowl.cloneNode(true);
    bowl.parentNode.replaceChild(newBowl, bowl);
    chefSay("Perfect batter! Let's bake it.");
    setTimeout(startBakePhase, 2000);
}


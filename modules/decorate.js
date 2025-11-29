import { el, state } from './state.js';
import { DECORATIONS } from '../data.js';
import { chefSay } from './chef.js';
import { playSound } from './audio.js';
import { clearScene } from './utils.js';
import confetti from 'confetti';

export function startDecoratePhase() {
    clearScene();
    state.phase = 'decorate';
    chefSay("Time to decorate! Drag toppings onto your creation.");
    el.photoBtn.classList.remove('hidden');
    el.photoBtn.onclick = takePhoto;

    const product = document.createElement('div');
    product.id = 'final-product';
    product.style.position = 'absolute';
    product.style.top = '50%';
    product.style.left = '50%';
    product.style.transform = 'translate(-50%, -50%)';
    product.style.width = '300px';
    product.style.height = '300px';
    product.innerHTML = `<img src="${state.currentRecipe.base}" style="width:100%; height:100%;">`;
    el.gameLayer.appendChild(product);

    const palette = document.createElement('div');
    palette.style.position = 'absolute';
    palette.style.bottom = '0';
    palette.style.width = '100%';
    palette.style.height = '100px';
    palette.style.background = 'rgba(255,255,255,0.8)';
    palette.style.display = 'flex';
    palette.style.justifyContent = 'space-around';
    palette.style.alignItems = 'center';

    DECORATIONS.forEach(deco => {
        const item = document.createElement('img');
        item.src = deco.img;
        item.style.width = '60px';
        item.style.height = '60px';
        item.addEventListener('touchstart', (e) => spawnDecoration(e, deco.img));
        item.addEventListener('mousedown', (e) => spawnDecoration(e, deco.img));
        palette.appendChild(item);
    });

    el.gameLayer.appendChild(palette);
}

function spawnDecoration(e, imgSrc) {
    e.preventDefault();
    const deco = document.createElement('div');
    deco.className = 'ingredient';
    deco.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%;">`;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    deco.style.left = clientX + 'px';
    deco.style.top = clientY + 'px';
    deco.style.position = 'absolute';
    deco.style.width = '50px';
    deco.style.height = '50px';

    el.gameLayer.appendChild(deco);

    state.isDragging = true;
    state.dragElement = deco;
    state.dragOffset = { x: 25, y: 25 };
    deco.classList.add('dragging');

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, {passive: false});
    document.addEventListener('mouseup', dropDecoration);
    document.addEventListener('touchend', dropDecoration);
}

function handleMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    state.dragElement.style.left = (clientX - state.dragOffset.x) + 'px';
    state.dragElement.style.top = (clientY - state.dragOffset.y) + 'px';
}

function dropDecoration(e) {
    if (!state.dragElement) return;

    const rect = state.dragElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const relX = rect.left + (rect.width/2) - centerX;
    const relY = rect.top + (rect.height/2) - centerY;

    if (Math.abs(relX) < 150 && Math.abs(relY) < 150) {
        const src = state.dragElement.querySelector('img').src;
        const filename = src.substring(src.lastIndexOf('/') + 1);

        state.decorationsLog.push({
            img: filename,
            x: relX,
            y: relY
        });
        playSound('pop');
    }

    state.isDragging = false;
    state.dragElement.classList.remove('dragging');
    state.dragElement = null;

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', dropDecoration);
    document.removeEventListener('touchend', dropDecoration);
}

function takePhoto() {
    playSound('shutter');
    playSound('cheer');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    el.uiLayer.style.display = 'none';
    setTimeout(() => {
        el.uiLayer.style.display = 'block';
        chefSay("Delicious! Watch your baking movie?");

        const resetBtn = document.createElement('button');
        resetBtn.innerText = "New Recipe";
        resetBtn.style.position = 'absolute';
        resetBtn.style.top = '20px';
        resetBtn.style.left = '20px';
        resetBtn.onclick = () => window.location.reload();
        el.overlayLayer.appendChild(resetBtn);

        const replayBtn = document.createElement('button');
        replayBtn.innerText = "Watch Replay ";
        replayBtn.style.position = 'absolute';
        replayBtn.style.bottom = '100px';
        replayBtn.style.left = '50%';
        replayBtn.style.transform = 'translateX(-50%)';
        replayBtn.onclick = () => {
            document.getElementById('replay-layer').classList.remove('hidden');
            if (window.mountReplay) {
                window.mountReplay({
                    recipe: state.currentRecipe,
                    decorations: state.decorationsLog
                });
            }
        };
        el.overlayLayer.appendChild(replayBtn);

        el.photoBtn.remove();
    }, 1000);
}
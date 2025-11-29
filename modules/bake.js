import { el, state } from './state.js';
import { chefSay } from './chef.js';
import { playSound } from './audio.js';
import { clearScene } from './utils.js';
import { startDecoratePhase } from './decorate.js';

export function startBakePhase() {
    clearScene();
    state.phase = 'bake';

    const oven = document.createElement('div');
    oven.className = 'drop-zone';
    oven.style.width = '300px';
    oven.style.height = '300px';
    oven.innerHTML = `
        <img src="asset_oven.png">
        <div id="oven-window" style="position:absolute; top:30%; left:25%; width:50%; height:40%; background:#222; border-radius:10px; overflow:hidden; opacity:0.8;">
            <img src="${state.currentRecipe.base}" style="width:100%; height:100%; transform:scale(0.5); opacity:0.5; transition: all 4s;">
        </div>
    `;
    el.gameLayer.appendChild(oven);

    chefSay("Cooking... Wait for the ding!");

    setTimeout(() => {
        const dough = document.querySelector('#oven-window img');
        if(dough) {
            dough.style.transform = 'scale(0.9)';
            dough.style.opacity = '1';
        }
        oven.classList.add('pulse-btn');
    }, 500);

    setTimeout(() => {
        playSound('oven');
        oven.classList.remove('pulse-btn');
        chefSay("It's done!");
        setTimeout(startDecoratePhase, 2000);
    }, state.currentRecipe.bakeTime);
}


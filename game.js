import { RECIPES, DECORATIONS } from './data.js';
import confetti from 'confetti';

// --- Global State ---
const state = {
    currentRecipe: null,
    phase: 'menu', // menu, gather, mix, bake, decorate
    addedIngredients: [],
    mixProgress: 0,
    isDragging: false,
    dragElement: null,
    dragOffset: { x: 0, y: 0 }
};

// --- DOM Elements ---
const el = {
    container: document.getElementById('game-container'),
    gameLayer: document.getElementById('gameplay-layer'),
    overlayLayer: document.getElementById('overlay-layer'),
    chef: document.getElementById('chef-container'),
    speech: document.getElementById('speech-bubble'),
    bgm: document.getElementById('bgm'),
    progress: document.getElementById('progress-container'),
    progressFill: document.getElementById('progress-bar-fill'),
    photoBtn: document.getElementById('photo-btn')
};

// --- Audio Manager ---
const sounds = {
    pop: new Audio('sfx_pop.mp3'),
    correct: new Audio('sfx_correct.mp3'),
    cheer: new Audio('sfx_cheer.mp3'),
    oven: new Audio('sfx_oven_ding.mp3'),
    shutter: new Audio('sfx_shutter.mp3')
};

function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log('Audio error:', e));
    }
}

// --- Chef System ---
function chefSay(text, duration = 3000) {
    el.chef.classList.remove('hidden');
    el.speech.innerText = text;
    // Simple "speaking" animation (shake)
    el.chef.style.transform = "scale(1.1) rotate(-5deg)";
    setTimeout(() => el.chef.style.transform = "scale(1) rotate(0deg)", 200);
}

// --- Initialization ---
document.getElementById('start-btn').addEventListener('click', () => {
    el.bgm.play().catch(() => {});
    document.getElementById('start-screen').remove();
    showMenu();
});

// --- Scene: Menu ---
function showMenu() {
    clearScene();
    chefSay("What should we bake today?");

    const menuContainer = document.createElement('div');
    menuContainer.id = 'recipe-menu';

    Object.values(RECIPES).forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.icon}">
            <h3>${recipe.name}</h3>
        `;
        card.addEventListener('click', () => startRecipe(recipe));
        menuContainer.appendChild(card);
    });

    el.overlayLayer.appendChild(menuContainer);
}

function startRecipe(recipe) {
    state.currentRecipe = recipe;
    state.addedIngredients = [];
    document.getElementById('recipe-menu').remove();
    startGatherPhase();
}

// --- Scene: Gather & Mix (Combined for simplicity in DOM) ---
function startGatherPhase() {
    clearScene();
    state.phase = 'mix'; // We will put ingredients directly on screen to drag to bowl
    chefSay(`Let's make ${state.currentRecipe.name}! Drag ingredients to the bowl.`);

    // Create Bowl
    const bowl = document.createElement('div');
    bowl.className = 'drop-zone';
    bowl.id = 'bowl';
    bowl.innerHTML = `<img src="asset_bowl.png">`;
    el.gameLayer.appendChild(bowl);

    // Create Ingredients scattered around
    state.currentRecipe.ingredients.forEach((ing, index) => {
        createDraggableIngredient(ing, index);
    });
}

function createDraggableIngredient(ingData, index) {
    const ing = document.createElement('div');
    ing.className = 'ingredient';
    ing.dataset.id = ingData.id;
    ing.innerHTML = `<img src="${ingData.img}" style="width:100%; height:100%;">`;

    // Random Position on top/bottom shelves (visualized by position)
    const isTop = index % 2 === 0;
    ing.style.top = isTop ? '10%' : '75%';
    ing.style.left = `${10 + (index * 20)}%`;

    // Touch Events
    ing.addEventListener('mousedown', handleStart);
    ing.addEventListener('touchstart', handleStart, {passive: false});

    el.gameLayer.appendChild(ing);
}

// --- Drag Logic ---
function handleStart(e) {
    if (state.phase !== 'mix' && state.phase !== 'decorate') return;

    e.preventDefault();
    state.isDragging = true;
    state.dragElement = e.currentTarget;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = state.dragElement.getBoundingClientRect();
    state.dragOffset.x = clientX - rect.left;
    state.dragOffset.y = clientY - rect.top;

    state.dragElement.classList.add('dragging');

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, {passive: false});
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
}

function handleMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - state.dragOffset.x;
    const y = clientY - state.dragOffset.y;

    state.dragElement.style.left = `${x}px`;
    state.dragElement.style.top = `${y}px`;

    // Highlight Bowl if overlapping
    if (state.phase === 'mix') {
        const bowl = document.getElementById('bowl');
        if (checkOverlap(state.dragElement, bowl)) {
            bowl.classList.add('highlight');
        } else {
            bowl.classList.remove('highlight');
        }
    }
}

function handleEnd(e) {
    if (!state.isDragging) return;
    state.isDragging = false;
    state.dragElement.classList.remove('dragging');

    if (state.phase === 'mix') {
        const bowl = document.getElementById('bowl');
        if (checkOverlap(state.dragElement, bowl)) {
            // Success drop
            addIngredientToBowl(state.dragElement);
        } else {
            // Reset position (snap back logic could go here, but leaving it where dropped is fine for kids)
            // wiggle for feedback
            wiggle(state.dragElement);
        }
    }

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
    state.dragElement = null;
}

function checkOverlap(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r1.right < r2.left || 
             r1.left > r2.right || 
             r1.bottom < r2.top || 
             r1.top > r2.bottom);
}

function addIngredientToBowl(element) {
    playSound('pop');
    createSparkles(element.getBoundingClientRect());

    state.addedIngredients.push(element.dataset.id);
    element.remove();
    document.getElementById('bowl').classList.remove('highlight');

    // Check completion
    if (state.addedIngredients.length === state.currentRecipe.ingredients.length) {
        startMixingPhase();
    } else {
        chefSay("Good job! What's next?");
    }
}

// --- Mixing Phase (Stirring) ---
function startMixingPhase() {
    state.phase = 'stir';
    chefSay("All in! Now stir it up! Rub the bowl.");

    const bowl = document.getElementById('bowl');
    // Change bowl content to unmixed blob
    bowl.innerHTML = `<div style="width:100%; height:100%; background:${state.currentRecipe.mixColor}; border-radius:50%; transform: scale(0.5); transition: transform 0.5s;"></div>`;

    el.progress.classList.remove('hidden');
    state.mixProgress = 0;
    updateProgress();

    // Add stir listener
    let lastX = 0;
    const handleStir = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = Math.abs(clientX - lastX);
        lastX = clientX;

        if (diff > 2) { // Minimal movement
            state.mixProgress += 1; // Increment faster for kids
            updateProgress();

            // Visual feedback
            bowl.children[0].style.transform = `scale(${0.5 + (state.mixProgress/200)}) rotate(${state.mixProgress}deg)`;

            if (state.mixProgress >= 100) {
                bowl.removeEventListener('mousemove', handleStir);
                bowl.removeEventListener('touchmove', handleStir);
                finishMixing();
            }
        }
    };

    bowl.addEventListener('mousedown', (e) => { lastX = e.clientX; bowl.addEventListener('mousemove', handleStir); });
    bowl.addEventListener('touchstart', (e) => { lastX = e.touches[0].clientX; bowl.addEventListener('touchmove', handleStir); });

    document.addEventListener('mouseup', () => bowl.removeEventListener('mousemove', handleStir));
    document.addEventListener('touchend', () => bowl.removeEventListener('touchmove', handleStir));
}

function updateProgress() {
    el.progressFill.style.width = `${Math.min(state.mixProgress, 100)}%`;
}

function finishMixing() {
    playSound('correct');
    el.progress.classList.add('hidden');
    chefSay("Perfect batter! Let's bake it.");
    setTimeout(startBakePhase, 2000);
}

// --- Bake Phase ---
function startBakePhase() {
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

    // Animation
    setTimeout(() => {
        const dough = document.querySelector('#oven-window img');
        dough.style.transform = 'scale(0.9)';
        dough.style.opacity = '1';
        oven.classList.add('pulse-btn'); // Shake the oven a bit
    }, 500);

    setTimeout(() => {
        playSound('oven');
        oven.classList.remove('pulse-btn');
        chefSay("It's done!");
        setTimeout(startDecoratePhase, 2000);
    }, state.currentRecipe.bakeTime);
}

// --- Decorate Phase ---
function startDecoratePhase() {
    clearScene();
    state.phase = 'decorate';
    chefSay("Time to decorate! Drag toppings onto your creation.");
    el.photoBtn.classList.remove('hidden');
    el.photoBtn.onclick = takePhoto;

    // Main item
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

    // Topping Palette (Bottom bar)
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

        // Spawn drag copy
        item.addEventListener('touchstart', (e) => spawnDecoration(e, deco.img));
        item.addEventListener('mousedown', (e) => spawnDecoration(e, deco.img));

        palette.appendChild(item);
    });

    el.gameLayer.appendChild(palette);
}

function spawnDecoration(e, imgSrc) {
    e.preventDefault();
    const deco = document.createElement('div');
    deco.className = 'ingredient'; // Reuse class for sizing
    deco.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%;">`;

    // Position at touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    deco.style.left = clientX + 'px';
    deco.style.top = clientY + 'px';
    deco.style.position = 'absolute';
    deco.style.width = '50px';
    deco.style.height = '50px';

    el.gameLayer.appendChild(deco);

    // Manually trigger drag start
    state.isDragging = true;
    state.dragElement = deco;
    state.dragOffset = { x: 25, y: 25 }; // Center
    deco.classList.add('dragging');

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, {passive: false});
    document.addEventListener('mouseup', dropDecoration);
    document.addEventListener('touchend', dropDecoration);
}

function dropDecoration(e) {
    handleEnd(e); // Stop dragging
    playSound('pop');
    // We don't remove decorations, they stick where dropped
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

    el.uiLayer.style.display = 'none'; // Hide UI for moment
    setTimeout(() => {
        el.uiLayer.style.display = 'block';
        chefSay("Looks delicious! Tap the menu button to make more.");

        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.innerText = "New Recipe";
        resetBtn.style.position = 'absolute';
        resetBtn.style.top = '20px';
        resetBtn.style.left = '20px';
        resetBtn.onclick = () => window.location.reload();
        el.overlayLayer.appendChild(resetBtn);

        el.photoBtn.remove();
    }, 1000);
}

// --- Utils ---
function clearScene() {
    el.gameLayer.innerHTML = '';
    // Keep chef, but hide progress
    el.progress.classList.add('hidden');
}

function wiggle(element) {
    element.style.transform = 'translateX(-5px)';
    setTimeout(() => element.style.transform = 'translateX(5px)', 100);
    setTimeout(() => element.style.transform = 'translateX(-5px)', 200);
    setTimeout(() => element.style.transform = 'translate(0)', 300);
}

function createSparkles(rect) {
    for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = `${rect.left + rect.width/2 + (Math.random()*40-20)}px`;
        s.style.top = `${rect.top + rect.height/2 + (Math.random()*40-20)}px`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}
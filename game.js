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
    chefSay("Use the spoon to stir the batter! Mix it well!");

    const bowl = document.getElementById('bowl');
    
    // Rebuild bowl content to include batter and spoon
    // We keep the bowl image as the background context
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
        <img id="spoon" src="asset_tool_spoon.png" style="
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

    // Stir Logic
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
        
        // Snap spoon to finger initially?
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

        // Calculate distance moved
        const dist = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2));
        if (dist > 50) { // Limit huge jumps
             lastX = pos.x;
             lastY = pos.y;
             return;
        }

        totalDist += dist;
        lastX = pos.x;
        lastY = pos.y;

        // Progress based on movement
        if (totalDist > 20) { // Every 20px moved
            state.mixProgress += 2;
            totalDist = 0;
            updateProgress();
            
            // Visual feedback on batter
            const swirl = (state.mixProgress * 5) % 360;
            const scale = 0.8 + (state.mixProgress / 500); // Grow slightly
            batter.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${swirl}deg)`;
            
            // Play sound occasionally
            if (state.mixProgress % 10 === 0) {
               // Soft pop or just visual is fine. 
               // Maybe wiggle the bowl?
            }

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
        // Constrain to bowl area somewhat
        // Bowl is 250x250. Center is 125,125.
        // Let's allow movement within a radius.
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

        // Add some "stirring tilt"
        const tilt = (x - cx) * 0.2; // Tilt based on X position relative to center

        spoon.style.left = `${x}px`;
        spoon.style.top = `${y}px`;
        spoon.style.transform = `translate(-50%, -80%) rotate(${tilt}deg)`; // -80% Y to hold by handle? Adjust as needed
        // Spoon image center is roughly middle. 
        // If we want to look like holding handle, we might offset differently.
        // Let's stick to center-ish for simplicity.
        spoon.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
    };

    // Attach start listener to the whole bowl area to make it easy to grab
    bowl.addEventListener('mousedown', handleStart);
    bowl.addEventListener('touchstart', handleStart, {passive: false});
}

function updateProgress() {
    el.progressFill.style.width = `${Math.min(state.mixProgress, 100)}%`;
}

function finishMixing() {
    playSound('correct');
    el.progress.classList.add('hidden');
    
    // Remove listeners (cleanup handled in handleEnd but just in case)
    const bowl = document.getElementById('bowl');
    const newBowl = bowl.cloneNode(true); // Quick way to strip listeners
    bowl.parentNode.replaceChild(newBowl, bowl);
    
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
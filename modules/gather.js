import { el, state } from './state.js';
import { chefSay } from './chef.js';
import { clearScene, checkOverlap, createSparkles, wiggle } from './utils.js';
import { playSound } from './audio.js';
import { startMixingPhase } from './mix.js';

export function startGatherPhase() {
    clearScene();
    state.phase = 'mix'; 
    chefSay(`Let's make ${state.currentRecipe.name}! Drag ingredients to the bowl.`);

    const bowl = document.createElement('div');
    bowl.className = 'drop-zone';
    bowl.id = 'bowl';
    bowl.innerHTML = `<img src=\"asset_bowl.png\">`;
    el.gameLayer.appendChild(bowl);

    state.currentRecipe.ingredients.forEach((ing, index) => {
        createDraggableIngredient(ing, index);
    });
}

function createDraggableIngredient(ingData, index) {
    const ing = document.createElement('div');
    ing.className = 'ingredient';
    ing.dataset.id = ingData.id;
    ing.innerHTML = `<img src=\"${ingData.img}\" style=\"width:100%; height:100%;\">`;

    const isTop = index % 2 === 0;
    ing.style.top = isTop ? '10%' : '75%';
    ing.style.left = `${10 + (index * 20)}%`;

    ing.addEventListener('mousedown', handleStart);
    ing.addEventListener('touchstart', handleStart, {passive: false});

    el.gameLayer.appendChild(ing);
}

function handleStart(e) {
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

    const bowl = document.getElementById('bowl');
    if (bowl && checkOverlap(state.dragElement, bowl)) {
        bowl.classList.add('highlight');
    } else if (bowl) {
        bowl.classList.remove('highlight');
    }
}

function handleEnd(e) {
    if (!state.isDragging) return;
    state.isDragging = false;
    state.dragElement.classList.remove('dragging');

    const bowl = document.getElementById('bowl');
    if (bowl && checkOverlap(state.dragElement, bowl)) {
        addIngredientToBowl(state.dragElement);
    } else {
        wiggle(state.dragElement);
    }

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
    state.dragElement = null;
}

function addIngredientToBowl(element) {
    playSound('pop');
    createSparkles(element.getBoundingClientRect());

    state.addedIngredients.push(element.dataset.id);
    element.remove();
    document.getElementById('bowl').classList.remove('highlight');

    if (state.addedIngredients.length === state.currentRecipe.ingredients.length) {
        startMixingPhase();
    } else {
        chefSay("Good job! What's next?");
    }
}
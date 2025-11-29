import { el, state } from './state.js';
import { RECIPES } from '../data.js';
import { chefSay } from './chef.js';
import { clearScene } from './utils.js';
import { startGatherPhase } from './gather.js';

export function showMenu() {
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
        card.addEventListener('click', () => {
             state.currentRecipe = recipe;
             state.addedIngredients = [];
             state.decorationsLog = [];
             menuContainer.remove();
             startGatherPhase();
        });
        menuContainer.appendChild(card);
    });

    el.overlayLayer.appendChild(menuContainer);
}


import { el } from './state.js';

export function chefSay(text, duration = 3000) {
    el.chef.classList.remove('hidden');
    el.speech.innerText = text;
    // Simple "speaking" animation (shake)
    el.chef.style.transform = "scale(1.1) rotate(-5deg)";
    setTimeout(() => el.chef.style.transform = "scale(1) rotate(0deg)", 200);
}
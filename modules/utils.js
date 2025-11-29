import { el } from './state.js';

export function clearScene() {
    el.gameLayer.innerHTML = '';
    el.progress.classList.add('hidden');
}

export function wiggle(element) {
    element.style.transform = 'translateX(-5px)';
    setTimeout(() => element.style.transform = 'translateX(5px)', 100);
    setTimeout(() => element.style.transform = 'translateX(-5px)', 200);
    setTimeout(() => element.style.transform = 'translate(0)', 300);
}

export function createSparkles(rect) {
    for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = `${rect.left + rect.width/2 + (Math.random()*40-20)}px`;
        s.style.top = `${rect.top + rect.height/2 + (Math.random()*40-20)}px`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}

export function checkOverlap(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(r1.right < r2.left || 
             r1.left > r2.right || 
             r1.bottom < r2.top || 
             r1.top > r2.bottom);
}


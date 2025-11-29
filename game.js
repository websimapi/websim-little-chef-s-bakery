import { initElements, el } from './modules/state.js';
import { showMenu } from './modules/menu.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    
    document.getElementById('start-btn').addEventListener('click', () => {
        el.bgm.play().catch(() => {});
        document.getElementById('start-screen').remove();
        showMenu();
    });
    
    // Replay Close Button Logic
    document.getElementById('close-replay-btn').addEventListener('click', () => {
        document.getElementById('replay-layer').classList.add('hidden');
    });
});
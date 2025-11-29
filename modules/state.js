export const state = {
    currentRecipe: null,
    phase: 'menu', // menu, gather, mix, bake, decorate
    addedIngredients: [],
    mixProgress: 0,
    isDragging: false,
    dragElement: null,
    dragOffset: { x: 0, y: 0 },
    decorationsLog: [] // Store {img, x, y}
};

export const el = {
    container: null,
    gameLayer: null,
    uiLayer: null,
    overlayLayer: null,
    chef: null,
    speech: null,
    bgm: null,
    progress: null,
    progressFill: null,
    photoBtn: null
};

export function initElements() {
    el.container = document.getElementById('game-container');
    el.gameLayer = document.getElementById('gameplay-layer');
    el.uiLayer = document.getElementById('ui-layer');
    el.overlayLayer = document.getElementById('overlay-layer');
    el.chef = document.getElementById('chef-container');
    el.speech = document.getElementById('speech-bubble');
    el.bgm = document.getElementById('bgm');
    el.progress = document.getElementById('progress-container');
    el.progressFill = document.getElementById('progress-bar-fill');
    el.photoBtn = document.getElementById('photo-btn');
}
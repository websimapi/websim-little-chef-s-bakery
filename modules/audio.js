const sounds = {
    pop: new Audio('sfx_pop.mp3'),
    correct: new Audio('sfx_correct.mp3'),
    cheer: new Audio('sfx_cheer.mp3'),
    oven: new Audio('sfx_oven_ding.mp3'),
    shutter: new Audio('sfx_shutter.mp3')
};

export function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log('Audio error:', e));
    }
}
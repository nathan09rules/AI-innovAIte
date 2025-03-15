let values = [];
let challenges = {};
let feel = {};
let user = {};


score = document.getElementById("score")
console.log(user.score);
document.getElementById("score").textContent = user.score;

async function load() {
    const res = await fetch("static/resources/data.json");
    const data = await res.json();
    challenges = data.challenges;
    feel = data.feel;

    const userd = await fetch("static/data/user.json");
    user = await userd.json();
}

async function write(jsonData) {
    await fetch('/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    });
}

async function init() {
    await load();

    score.textContent = `SCORE : ${user.score}`;

    if (!user.date) {  
        let now = new Date().toISOString().split("T")[0];
        user.date = now;
        await write(user);
    }

    let dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.value = user.date;
    }
}

const music = document.getElementById("bg_music");
const sfx = new Audio("static/sounds/bloop-2-186531.mp3");

function Csfx() {
    sfx.volume = 0.1;
    sfx.currentTime = 0; 
    sfx.play();
}

document.addEventListener("click", Csfx);

document.addEventListener("DOMContentLoaded", () => {
    let dateInput = document.getElementById("date");
    dateInput.addEventListener("change", async () => {
        user.date = dateInput.value;
        await write(user);
    });
    });

function toggleMusic() {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

async function challenge(level) {
    const RNG = Math.floor(Math.random() * 9) + 1;
    document.getElementById("challenge").textContent = challenges[level][RNG];
}

init();

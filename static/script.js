let data_challenges = {};
let feel = {};
let user_data = {};


score = document.getElementById("score")
document.getElementById("score").textContent = `SCORE: ${user_data.score}`;

async function load() {
    const res = await fetch("static/resources/data.json");
    const data = await res.json();
    data_challenges = data.challenges;
    feel = data.feel;

    const userd = await fetch("static/data/user.json");
    user_data = await userd.json();
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

    score.textContent = `SCORE : ${user_data.score}`;

    if (!user_data.date) {  
        let now = new Date().toISOString().split("T")[0];
        user_data.date = now;
        await write(user_data);
    }

    let dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.value = user_data.date;
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
        user_data.date = dateInput.value;
        await write(user_data);
    });
    });

function toggleMusic() {
    const music = document.getElementById("bg_music");
    console.log(music.paused)
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

async function challenge(level) {
    const RNG = Math.floor(Math.random() * 9) + 1; // Fix Math.Floor -> Math.floor
    level = level.toString();
    // Ensure challenge_data exists and has the required properties
    if (data_challenges[level] && data_challenges[level][RNG]) {
        document.getElementById("challenge").textContent = data_challenges[level][RNG];
    } else {
        console.error("Invalid challenge data for level:", level, "RNG:", RNG);
        document.getElementById("challenge").textContent = "Challenge not found!";
    }
}

init();

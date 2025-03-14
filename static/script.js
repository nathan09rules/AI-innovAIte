let name = "";
let journal = "";
let values = [];

challenges = {}
feel = {}

async function load() {
    const res = await fetch("static/resources/data.json");
    const data = await res.json()
    challenges =  data.challenges;
    feel = data.feel;
}

function Csfx() {
    console.log("click");
    sfx.volume = 0.1;
    sfx.currentTime = 0; 
    sfx.play().catch(error => console.error("SFX play failed:", error));
}


const music = document.getElementById("bg_music");
const sfx = new Audio("static/sounds/bloop-2-186531.mp3");


load();

document.addEventListener("click", Csfx);


document.getElementById("journal").onsubmit = function(e){
    e.preventDefault();

    name = document.getElementById("name").value;
    journal = document.getElementById("journal_entry").value;
    
    document.getElementById("page 1").style.display = "none";
    document.getElementById("page 2").style.display = "block";
    
    fetch('http://127.0.0.1:5000/predict' , {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({input: journal})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("deppression").textContent = data.dep;
    }) 

    fetch('http://127.0.0.1:5000/fpredict' , {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({input: journal})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("situation").textContent = feel[data.feel.toString()] || "Unknown Feeling";
    }) 
    // continue this
}

document.getElementById("scale").onsubmit = function(e){
    e.preventDefault();

    document.getElementById("page 2").style.display = "none";
    document.getElementById("page 3").style.display = "block";
    
    // continue this
}

function toggleMusic() {
    music.volume = 0.5;
    if (music.paused) {
        console.log("Playing music...");
        music.play().catch(error => console.error("Music play failed:", error));
    } else {
        console.log("Pausing music...");
        music.pause();
    }
}

async function challenge(level) {
    data = challenges[level];
    const RNG = Math.floor(Math.random() * 9) + 1;
    document.getElementById("challenge").textContent = data[RNG];
}


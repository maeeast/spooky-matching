
let selectedCards = [];
let picks = 0;
let pairs = 0;
let timerOff = true;
let time = 0;
let timerId;
const totalPairs = 8;

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const cards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');

for (card of cards) {
    card.addEventListener('click', ()=>{
    });
}

deck.addEventListener('click', ()=>{
    const clickTarget = event.target;
    if (okToClick(clickTarget
    )) {
        selectCard(clickTarget);
        addSelectCard(clickTarget);
        if (selectedCards.length === 2) {
            areWeTwinning(clickTarget);
            addPick();
            checkPicks();;
        }
        if (pairs === totalPairs) {
            allDone();
        }
        if (timerOff) {
            startTimer();
            timerOff = false;
        }
    }
});

shuffleDeck();

document.querySelector('.restart').addEventListener('click', refreshGame);

function okToClick(clickTarget) {
    return(
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        selectedCards.length < 2 &&
        !selectedCards.includes(clickTarget)
    );
}

function selectCard(clickTarget){
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}

function addSelectCard(clickTarget){
    selectedCards.push(clickTarget);
}

function areWeTwinning() {
    if (
        selectedCards[0].firstElementChild.className ===
        selectedCards[1].firstElementChild.className
    ) {
        selectedCards[0].classList.toggle('match');
        selectedCards[1].classList.toggle('match');
        selectedCards = [];
        pairs++;
    } else {
        setTimeout(() => {
            selectCard(selectedCards[0]);
            selectCard(selectedCards[1]);
            selectedCards = [];
        }, 1000);
    }
}

function shuffleDeck() {
    const shuffleUs = Array.from(document.querySelectorAll('.deck li'));
    const mixItUp = shuffle(shuffleUs);
    for (card of mixItUp) {
        deck.appendChild(card);
    }
}


function addPick(){
    picks++;
    const pickText = document.querySelector('.moves');
    pickText.innerHTML = picks;
}

function checkPicks() {
    if (picks === 16 || picks === 24) {
        hideSkull();
    }
}

function hideSkull(){
    const skullList = document.querySelectorAll('.skulls li')
    for (skull of skullList) {
        if (skull.style.display !== 'none') {
            skull.style.display = 'none';
            break;
        }
    }
}

function refreshGame() {
    refreshPicks();
    refreshSkulls();
    shuffleDeck();
    refreshCards();
    window.location.reload();
    return false;
}

function refreshPicks() {
    picks = 0;
    document.querySelector('.moves').innerHTML = picks;
}

function refreshSkulls(){
    skulls = 0;
    const   skullList = document.querySelectorAll('.skulls li');
    for (skull of skullList) {
        skull.style.display = 'inline';
    }
}

function refreshCards() {
    const   cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function startTimer(){
    timerId = setInterval(() => {
        time++;
        showTime();
    }, 1000);
}

function showTime(){
    const timer = document.querySelector('.timer');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

function stopTimer(){
    clearInterval(timerId);
}

function showResults () {
    const results = document.querySelector('.results_background');
    results.classList.toggle('hide');

}

function getResults () {
    const clockTime = document.querySelector('.timer').innerHTML;
    const score = getSkulls();
    const timeStat = document.querySelector('.results_time');
    const moveStat = document.querySelector('.results_moves');
    const skullStat = document.querySelector('.results_skulls');


    timeStat.innerHTML = `Time: ${clockTime}`;
    moveStat.innerHTML = `Moves: ${picks}`;
    skullStat.innerHTML = `Skulls: ${score}`;
}

function getSkulls() {
    skulls = document.querySelectorAll('.skulls li');
    skullCount = 0;
    for (skull of skulls) {
        if (skull.style.display !== "none"){
            skullCount++;
        }
    }
    return skullCount;
}

function lightningOverlay() {
    const div = document.createElement('div');
    div.setAttribute('id', 'lightning');
    document.body.appendChild(div);
}

function clearLightning() {
    const element = document.querySelector('#lightning');
    element.remove();
}

function allDone() {
    lightningOverlay();
    playSound("sound/thunder.mp3");
    stopTimer();
    getResults();
    showResults();
    // document.querySelector('.lightning').classList.remove('lightning-strike');
}

document.querySelector('.results_close').addEventListener('click', () => {
    showResults();
    clearLightning();
});

document.querySelector('.results_cancel').addEventListener('click', () => {
    showResults();
    clearLightning();
});

document.querySelector('.results_try_again').addEventListener('click', () => {
    refreshGame();
    showResults();
    clearLightning();
});

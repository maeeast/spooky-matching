
let selectedCards = [];
let picks = 0;
let pairs = 0;
let timerOff = true;
let time = 0;
let timerId;
const totalPairs = 8;


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
        hideStar();
    }
}

function hideStar(){
    const starList = document.querySelectorAll('.stars li')
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

function refreshGame() {
    refreshPicks();
    refreshStars();
    shuffleDeck();
    refreshCards();
}

function refreshPicks() {
    picks = 0;
    document.querySelector('.moves').innerHTML = picks;
}

function refreshStars(){
    stars = 0;
    const   starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
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
    const score = getStars();
    const timeStat = document.querySelector('.results_time');
    const moveStat = document.querySelector('.results_moves');
    const starStat = document.querySelector('.results_stars');


    timeStat.innerHTML = `Time: ${clockTime}`;
    moveStat.innerHTML = `Moves: ${picks}`;
    starStat.innerHTML = `Stars: ${score}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== "none"){
            starCount++;
        }
    }
    return starCount;
}

function allDone() {
    stopTimer();
    getResults();
    showResults();
}

document.querySelector('.results_cancel, .results_close').addEventListener('click', () => {
    showResults();
});

document.querySelector('.results_try_again').addEventListener('click', () => {
    refreshGame();
    showResults();
});

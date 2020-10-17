let selectedCards = [];
let picks = 0;
let pairs = 0;
let timerOff = true;
let time = 0;
let timerId;
const totalPairs = 8;

window.onload = () => {
  toggleInstructions();
}

const playSound = url => {
  const audio = new Audio(url);
  audio.play();
}
// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const cards = document.querySelectorAll(".card");
const deck = document.querySelector(".deck");

for (card of cards) {
  card.addEventListener("click", () => {});
}

deck.addEventListener("click", () => {
  const clickTarget = event.target;
  if (okToClick(clickTarget)) {
    selectCard(clickTarget);
    addSelectCard(clickTarget);
    if (selectedCards.length === 2) {
      areWeTwinning(clickTarget);
      addPick();
      checkPicks();
    }
    if (pairs === totalPairs) {
      youWin();
    }
    if (timerOff) {
      startTimer();
      timerOff = false;
    }
  }
});

const shuffleDeck = () => {
  const shuffleUs = Array.from(document.querySelectorAll(".deck li"));
  const mixItUp = shuffle(shuffleUs);
  for (card of mixItUp) {
    deck.appendChild(card);
  }
}

const refreshGame = () => {
  refreshPicks();
  refreshSkulls();
  shuffleDeck();
  refreshCards();
  refreshTimer();
}


shuffleDeck();

document.querySelector(".restart").addEventListener("click", refreshGame);

const toggleInstructions = () =>{
  const instructions = document.querySelector(".instructions_background");
  instructions.classList.toggle("hide");
}

const clearInstructions = () =>{
  const instructions = document.querySelector(".instructions_background");
  instructions.parentNode.removeChild(instructions);
}

document.querySelector(".instructions_start").addEventListener("click", () => {
  clearInstructions();
});

const okToClick = clickTarget => {
  return (
    clickTarget.classList.contains("card") &&
    !clickTarget.classList.contains("match") &&
    selectedCards.length < 2 &&
    !selectedCards.includes(clickTarget)
  );
}
const selectCard = clickTarget => {
  clickTarget.classList.toggle("open");
  clickTarget.classList.toggle("show");
}

const addSelectCard = clickTarget => {
  selectedCards.push(clickTarget);
}

const areWeTwinning = () => {
  if (
    selectedCards[0].firstElementChild.className ===
    selectedCards[1].firstElementChild.className
  ) {
    selectedCards[0].classList.toggle("match");
    selectedCards[1].classList.toggle("match");
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

const addPick = () => {
  picks++;
  const pickText = document.querySelector(".moves");
  pickText.innerHTML = picks;
}

const checkPicks = () => {
  if (picks === 16 || picks === 24) {
    hideSkull();
  } else if (picks === 32) {
    hideSkull();
    youLose();
  }
}

const hideSkull = () => {
  const skullList = document.querySelectorAll(".skulls li");
  for (skull of skullList) {
    if (skull.style.display !== "none") {
      skull.style.display = "none";
      break;
    }
  }
}

const refreshTimer = () => {
  timerOff = true;
  time = 0;
  clearInterval(timerId);
  const timer = document.querySelector(".timer");
  timer.innerHTML = `0:0${time}`;
}

const refreshPicks = () => {
  picks = 0;
  document.querySelector(".moves").innerHTML = picks;
}

const refreshSkulls = () => {
  skulls = 0;
  const skullList = document.querySelectorAll(".skulls li");
  for (skull of skullList) {
    skull.style.display = "inline";
  }
}

const refreshCards = () => {
  pairs=0;
  const cards = document.querySelectorAll(".deck li");
  for (let card of cards) {
    card.className = "card";
  }
}
const startTimer = () => {
  timerId = setInterval(() => {
    time++;
    showTime();
  }, 1000);
}

const showTime = () => {
  const timer = document.querySelector(".timer");
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    timer.innerHTML = `${minutes}:0${seconds}`;
  } else {
    timer.innerHTML = `${minutes}:${seconds}`;
  }
}

const stopTimer = () => {
  clearInterval(timerId);
}

const showResults = () => {
  const results = document.querySelector(".results_background");
  results.classList.toggle("hide");
}

const getResults = () => {
  const clockTime = document.querySelector(".timer").innerHTML;
  const score = getSkulls();
  const timeStat = document.querySelector(".results_time");
  const moveStat = document.querySelector(".results_moves");
  const skullStat = document.querySelector(".results_skulls");

  timeStat.innerHTML = `Time: ${clockTime}`;
  moveStat.innerHTML = `Moves: ${picks}`;
  skullStat.innerHTML = `Skulls: ${score}`;
}

const getSkulls = () => {
  skulls = document.querySelectorAll(".skulls li");
  skullCount = 0;
  for (skull of skulls) {
    if (skull.style.display !== "none") {
      skullCount++;
    }
  }
  return skullCount;
}

const lightningOverlay = () => {
  const div = document.createElement("div");
  div.setAttribute("id", "lightning");
  document.body.appendChild(div);
}

const clearLightning = () => {
  const element = document.querySelector("#lightning");
  element.remove();
}

const allDone = () => {
  lightningOverlay();
  playSound("sound/thunder.mp3");
  stopTimer();
  getResults();
  showResults();
}

const youLose = () => {
  const title = document.querySelector(".results_title")
  title.innerHTML = 'You Lose!';
  allDone();
}

const youWin = () => {
  const title = document.querySelector(".results_title")
  title.innerHTML = 'You Win!';
  allDone();
}

document.querySelector(".results_close").addEventListener("click", () => {
  showResults();
  clearLightning();
});

document.querySelector(".results_cancel").addEventListener("click", () => {
  showResults();
  clearLightning();
});

document.querySelector(".results_try_again").addEventListener("click", () => {
  refreshGame();
  showResults();
  clearLightning();
});

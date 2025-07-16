("use-strict");

let pointsCounter = 100;
let totalPoints = 0;
let roundsCounter = 0;
let bestRoundsTry;
let answerIndexes = [];
let secretIndex;
let userInput;
let gameStatus = "off";
let modeStatus = "off";
let hardModePenalty = 1;
const allMods = ["easy", "medium", "hard"];

const modeMessageContainer = document.querySelector(".mode-message-container");
const guessPlant = document.querySelector(".guess-plant");
const plantCard = document.querySelector(".plant-card");
const header = document.querySelector("header");
const answerHard = document.querySelector(".answer-hard");
const hardGuessInput = document.querySelector(".hard-guess");
const congratulationAnimation = document.getElementById("congratulationAnimation");
const congratulationContainer = document.querySelector(".congratulation-container");

const displayAnswerMessage = function (message) {
  document.querySelector(".answer-message").textContent = message;
};

const displayClickMessage = function (message) {
  document.querySelector(".click-message").textContent = message;
};

const displayPoints = function (points) {
  document.querySelector(".points-counter").textContent = points;
};

const displayRounds = function (rounds) {
  document.querySelector(".round-counter").textContent = rounds;
};

const displayTotalPoints = function (totalPoints) {
  document.querySelector(".total-points").textContent = totalPoints;
};

const displayModsMessage = function (message) {
  document.querySelector(".mods-message").textContent = message;
};

const displayBestRounds = function (score) {
  document.querySelector(".best-try").textContent = score !== undefined && score !== null ? score : "---";
};

const displayCorrectFeedback = function () {
  displayAnswerMessage("Correct");
  displayClickMessage("Click here for next Round");
};

displayBestRounds(bestRoundsTry);

// When player chooses mode
const chooseMode = function (modeName) {
  if (modeStatus === "off" && (gameStatus === "off" || gameStatus === "on" || gameStatus === "pause")) {
    modeStatus = modeName;
    allMods.forEach(mode => {
      document.querySelector(`.${mode}-mode`).classList.add("hidden");
    });
    modeMessageContainer.classList.add("hidden");
    document.querySelector(`.btn-${modeName}`).classList.add(`color-${modeName}`);
    document.querySelector(`.${modeName}-mode`).classList.remove("hidden");
  } else if (modeStatus === modeName && gameStatus === "off") {
    modeStatus = "off";
    modeMessageContainer.classList.remove("hidden");
    document.querySelector(`.btn-${modeName}`).classList.remove(`color-${modeName}`);
    document.querySelector(`.${modeName}-mode`).classList.add("hidden");
  } else if (modeStatus === modeName && (gameStatus === "on" || gameStatus === "pause")) {
    modeStatus = "off";
    displayModsMessage(`You can return to ${modeName} mode or start a New game (Try again)`);
    modeMessageContainer.classList.remove("hidden");
    document.querySelector(`.btn-${modeName}`).classList.remove(`color-${modeName}`);
    document.querySelector(`.${modeName}-mode`).classList.add("hidden");
    allMods.forEach(mode => {
      document.querySelector(`.${mode}-message`).classList.add("hidden");
    });
    document.querySelector(`.${modeName}-message`).classList.remove("hidden");
  }
};

document.querySelector(".btn-easy").addEventListener("click", () => chooseMode("easy"));
document.querySelector(".btn-medium").addEventListener("click", () => chooseMode("medium"));
document.querySelector(".btn-hard").addEventListener("click", () => chooseMode("hard"));

// When player starts a new game
const answerGenerator = function (modeName, answersCount, randomPositionRange) {
  while (answerIndexes.length < answersCount) {
    let randomIndex = Math.trunc(Math.random() * plants.length);
    if (randomIndex !== secretIndex && !answerIndexes.includes(randomIndex)) {
      answerIndexes.push(randomIndex);
    }
  }
  let randomPosition = Math.trunc(Math.random() * randomPositionRange);
  answerIndexes.splice(randomPosition, 0, secretIndex);
  document.querySelectorAll(`.answer-${modeName}`).forEach((btn, index) => {
    btn.textContent = plants[answerIndexes[index]].name;
    btn.classList.remove("wrong-answer");
    btn.classList.remove("correct-answer");
    btn.disabled = false;
  });
};

const initializeRound = function () {
  gameStatus = "on";
  answerIndexes = [];
  secretIndex = Math.trunc(Math.random() * plants.length);

  pointsCounter = 100;
  displayPoints(pointsCounter);
  roundsCounter++;
  displayRounds(roundsCounter);

  guessPlant.src = plants[secretIndex].image;
  plantCard.style.background = "#F0EAD2";
  guessPlant.style.width = "95%";
  plantCard.disabled = true;
  hardGuessInput.value = "";
  displayAnswerMessage("");
  displayClickMessage("Start guessing...");
  header.classList.remove("correct-answer-border");
  plantCard.classList.remove("correct-answer-frame");
  answerHard.classList.remove("correct-answer");
  answerHard.disabled = false;
  answerHard.textContent = "Check";

  allMods.forEach(mode => {
    document.querySelector(`.btn-${mode}`).disabled = true;
  });
  document.querySelector(`.btn-${modeStatus}`).disabled = false;

  if (!isWarningAccepted) isWarningShowed = false;
  hardModePenalty = 1;
  isBtnHint = false;
  modalHint.classList.add("hidden");
  btnHint.classList.remove("yellow-btn");
};

plantCard.addEventListener("click", function () {
  if (gameStatus === "off" && totalPoints >= 1000) {
    return;
  }
  if (modeStatus === "off") return;

  initializeRound();

  if (modeStatus === "easy") {
    answerGenerator("easy", 3, 4);
  } else if (modeStatus === "medium") {
    answerGenerator("medium", 9, 10);
  }
});

// When player resets a previous game
const resetMods = function () {
  allMods.forEach(mode => {
    document.querySelector(`.btn-${mode}`).classList.remove(`color-${mode}`);
    document.querySelector(`.${mode}-mode`).classList.add("hidden");
    document.querySelector(`.btn-${mode}`).disabled = false;
  });
};

const resetPlantCard = function () {
  guessPlant.src = "assets/icons/question-mark.svg";
  plantCard.style.background = "#A98467";
  guessPlant.style.width = "100px";
  plantCard.disabled = false;
};

const resetAnswerBtns = function () {
  ["easy", "medium"].forEach(mode => {
    document.querySelectorAll(`.answer-${mode}`).forEach(btn => {
      btn.classList.remove("wrong-answer");
      btn.classList.remove("correct-answer");
      btn.disabled = false;
      btn.textContent = "Answer";
    });
  });
  answerHard.disabled = false;
  answerHard.textContent = "Check";
};

const resetBordersColor = function () {
  header.classList.remove("correct-answer-border");
  plantCard.classList.remove("correct-answer-frame");
};

const resetModsMessage = function () {
  allMods.forEach(mode => {
    document.querySelector(`.${mode}-message`).classList.remove("hidden");
  });
  modeMessageContainer.classList.remove("hidden");
  displayModsMessage("Select the mode");
};

document.querySelector(".again").addEventListener("click", function () {
  resetModsMessage();
  resetMods();
  resetPlantCard();
  resetAnswerBtns();
  resetBordersColor();
  displayAnswerMessage("");
  displayClickMessage("Click here to Start");
  gameStatus = "off";
  pointsCounter = 100;
  totalPoints = 0;
  roundsCounter = 0;
  modeStatus = "off";
  hardGuessInput.value = "";
  displayTotalPoints(totalPoints);
  displayPoints(pointsCounter);
  displayRounds(roundsCounter);
});

// MODAL WINDOW
// Info
let isBtnInfo = false;
const overlay = document.querySelector(".overlay");
const modalInfo = document.querySelector(".modal-info");
const btnInfo = document.querySelector(".show-info");
const btnCloseInfo = document.querySelector(".close-info");
const openModalInfo = function () {
  if (!isBtnInfo) {
    modalInfo.classList.remove("hidden");
    overlay.classList.remove("hidden");
    btnInfo.classList.add("yellow-btn");
    isBtnInfo = true;
  } else {
    modalInfo.classList.add("hidden");
    overlay.classList.add("hidden");
    btnInfo.classList.remove("yellow-btn");
    isBtnInfo = false;
  }
};
const closeModalInfo = function () {
  modalInfo.classList.add("hidden");
  overlay.classList.add("hidden");
  btnInfo.classList.remove("yellow-btn");
  isBtnInfo = false;
};

btnInfo.addEventListener("click", openModalInfo);
btnCloseInfo.addEventListener("click", closeModalInfo);
overlay.addEventListener("click", function () {
  if (!modalInfo.classList.contains("hidden")) closeModalInfo();
  if (!modalWarning.classList.contains("hidden")) closeModalWarning();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (!modalInfo.classList.contains("hidden")) closeModalInfo();
    if (!modalWarning.classList.contains("hidden")) closeModalWarning();
    if (!congratulationContainer.classList.contains("hidden")) closeCelebrateVictory();
  }
});

// Modal Warning
let isWarningAccepted = false;
let isWarningShowed = false;
const modalWarning = document.querySelector(".modal-warning");
const btnCloseWarning = document.querySelector(".close-warning");
const btnCancelWarning = document.querySelector(".cancel-warning");
const btnAcceptWarning = document.querySelector(".accept-warning");
btnAcceptWarning.addEventListener("click", function () {
  isWarningAccepted = true;
  closeModalWarning();
});
const openModalWarning = function () {
  gameStatus = "pause";
  modalWarning.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const closeModalWarning = function () {
  modalWarning.classList.add("hidden");
  overlay.classList.add("hidden");
  setTimeout(() => {
    if (modeStatus !== "off") {
      gameStatus = "on";
    }
  }, 0);
};
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !modalWarning.classList.contains("hidden")) {
    btnAcceptWarning.click();
    e.preventDefault();
    e.stopPropagation();
  }
});
overlay.addEventListener("click", closeModalWarning);

// Hint
let isBtnHint = false;
const modalHint = document.querySelector(".modal-hint");
const btnHint = document.querySelector(".show-hint");
const btnCloseHint = document.querySelector(".close-hint");
const plantNamesList = document.querySelector(".plant-names-list");
const generatePlantList = function () {
  plantNamesList.innerHTML = "";
  if (typeof plants !== "undefined" && plants.length > 0) {
    plants.forEach((plant, i) => {
      const listItem = document.createElement("li");
      const number = (i + 1).toString() + ".";
      const numberSpan = document.createElement("span");
      numberSpan.textContent = number;
      numberSpan.classList.add("plant-number");
      const nameSpan = document.createElement("span");
      nameSpan.textContent = plant.name;
      listItem.appendChild(numberSpan);
      listItem.appendChild(nameSpan);
      plantNamesList.appendChild(listItem);
    });
  }
};

const openModalHint = function () {
  if (modeStatus === "hard" && !isWarningAccepted && gameStatus === "on" && !isWarningShowed) {
    isWarningShowed = true;
    openModalWarning();
    return;
  }
  if (modeStatus === "hard" && gameStatus === "on") {
    hardModePenalty = 5;
  }
  if (!isBtnHint) {
    isBtnHint = true;
    modalHint.classList.remove("hidden");
    btnHint.classList.add("yellow-btn");
    generatePlantList();
  } else {
    isBtnHint = false;
    modalHint.classList.add("hidden");
    btnHint.classList.remove("yellow-btn");
  }
};

plantNamesList.addEventListener("wheel", function (e) {
  if (e.deltaY !== 0) {
    e.preventDefault();
    plantNamesList.scrollLeft += e.deltaY;
  }
});

btnHint.addEventListener("click", openModalHint);
btnCloseHint.addEventListener("click", openModalHint);

// Congratulations

let lottieInstance;
let balloonsInstance;

const celebrateVictory = function () {
  if (congratulationContainer) {
    congratulationContainer.classList.remove("hidden");

    if (!lottieInstance) {
      lottieInstance = lottie.loadAnimation({
        container: document.getElementById("congratulationAnimation"),
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "assets/animations/Congratulations.json",
      });
      lottieInstance.addEventListener("complete", function () {
        lottieInstance.goToAndStop(lottieInstance.totalFrames, true);
      });
    } else {
      lottieInstance.goToAndStop(0, true);
      lottieInstance.play();
    }

    if (!balloonsInstance) {
      balloonsInstance = lottie.loadAnimation({
        container: document.getElementById("balloonsAnimation"),
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "assets/animations/ConfettiBallons.json",
      });
      balloonsInstance.addEventListener("complete", function () {
        balloonsInstance.goToAndStop(balloonsInstance.totalFrames, true);
      });
    } else {
      balloonsInstance.goToAndStop(0, true);
      balloonsInstance.play();
    }
  }
};

const closeCelebrateVictory = function () {
  if (congratulationContainer) {
    congratulationContainer.classList.add("hide-animation");
    setTimeout(() => {
      congratulationContainer.classList.add("hidden");
      congratulationContainer.classList.remove("hide-animation");
      if (lottieInstance) lottieInstance.stop();
      if (balloonsInstance) balloonsInstance.stop();
    }, 1000);
  }
};

congratulationContainer.addEventListener("click", closeCelebrateVictory);

// GAME LOGIC
const selectAnswer = function (modeName, penaltyPoints) {
  document.querySelectorAll(`.answer-${modeName}`).forEach((btn, index) => {
    btn.addEventListener("click", function () {
      if (gameStatus === "off" || modeStatus !== modeName) {
        return;
      } else if (answerIndexes[index] !== secretIndex) {
        pointsCounter -= penaltyPoints;
        btn.classList.add("wrong-answer");
        btn.disabled = true;
        displayAnswerMessage("Wrong");
        displayPoints(pointsCounter);
      } else {
        displayCorrectFeedback();
        gameStatus = "pause";
        plantCard.disabled = false;
        header.classList.add("correct-answer-border");
        plantCard.classList.add("correct-answer-frame");
        btn.classList.add("correct-answer");
        totalPoints += pointsCounter;
        displayTotalPoints(totalPoints);
        document.querySelectorAll(`.answer-${modeName}`).forEach(btn => {
          btn.disabled = true;
          if (totalPoints >= 1000) {
            gameStatus = "off";
            celebrateVictory();
            displayClickMessage("You Win !!!");
            if (bestRoundsTry === undefined || roundsCounter < bestRoundsTry) {
              bestRoundsTry = roundsCounter;
              displayBestRounds(bestRoundsTry);
            }
          }
        });
      }
    });
  });
};

selectAnswer("easy", 25);
selectAnswer("medium", 10);

const submitAnswer = function (penaltyPoints) {
  userInput = document.querySelector(".hard-guess").value.toLowerCase().trim();
  if (gameStatus === "off" || modeStatus !== "hard" || userInput === "") {
    return;
  } else if (
    userInput === plants[secretIndex].name.toLowerCase() ||
    userInput === plants[secretIndex].secondName.toLowerCase()
  ) {
    displayCorrectFeedback();
    gameStatus = "pause";
    plantCard.disabled = false;
    header.classList.add("correct-answer-border");
    plantCard.classList.add("correct-answer-frame");
    answerHard.classList.add("correct-answer");
    answerHard.textContent = "Correct";
    totalPoints += pointsCounter;
    displayTotalPoints(totalPoints);
    answerHard.disabled = true;
  } else {
    pointsCounter -= penaltyPoints;
    answerHard.classList.add("wrong-answer-hard");
    answerHard.textContent = "Wrong";
    setTimeout(() => {
      answerHard.textContent = "Check";
      answerHard.classList.remove("wrong-answer-hard");
    }, 1000);
    displayAnswerMessage("Wrong");
    displayPoints(pointsCounter);
  }
  if (totalPoints >= 1000) {
    gameStatus = "off";
    celebrateVictory();
    displayClickMessage("Press Try Again for New Game");
    if (bestRoundsTry === undefined || roundsCounter < bestRoundsTry) {
      bestRoundsTry = roundsCounter;
      displayBestRounds(bestRoundsTry);
    }
  }
};

const checkAnswer = function () {
  answerHard.addEventListener("click", () => submitAnswer(hardModePenalty));
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && modeStatus === "hard" && gameStatus === "on") submitAnswer(hardModePenalty);
  });
};

checkAnswer();

// Warning acception
btnAcceptWarning.addEventListener("click", function () {
  isWarningAccepted = true;
  closeModalWarning();
});
btnCloseWarning.addEventListener("click", function () {
  isWarningAccepted = false;
  closeModalWarning();
});
btnCancelWarning.addEventListener("click", function () {
  isWarningAccepted = false;
  closeModalWarning();
});

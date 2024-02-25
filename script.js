"use strict";

// Selecting elements
// Use to remove and add winner/active
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

// Scores elements
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
// const current0El = document.getElementById("current--0");
// const current1El = document.getElementById("current--1");

// New game button
const btnNew = document.querySelector(".btn--new");
// Undo Button
const btnUndo = document.querySelector(".btn--undo");

// player element: Event listener to "ENTER"
const player1Submit = document.getElementById("player1Form");
const player2Submit = document.getElementById("player2Form");

// player element: Value in the field of the form and area of the form itself but no action of submit
const player1Input = document.querySelector(".player--input1");
const player2Input = document.querySelector(".player--input2");

// Comparison Box between both player's score
const comparisonBox = document.querySelector(".comparison-box");

const rulesModal = document.querySelector(".rules-modal");
const inputModal = document.querySelector(".input-modal");
const overlay = document.querySelector(".overlay");
const closeRulesModal = document.querySelector(".close-rules-modal");
const closeInputModal = document.querySelector(".close-input-modal");
const showRulesModalBtn = document.querySelector(".show-rules-modal");
const showInputModalBtn = document.querySelector(".show-input-modal");
const numberRangeForm = document.getElementById("numberRangeForm");
const showRulesIcon = document.querySelector(".show-rules-icon");
const showInputIcon = document.querySelector(".show-input-icon");
const aboutModal = document.querySelector(".about-modal");
const closeAboutModalBtn = document.querySelector(".close-about-modal");
const showAboutModalBtn = document.querySelector(".show-about-modal");

// const casesModal = document.querySelector(".cases-modal");
// const closeCasesModal = document.querySelector(".close-cases-modal");
// const showCasesModalBtn = document.querySelector(".show-cases-modal");

const strategyModal = document.querySelector(".strategy-modal");
const closeStrategyModal = document.querySelector(".close-strategy-modal");
const showStrategyModalBtn = document.querySelector(".show-strategy-modal");

const openStrategyModal = function () {
  strategyModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  strategyModal.classList.add("shift-right");
};

const closeStrategyModalFn = function () {
  strategyModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

showStrategyModalBtn.addEventListener("click", openStrategyModal);
closeStrategyModal.addEventListener("click", closeStrategyModalFn);

// const openCasesModal = function () {
//   casesModal.classList.remove("hidden");
//   overlay.classList.remove("hidden");
//   casesModal.classList.add("shift-right");
// };

// const closeCasesModalFn = function () {
//   casesModal.classList.add("hidden");
//   overlay.classList.add("hidden");
// };

// showCasesModalBtn.addEventListener("click", openCasesModal);
// closeCasesModal.addEventListener("click", closeCasesModalFn);

const openAboutModal = function () {
  aboutModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  aboutModal.classList.add("shift-right");
  // Include any additional logic here if needed
};

const closeAboutModalFn = function () {
  aboutModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Event listeners to show/hide the about modal
showAboutModalBtn.addEventListener("click", openAboutModal);
closeAboutModalBtn.addEventListener("click", closeAboutModalFn);

// Function to open the rules modal
const openRulesModal = function () {
  rulesModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  rulesModal.classList.add("shift-right");
};

// Function to close the rules modal
const closeRulesModalFn = function () {
  rulesModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Function to open the input modal
const openInputModal = function () {
  inputModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  inputModal.classList.add("shift-right");
};

// Function to close the input modal
const closeInputModalFn = function () {
  inputModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Function to close any modal
const closeModal = function () {
  rulesModal.classList.add("hidden");
  inputModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Event listeners for modals and buttons
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

overlay.addEventListener("click", function () {
  closeModal();
});

showRulesModalBtn.addEventListener("click", openRulesModal);
closeRulesModal.addEventListener("click", closeRulesModalFn);

showInputModalBtn.addEventListener("click", openInputModal);
closeInputModal.addEventListener("click", closeInputModalFn);

// New event listeners for collapsed sidebar icons
showRulesIcon.addEventListener("click", openRulesModal);
showInputIcon.addEventListener("click", openInputModal);

let globalStartNumber;
let globalEndNumber;

numberRangeForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the values from the form
  const startNumber = parseInt(document.getElementById("startNumber").value);
  const endNumber = parseInt(document.getElementById("endNumber").value);

  if (!isNaN(startNumber) && !isNaN(endNumber) && startNumber < endNumber) {
    globalStartNumber = startNumber; // Store globally
    globalEndNumber = endNumber; // Store globally
    init(); // Call the init function
    closeInputModalFn(); // Close the input modal or perform necessary actions
  } else {
    // console.log("Invalid number range!");
  }
});

function generateNumberField(startNumber, endNumber) {
  const newNumberField = [];
  for (let i = startNumber; i <= endNumber; i++) {
    newNumberField.push(i);
  }
  return newNumberField;
}

const caseButtons = document.querySelectorAll(".cases-modal .case");

// Function to handle the data-case attribute
function handleDataCase(dataCaseValue) {
  const numbers = dataCaseValue.split(",").map(Number);
  const startNumber = numbers[0];
  const endNumber = numbers[1];

  if (!isNaN(startNumber) && !isNaN(endNumber)) {
    globalStartNumber = startNumber; // Store globally
    globalEndNumber = endNumber; // Store globally
    init(); // Call the init function
    closeCasesModalFn();
  } else {
    // console.log("Invalid numbers!");
  }
}

// Add event listener to each button
caseButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const dataCaseValue = button.getAttribute("data-case");
    handleDataCase(dataCaseValue);
    closeCasesModalFn(); // Close the input modal or perform necessary actions
  });
});

// SIDE BAR

document
  .querySelector(".show-options-icon")
  .addEventListener("click", function () {
    document.querySelector(".expanded-sidebar").classList.add("open");
  });

document.querySelector(".close-sidebar").addEventListener("click", function () {
  document.querySelector(".expanded-sidebar").classList.remove("open");
});

// GAME CODE

let scores,
  currentScore,
  activePlayer,
  playing,
  numberField = [];
let numberFieldHistory = [];
let scoresHistory = [];
let activePlayerHistory = [];
let storageField = [];
let playerTurnHistory = [];
let comparisonBoxHistory = [];

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  // console.error("%c New Game", "color:green;");

  // Generate number field based on the source of numbers
  const startNumber = !isNaN(globalStartNumber) ? globalStartNumber : 1;
  const endNumber = !isNaN(globalEndNumber) ? globalEndNumber : 10;

  if (startNumber <= endNumber) {
    numberField = generateNumberField(startNumber, endNumber);
  } else {
    // console.log("Invalid number range!");
    // Default number field from 1 to 10
    numberField = generateNumberField(1, 10);
  }

  // console.log("S:", numberField);
  displayNumberField(numberField);

  score0El.textContent = 0;
  score1El.textContent = 0;
  comparisonBox.textContent = 0;

  // Reset players' states, remove winner class, set active class, enable/disable inputs, etc.
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");

  player1Input.disabled = false;
  // player1Input.focus();
  player2Input.disabled = true;

  // Reset history arrays or variables
  numberFieldHistory = [];
  scoresHistory = [];
  activePlayerHistory = [];
  storageField = [];
  playerTurnHistory = [];
  comparisonBoxHistory = [];

  return numberField;
};

// openRulesModal(); // ?????????????????????????????????????????????????????????????? Return it back on

btnNew.addEventListener("click", function () {
  init(); // Call the init function
});

btnUndo.addEventListener("click", function () {
  if (numberFieldHistory.length > 0) {
    const previousNumberFieldState = numberFieldHistory.pop();
    numberField = previousNumberFieldState;

    const lastRemovedNumber = storageField.pop();
    const player = playerTurnHistory.pop();

    if (lastRemovedNumber !== undefined) {
      numberField.push(lastRemovedNumber);
      updateScores(player, lastRemovedNumber);

      if (player === 0) {
        player2Input.disabled = true;
        player1Input.disabled = false;
        // player1Input.focus();
      } else {
        player1Input.disabled = true;
        player2Input.disabled = false;
        // player2Input.focus();
      }

      if (activePlayer !== player) {
        switchPlayer();
      }
    }

    if (comparisonBoxHistory.length > 0) {
      // const previousComparisonValue = comparisonBoxHistory.pop();
      // comparisonBox.textContent = previousComparisonValue;
      comparisonBox.textContent = Math.abs(scores[1] - scores[0]);
    }

    numberField.sort((a, b) => a - b);
    displayNumberField(numberField);
    // console.log("S:", numberField);
  } else {
    // console.log("Cannot undo further.");
  }
});

const displayNumberField = () => {
  const numberFieldDisplay = document.querySelector(".number-field");
  numberFieldDisplay.innerHTML = ""; // Clear previous content

  numberField.forEach((number) => {
    const numberElement = document.createElement("div");
    numberElement.textContent = number; // Display the number on the square
    numberElement.classList.add("number-square"); // Add a class to identify these squares

    numberElement.addEventListener("mouseover", function () {
      // Highlight the square when hovered
      this.style.backgroundColor = "yellow"; // Change the background color as desired
      this.style.cursor = "pointer"; // Change cursor on hover
    });

    numberElement.addEventListener("mouseout", function () {
      // Remove highlight when not hovered
      this.style.backgroundColor = ""; // Reset background color
    });

    numberElement.addEventListener("click", function (event) {
      const clickedText = this.textContent.trim(); // Trim whitespace
      const clickedNumber = parseInt(clickedText);

      if (!isNaN(clickedNumber)) {
        // Check if it's a valid number
        const index = numberField.indexOf(clickedNumber);
        if (index !== -1) {
          const clickedElement = this;
          clickedElement.style.opacity = 0; // Trigger the fade-out animation

          setTimeout(() => {
            numberField.splice(index, 1);
            updateNumberField();
            updateStorageField(clickedNumber);
            displayNumberField(); // Refresh the displayed number field

            scores[activePlayer] += clickedNumber;
            document.getElementById(`score--${activePlayer}`).textContent =
              scores[activePlayer];

            if (numberField.length === 0) {
              declareWinner();
            } else {
              const otherPlayer = activePlayer === 0 ? 1 : 0;
              const otherPlayerScore = parseInt(
                document.getElementById(`score--${otherPlayer}`).textContent
              );

              if (scores[activePlayer] >= otherPlayerScore) {
                switchPlayer();
                const currentPlayerInput =
                  activePlayer === 0 ? player1Input : player2Input;
                const otherPlayerInput =
                  activePlayer === 0 ? player2Input : player1Input;
                currentPlayerInput.disabled = true;
                otherPlayerInput.disabled = false;
                // otherPlayerInput.focus();
              }
            }
            updateComparisonBox(Math.abs(scores[1] - scores[0]));
          }, 500); // Wait for the animation duration before removing from the array
        }
      } else {
        console.log("Invalid input!");
      }
    });

    numberFieldDisplay.appendChild(numberElement); // Append the square to the number field display container
  });
};

const removeNumber = (element, number) => {
  element.style.opacity = 0; // Start removal animation by setting opacity to 0

  // Delay the actual removal from the array until the animation ends
  setTimeout(() => {
    const index = numberField.indexOf(number);
    if (index !== -1) {
      numberField.splice(index, 1); // Remove the number from the array
      displayNumberField(); // Update the displayed numbers
    }
  }, 500); // Wait for the animation duration before removing from the array
};

init();

function declareWinner() {
  const player1Score = parseInt(
    document.getElementById(`score--0`).textContent
  );
  const player2Score = parseInt(
    document.getElementById(`score--1`).textContent
  );

  if (player1Score > player2Score) {
    // Perform actions for Player 1 winning
    playing = false;
    document.querySelector(`.player--0`).classList.add("player--winner");
    document.querySelector(`.player--0`).classList.remove("player--active");
    document.querySelector(".number-field").textContent = "Player 1 Wins";
  } else if (player1Score < player2Score) {
    // Perform actions for Player 2 winning
    playing = false;
    document.querySelector(`.player--1`).classList.add("player--winner");
    document.querySelector(`.player--1`).classList.remove("player--active");
    document.querySelector(".number-field").textContent = "Player 2 Wins";
  } else {
    // Perform actions for a tie
    playing = false;
    document.querySelector(`.player--1`).classList.add("player--winner");
    document.querySelector(`.player--1`).classList.remove("player--active");
    document.querySelector(`.player--0`).classList.add("player--winner");
    document.querySelector(`.player--0`).classList.remove("player--active");
    document.querySelector(".number-field").textContent = "It is a TIE";
  }
}

const switchPlayer = function () {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

const updateNumberField = () => {
  const currentNumberField = numberField.slice(); // Create a copy of the current numberField
  numberFieldHistory.push(currentNumberField); // Save the current state to history
};

const updateStorageField = (number) => {
  storageField.push(number); // Add the removed number to the storage field
  playerTurnHistory.push(activePlayer);
};

const updateScores = (player, value) => {
  scores[player] -= value;
  document.getElementById(`score--${player}`).textContent = scores[player];
};

const updateComparisonBox = (value) => {
  comparisonBox.textContent = value;
  comparisonBoxHistory.push(value); // Store the current comparison box value
};

const handlePlayerInput = (playerValue, playerInput, otherPlayerInput) => {
  if (numberField.includes(playerValue)) {
    const index = numberField.indexOf(playerValue);
    if (index !== -1) {
      numberField.splice(index, 1);
      updateNumberField();
      updateStorageField(playerValue);
      displayNumberField(numberField);
      updateComparisonBox(Math.abs(scores[1] - scores[0]));
    }

    // console.log("S:", numberField);

    scores[activePlayer] += playerValue;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (numberField.length === 0) {
      declareWinner();
    } else {
      const otherPlayer = activePlayer === 0 ? 1 : 0;
      const otherPlayerScore = parseInt(
        document.getElementById(`score--${otherPlayer}`).textContent
      );

      if (scores[activePlayer] >= otherPlayerScore) {
        switchPlayer();
        playerInput.disabled = true;
        otherPlayerInput.disabled = false;
        // otherPlayerInput.focus();
      }
    }
  } else {
    // console.log(
    //   "Invalid input! Please choose a valid number from the remaining field."
    // );
  }

  playerInput.value = "";
  playerInput.placeholder = `Player ${activePlayer + 1}`;
  comparisonBox.textContent = Math.abs(scores[1] - scores[0]);
};

const triggerAnimationAndHandleInput = (
  enteredNumber,
  playerInput,
  otherPlayerInput
) => {
  const numberSquares = document.querySelectorAll(".number-square");

  numberSquares.forEach((numberSquare) => {
    if (
      numberSquare.textContent.trim() === enteredNumber.toString() &&
      !numberSquare.style.opacity.includes("0")
    ) {
      numberSquare.style.opacity = 0;

      setTimeout(() => {
        // Handle the input after the animation completes
        handlePlayerInput(enteredNumber, playerInput, otherPlayerInput);

        // Update the number square visibility after handling the input
        numberSquare.style.opacity = 1;
      }, 500); // Adjust as needed for animation duration
    }
  });
};

player1Submit.addEventListener("submit", function (event) {
  event.preventDefault();
  const player1Value = parseInt(player1Input.value);

  if (!isNaN(player1Value)) {
    triggerAnimationAndHandleInput(player1Value, player1Input, player2Input);
  } else {
    // console.log("Invalid input!");
  }
});

player2Submit.addEventListener("submit", function (event) {
  event.preventDefault();
  const player2Value = parseInt(player2Input.value);

  if (!isNaN(player2Value)) {
    triggerAnimationAndHandleInput(player2Value, player2Input, player1Input);
  } else {
    // console.log("Invalid input!");
  }
});

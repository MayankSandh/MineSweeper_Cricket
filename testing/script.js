// script.js

document.addEventListener("DOMContentLoaded", function() {
  const grid = document.querySelector(".game-board");
  const scoreDisplay = document.getElementById("score");
  const resetButton = document.getElementById("reset-button");
  const dropdownButton = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");

  dropdownButton.addEventListener("click", function() {
    dropdownContent.classList.toggle("show");
  });

  dropdownContent.addEventListener("click", function(event) {
    const selectedSize = parseInt(event.target.dataset.size);
    if (!isNaN(selectedSize)) {
      changeGridSize(selectedSize);
      dropdownContent.classList.remove("show");
    }
  });

  let gridSize = 6;
  const numFielders = 11;
  let score = 0;
  let isGameOver = false;
  let selectedSafeSquares = [];
  let playerCount = 0;
  const playerNames = [];
  
  // Function to generate player forms based on the player count
  function generatePlayerForms() {
    const playerCountInput = document.getElementById('player-count-input');
    playerCount = parseInt(playerCountInput.value);
    playerCountInput.disabled = true;
  
    const playerNamesForm = document.getElementById('player-names-form');
    playerNamesForm.innerHTML = '';
  
    for (let i = 1; i <= playerCount; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Player ${i} Name`;
      playerNamesForm.appendChild(input);
    }
  
    const nameForm = document.getElementById('name-form');
    nameForm.style.display = 'block';
    startGame();
  }
  
  // Function to start the game
  function startGame() {
    resetGrid();
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;
    
    // Check if both player names are entered
    if (player1 && player2) {
      playerNames.push(player1, player2);
      resetGrid();
      hideForm();
    } else {
      alert("Please enter names for both players.");
    }
  
    const playerForm = document.getElementById('player-form');
    playerForm.style.display = 'none';
  
    const nameForm = document.getElementById('name-form');
    nameForm.style.display = 'none';
  
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.display = 'block';
  
    // Here, you can add the code to generate the grid and start the game
    createGrid();
  }

  function createGrid() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  
    const totalSquares = gridSize * gridSize;
    const scoreSquaresCount = totalSquares - numFielders;
  
    const runsDistribution = getRunsDistribution(scoreSquaresCount);
    const scoreSquares = [];
  
    for (const run in runsDistribution) {
      const count = runsDistribution[run];
      for (let i = 0; i < count; i++) {
        scoreSquares.push(run);
      }
    }
  
    const fielderSquares = Array.from({ length: numFielders }, () => true);
    const safeSquares = Array.from({ length: scoreSquaresCount }, () => false);
  
    const allSquares = fielderSquares.concat(safeSquares);
  
    shuffleArray(allSquares);
  
    let fielderIndex = 0;
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const block = document.createElement("div");
        block.classList.add("game-block");
        block.dataset.row = i;
        block.dataset.col = j;
  
        if (allSquares.pop()) {
          block.dataset.hasFielder = true;
          block.addEventListener("click", handleClick);
        } else {
          const randomIndex = Math.floor(Math.random() * scoreSquares.length);
          const run = scoreSquares.splice(randomIndex, 1)[0];
          block.dataset.run = run;
  
          const scoreText = document.createElement("span");
          scoreText.classList.add("score-text");
          scoreText.textContent = run;
          block.appendChild(scoreText);
        }
  
        grid.appendChild(block);
      }
    }
  
    // Add event listener for all blocks after creating them
    const blocks = document.querySelectorAll(".game-block");
    blocks.forEach(block => {
      block.addEventListener("click", handleClick);
    });
  
    // Add event listener for fielder blocks separately
    const fielderBlocks = document.querySelectorAll(".game-block[data-has-fielder='true']");
    fielderBlocks.forEach(block => {
      block.addEventListener("click", gameOver);
    });
  }
  
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  

  function getRunsDistribution(totalSafeSquares) {
    if (gridSize === 7) {
      return {
        6: 4,
        4: 6,
        2: 10,
        1: 18
      };
    } else if (gridSize === 6) {
      return {
        6: 2,
        4: 3,
        2: 8,
        1: 12
      };
    } else if (gridSize === 5) {
      return {
        6: 1,
        4: 2,
        2: 5,
        1: 6
      };
    }
  }

  function getRunForSquare(runsDistribution) {
    const runOptions = [];
    for (const run in runsDistribution) {
      const count = runsDistribution[run];
      for (let i = 0; i < count; i++) {
        runOptions.push(run);
      }
    }
    const randomIndex = Math.floor(Math.random() * runOptions.length);
    return runOptions.splice(randomIndex, 1)[0];
  }

  function resetGrid() {
    // Clear existing grid
    while (grid.firstChild) {
      grid.firstChild.remove();
    }

    // Generate new grid with updated size
    createGrid();

    // Reset other variables and UI
    score = 0;
    isGameOver = false;
    selectedSafeSquares = [];
    scoreDisplay.textContent = score;
  }

  function changeGridSize(n) {
    gridSize = n;
    resetGrid();
  }
  
  function gameOver() {
    isGameOver = true;
    showPopupMessage();
    revealNonSelectedSafeSquares();
    revealFielders();
  }
  
  function showPopupMessage() {
    let popupMessage = "";
    if (score === 0) {
      const messages = [
        "Ouch! Tough luck.",
        "That was a duck out!",
        "You seem to love scoring 0 ;)"
      ];
      const randomIndex = Math.floor(Math.random() * messages.length);
      popupMessage = messages[randomIndex];
    } else {
      const currentPlayer = playerNames[0];
      popupMessage = `${currentPlayer} lost. Score: ${score}`;
      playerNames.push(currentPlayer);
    }
  
    alert(popupMessage);
  }
  
  function handleClick() {
    if (isGameOver) {
      return;
    }

    const hasFielder = this.dataset.hasFielder === "true";
    const isAlreadySelected = this.classList.contains("scored");

    if (hasFielder) {
      this.classList.add("fielder");
      revealFielderBlocks(this);
    } else if (!isAlreadySelected) {
      const run = parseInt(this.dataset.run);
      score += run;
      this.classList.add("scored");
      this.removeEventListener("click", handleClick);
      scoreDisplay.textContent = score;
      selectedSafeSquares.push(this);
    }
  }

  function placeFielder() {
    const blocks = Array.from(document.querySelectorAll(".game-block"));
    const availableBlocks = blocks.filter(block => block.dataset.hasFielder !== "true" && !block.classList.contains("scored"));
    const randomIndex = Math.floor(Math.random() * availableBlocks.length);
    const fielderBlock = availableBlocks[randomIndex];
    fielderBlock.dataset.hasFielder = true;
  }

  function revealFielderBlocks(clickedBlock) {
    const fielderBlocks = [];
    const nonSelectedSafeBlocks = [];
  
    const blocks = Array.from(document.querySelectorAll(".game-block"));
    blocks.forEach(block => {
      const hasFielder = block.dataset.hasFielder === "true";
      if (hasFielder && block !== clickedBlock) {
        fielderBlocks.push(block);
      } else if (!hasFielder) {
        nonSelectedSafeBlocks.push(block);
      }
    });
  
    fielderBlocks.forEach(block => block.classList.add("fielder-others"));
    nonSelectedSafeBlocks.forEach(block => block.classList.add("non-selected-safe"));
  }

  function revealNonSelectedSafeSquares() {
    const blocks = Array.from(document.querySelectorAll(".game-block"));
    blocks.forEach(block => {
      const hasFielder = block.dataset.hasFielder === "true";
      if (!hasFielder && !block.classList.contains("scored") && !selectedSafeSquares.includes(block)) {
        block.classList.add("non-selected-safe-light");
      } else if (!hasFielder && !block.classList.contains("scored") && selectedSafeSquares.includes(block)) {
        block.classList.add("selected-safe");
      }
    });
  }

  resetButton.addEventListener("click", resetGrid);
  const gridSizeSelect = document.getElementById("grid-size-select");

  gridSizeSelect.addEventListener("change", function() {
    const selectedSize = parseInt(this.value);
    if (!isNaN(selectedSize)) {
      changeGridSize(selectedSize);
    }
  });

  createGrid();
});
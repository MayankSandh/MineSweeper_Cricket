let players = [];
let currentPlayer = 0;
let score = [];

function startGame() {
  const numPlayers = parseInt(document.getElementById('numPlayers').value);

  if (numPlayers >= 2 && numPlayers <= 4) {
    players = [];
    score = [];

    for (let i = 0; i < numPlayers; i++) {
      const playerName = prompt(`Enter the name of Player ${i + 1}:`);
      players.push(playerName);
      score.push(0);
    }

    document.getElementById('playersForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    createBoard();
    displayCurrentPlayer();
  } else {
    alert('Please enter a number between 2 and 4 for the number of players.');
  }
}

// Function to display the current player's score
function displayCurrentPlayer() {
  const currentPlayerName = players[currentPlayer];
  document.getElementById('score').textContent = `${currentPlayerName} Score: ${score[currentPlayer]}`;
}

// Function to handle game over
function gameOver() {
  const currentPlayerName = players[currentPlayer];
  alert(`Game Over! ${currentPlayerName} Score is: ${score[currentPlayer]}`);

  currentPlayer++;
  if (currentPlayer >= players.length) {
    showScorecard();
  } else {
    createBoard();
    displayCurrentPlayer();
  }
}

// Function to display the scorecard
function showScorecard() {
  // Hide the game board
  document.getElementById('game').style.display = 'none';

  // Create the scorecard HTML
  const scorecard = document.createElement('div');
  scorecard.classList.add('scorecard');

  const heading = document.createElement('h2');
  heading.textContent = 'Scorecard';
  scorecard.appendChild(heading);

  for (let i = 0; i < players.length; i++) {
    const playerScore = score[i];

    const playerScoreText = document.createElement('p');
    playerScoreText.textContent = `${players[i]} Score: ${playerScore}`;
    scorecard.appendChild(playerScoreText);
  }

  // Find the winner
  const maxScore = Math.max(...score);
  const winners = [];
  for (let i = 0; i < players.length; i++) {
    if (score[i] === maxScore) {
      winners.push(players[i]);
    }
  }

  const winnerText = document.createElement('p');
  if (winners.length === 1) {
    winnerText.textContent = `Winner: ${winners[0]}`;
  } else {
    winnerText.textContent = `Winners: ${winners.join(', ')}`;
  }
  scorecard.appendChild(winnerText);

  // Create the home button
  const homeButton = document.createElement('button');
  homeButton.textContent = 'Home';
  homeButton.addEventListener('click', () => {
    window.location.href = 'homepage.html';
  });
  scorecard.appendChild(homeButton);

  // Append the scorecard to the body
  document.body.appendChild(scorecard);
}

// Code to create the game board and handle game logic (from the single-player version)
// ...

// Rest of the code from script.js (the game engine code) goes here

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
        popupMessage = "Game over. Your score is " + score;
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
    
      return; // Add this line to end the function execution
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
  
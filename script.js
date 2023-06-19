// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", function() {

  // Get necessary DOM elements
  const grid = document.querySelector(".game-board");
  const scoreDisplay = document.getElementById("score");
  const resetButton = document.getElementById("reset-button");
  const dropdownButton = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");

  // Event listener for dropdown button click
  dropdownButton.addEventListener("click", function() {
    dropdownContent.classList.toggle("show");
  });

  // Event listener for dropdown options
  dropdownContent.addEventListener("click", function(event) {
    const selectedSize = parseInt(event.target.dataset.size);
    if (!isNaN(selectedSize)) {
      changeGridSize(selectedSize);
      dropdownContent.classList.remove("show");
    }
  });

  // Initial variables
  let gridSize = 6;
  const numFielders = 11;
  let score = 0;
  let isGameOver = false;
  let isPoweredUp = false;
  let isScoredDouble = false; 
  let DoubleScoreLeft = 0;
  let wickets = 0;
  let selectedSafeSquares = [];

  // Function to create the game grid
  function createGrid() {
    // Clear existing grid
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

    // Calculate the number of safe and fielder squares
    const totalSquares = gridSize * gridSize;
    const scoreSquaresCount = totalSquares - numFielders;

    // Get the distribution of runs for the safe squares
    const runsDistribution = getRunsDistribution(scoreSquaresCount);
    const scoreSquares = [];

    // Create an array with the runs for each score square
    for (const run in runsDistribution) {
      const count = runsDistribution[run];
      for (let i = 0; i < count; i++) {
        scoreSquares.push(run);
      }
    }

    // Create arrays for fielder and safe squares
    const fielderSquares = Array.from({ length: numFielders }, () => true);
    const safeSquares = Array.from({ length: scoreSquaresCount }, () => false);

    // Combine fielder and safe squares
    const allSquares = fielderSquares.concat(safeSquares);

    // Shuffle the array to randomize the square positions
    shuffleArray(allSquares);

    // Create the grid blocks
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const block = document.createElement("div");
        block.classList.add("game-block"); // Adds the CSS Class "game-block" to the block element
        block.dataset.row = i;3
        block.dataset.col = j;

        if (allSquares.pop()) {
          block.dataset.hasFielder = true;
          block.addEventListener("click", handleClick);
        } 
        else {
          const randomIndex = Math.floor(Math.random() * scoreSquares.length);
          const run = scoreSquares.splice(randomIndex, 1)[0];
          block.dataset.run = run;
          if (parseInt(run) === 0){
            block.dataset.hasPowerup = true;
            const scoreText = document.createElement("span");
            scoreText.classList.add("score-text");
            scoreText.textContent = "+1";
            block.appendChild(scoreText);
          }
          else if (parseInt(run) === 7){
            block.dataset.hasDoubleup = true;
            const scoreText = document.createElement("span");
            scoreText.classList.add("score-text");
            scoreText.textContent = "X2";
            block.appendChild(scoreText);
          }
          else{
            const scoreText = document.createElement("span");
            scoreText.classList.add("score-text");
            scoreText.textContent = run;
            block.appendChild(scoreText);
          }
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

    const powerUpBlocks = document.querySelectorAll(".game-block[data-has-power_up='true']");
    powerUpBlocks.forEach(block => {
      block.addEventListener("click", powerUpFunc);
    });

    const doubleUpBlocks = document.querySelectorAll(".game-block[data-has-double_up='true']");
    doubleUpBlocks.forEach(block => {
      block.addEventListener("click", DoubleUpFunc);
    });
  }
  function DoubleUpFunc() {
    isScoredDouble = true;
    let popupMessage = "";
    popupMessage = "You have found a double-up! For the next 5 balls, every run you score becomes doubled!";
    alert(popupMessage);    
  }
  function powerUpFunc() {
    isPoweredUp = true;
    wickets+=1;
    let popupMessage = "";
    popupMessage = "You have found a powerup! You have got one extra wicket!";
    alert(popupMessage);
  }

  // Function to shuffle an array randomly
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Function to get the runs distribution based on the grid size
  function getRunsDistribution(totalSafeSquares) {
    if (gridSize === 7) {
      return {
        6: 4,
        4: 6,
        2: 8,
        1: 15,
        0: 3,
        7: 2
      };
    } else if (gridSize === 6) {
      return {
        6: 2,
        4: 3,
        2: 7,
        1: 10,
        0: 2,
        7: 1
      };
    } else if (gridSize === 5) {
      return {
        6: 1,
        4: 2,
        2: 3,
        1: 6,
        0: 1,
        7: 1
      };
    }
   else if (gridSize === 4) {
    return {
      0: 2,
      7: 3
    };
  }
  }

  // Function to handle click on a grid block
  function handleClick() {
    if (isGameOver) {
      return;
    }

    const hasFielder = this.dataset.hasFielder === "true";
    const hasPowerup = this.dataset.hasPowerup === "true";
    const hasDoubleup = this.dataset.hasDoubleup === "true";
    const isAlreadySelected = this.classList.contains("scored");

    if (hasFielder) {
      this.classList.add("fielder");
      
    } 
    else if (hasPowerup) {
      this.classList.add("scored");
      this.classList.add("power_up"); //powerup
      powerUpFunc();
    }

    else if (hasDoubleup) {
      this.classList.add("scored");
      this.classList.add("double_up"); //powerup
      DoubleScoreLeft+=5;
      DoubleUpFunc();
    }
    
    else if (!isAlreadySelected) {
      const run = parseInt(this.dataset.run);
      if (isScoredDouble){
        DoubleScoreLeft -=1;
        score += 2*run;
        if (DoubleScoreLeft === 0){
          alert("Double Up Power Exhausted!")
          isScoredDouble = false;
        }
      }
      else{
        score += run;
      }
      this.classList.add("scored");
      this.removeEventListener("click", handleClick);
      scoreDisplay.textContent = score;
      selectedSafeSquares.push(this);
    }
  }

  // Function to reveal fielder blocks and other non-selected safe squares
  function revealFielderBlocks(clickedBlock) {
    const fielderBlocks = [];
    const nonSelectedSafeBlocks = [];

    const blocks = Array.from(document.querySelectorAll(".game-block"));
    blocks.forEach(block => {
      const hasFielder = block.dataset.hasFielder === "true";
      if (hasFielder && block !== clickedBlock) {
        fielderBlocks.push(block);
      } else if (!hasFielder ) {
        nonSelectedSafeBlocks.push(block);
      }
     else if (!hasFielder) {
      nonSelectedSafeBlocks.push(block);
    }
    });

    // Add class to style fielder and non-selected safe blocks
    fielderBlocks.forEach(block => block.classList.add("fielder-others"));
  }

  // Function to reveal non-selected safe squares
  function revealNonSelectedSafeSquares() {
    const blocks = Array.from(document.querySelectorAll(".game-block"));
    blocks.forEach(block => {
      const hasFielder = block.dataset.hasFielder === "true";
      const hasPowerup = block.dataset.hasPowerup === "true";
      const hasDoubleup = block.dataset.hasDoubleup === "true";
      if (!hasFielder && !block.classList.contains("scored") && !selectedSafeSquares.includes(block) && !hasPowerup && !hasDoubleup) {
        block.classList.add("non-selected-safe-light");
      } else if (!hasFielder && !block.classList.contains("power_up") && hasPowerup && !hasDoubleup) {
        block.classList.add("non-selected-power-up");      
      } else if (!hasFielder && !block.classList.contains("double_up") && !hasPowerup && hasDoubleup) {
        block.classList.add("non-selected-double-up");   
      } else if (!hasFielder && !block.classList.contains("scored") && selectedSafeSquares.includes(block)) {
        block.classList.add("selected-safe");
      }
    });
  }

  // Function to end the game and show popup message
  function gameOver() {
    if (isPoweredUp && wickets === 0){
      alert("Extra Wickets Exhausted!");
      isPoweredUp = false;
      return;
    }
    if (isPoweredUp){
      alert("One Wicket Down. "+wickets+"wicket(s) remaning.");
      wickets-=1;
      return;
    }
    isGameOver = true;
    showPopupMessage();
    revealNonSelectedSafeSquares();
    revealFielderBlocks();
  }

  // Function to show the popup message at the end of the game
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

  // Function to reset the grid and start a new game
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
    isPoweredUp = false;
    isScoredDouble = false;
    DoubleScoreLeft = 5;
    selectedSafeSquares = [];
    scoreDisplay.textContent = score;
  }

  // Function to change the grid size and start a new game
  function changeGridSize(n) {
    gridSize = n;
    resetGrid();
  }

  // Event listener for the reset button
  resetButton.addEventListener("click", resetGrid);


  // Initialize the game by creating the initial grid
  createGrid();
});

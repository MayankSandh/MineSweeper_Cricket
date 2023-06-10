document.addEventListener("DOMContentLoaded", function() {
    const grid = document.querySelector(".game-board");
    const scoreDisplay = document.getElementById("score");
    const resetButton = document.getElementById("reset-button");
    const gridSize = 6;
    const numFielders = 11;
    let score = 0;
    let isGameOver = false;
    let selectedSafeSquares = [];
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const block = document.createElement("div");
        block.classList.add("game-block");
        block.dataset.row = i;
        block.dataset.col = j;
        block.addEventListener("click", handleClick);
        grid.appendChild(block);
      }
    }
  
    const blocks = Array.from(document.querySelectorAll(".game-block"));
    const fielderIndexes = generateRandomIndexes(numFielders, blocks.length);
    for (let index of fielderIndexes) {
      blocks[index].dataset.hasFielder = "true";
    }
  
    function handleClick() {
      if (isGameOver) {
        return;
      }
  
      const hasFielder = this.dataset.hasFielder === "true";
      if (hasFielder) {
        this.classList.add("fielder");
        revealFielderBlocks(this);
        gameOver();
      } else {
        score++;
        this.classList.add("scored");
        this.removeEventListener("click", handleClick);
        scoreDisplay.textContent = score;
        selectedSafeSquares.push(this);
      }
    }
  
    function gameOver() {
      isGameOver = true;
      setTimeout(() => {
        revealNonSelectedSafeSquares();
        showPopupMessage();
      }, 1000);
    }
  
    function revealFielderBlocks(clickedBlock) {
      const fielderBlocks = [];
      const nonSelectedSafeBlocks = [];
  
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
      blocks.forEach(block => {
        const hasFielder = block.dataset.hasFielder === "true";
        if (!hasFielder && !block.classList.contains("scored") && !selectedSafeSquares.includes(block)) {
          block.classList.add("non-selected-safe-light");
        } else if (!hasFielder && !block.classList.contains("scored") && selectedSafeSquares.includes(block)) {
          block.classList.add("selected-safe");
        }
      });
    }
  
    function generateRandomIndexes(count, max) {
      const indexes = [];
      while (indexes.length < count) {
        const randomIndex = Math.floor(Math.random() * max);
        if (!indexes.includes(randomIndex)) {
          indexes.push(randomIndex);
        }
      }
      return indexes;
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
  
    resetButton.addEventListener("click", resetGame);
  
    function resetGame() {
      score = 0;
      isGameOver = false;
      selectedSafeSquares = [];
  
      blocks.forEach(block => {
        block.classList.remove("fielder", "fielder-others", "scored", "non-selected-safe-light", "selected-safe");
        block.addEventListener("click", handleClick);
      });
  
      scoreDisplay.textContent = score;
    }
  });
  
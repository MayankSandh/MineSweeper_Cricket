// Get the player names from the input fields
const playerNames = [];
for (let i = 1; i <= numPlayers; i++) {
  playerNames.push(prompt(`Enter the name of Player${i}:`));
}

let currentPlayer = 0;
let score = 0;

// Function to initialize the game
function initializeGame() {
  // Update the player name and score labels
  updatePlayerInfo();

  // Create the grid
  createGrid();
}

// Function to update the player name and score labels
function updatePlayerInfo() {
  const playerNameLabel = document.getElementById('player-name');
  playerNameLabel.textContent = playerNames[currentPlayer];

  const scoreLabel = document.getElementById('score');
  scoreLabel.textContent = `Score: ${score}`;
}

// Function to create the grid
function createGrid() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
}

// Function to handle cell click
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (grid[row][col].isMine) {
    // Game over, show popup and reset game
    showPopup(`Game Over! ${playerNames[currentPlayer]} Score is ${score}`);
    resetGame();
  } else {
    // Increment score and update player info
    score++;
    updatePlayerInfo();
  }
}

// Function to show popup
function showPopup(message) {
  alert(message);
}

// Function to reset the game
function resetGame() {
  score = 0;
  currentPlayer = (currentPlayer + 1) % numPlayers;
  updatePlayerInfo();
  createGrid();
}

// Initialize the game
initializeGame();

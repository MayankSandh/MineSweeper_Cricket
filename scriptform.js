document.addEventListener("DOMContentLoaded", function() {
  // Wait for the DOM content to be loaded
  const playerForm = document.getElementById("player-form");

  playerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the number of players entered by the user
    const playerCount = parseInt(document.getElementById("player-count").value);

    if (isNaN(playerCount) || playerCount < 1) {
      alert("Please enter a valid number of players.");
      return;
    }

    const playerNames = [];

    // Prompt the user to enter each player's name
    for (let i = 1; i <= playerCount; i++) {
      const playerName = prompt("Enter the name for Player " + i);
      if (playerName) {
        playerNames.push(playerName);
      } else {
        alert("Player name cannot be empty. Please try again.");
        return;
      }
    }

    // Store playerNames in localStorage
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
    localStorage.setItem("playerCount", JSON.stringify(playerCount));

    window.location.href = "game.html";
  });
});

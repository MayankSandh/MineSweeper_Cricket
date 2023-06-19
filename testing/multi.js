// multi.js

// Function to handle the form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    var numPlayers = parseInt(document.getElementById('num-players').value, 10);
  
    // Create a pop-up to enter player names
    var playerNames = [];
    for (var i = 1; i <= numPlayers; i++) {
      var playerName = prompt('Enter the name for Player ' + i);
      playerNames.push(playerName);
    }
  
    // Display the player names in an alert
    alert('Player Names: ' + playerNames.join(', '));
  
    // You can perform further actions with the player names as needed
  
    // Reset the form
    document.getElementById('player-form').reset();
  }
  
  // Attach the form submission handler
  document.getElementById('player-form').addEventListener('submit', handleFormSubmit);
  
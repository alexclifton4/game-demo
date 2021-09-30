let app;

let Game = {}
Game.otherPlayers = {}

let timeSinceNetwork = 0

window.addEventListener("load", () => {
  // Setup PIXI
  app = new PIXI.Application();
  document.getElementById("gameContainer").appendChild(app.view);
  app.ticker.add(Game.update)
  
  // Create objects
  Game.joystick = new Joystick(128, 512)
})

// Creates the player
Game.initPlayer = function(id, colour, x, y) {
  Game.player = new Actor(x, y, 2, parseInt(colour, 16))
  Game.player.id = id
}

// Main game loop
Game.update = function(delta) {
  if (Network.connected) {
    // Update other players
    addNewPlayers()
    for (let id in Game.otherPlayers) {
     Game.otherPlayers[id].updateInterpolate()
    }
    
    // Update this player
    Game.player.move(Game.joystick.magnitude, Game.joystick.direction, delta)
    
    // See if the network should be updated
    timeSinceNetwork += app.ticker.deltaMS
    if (timeSinceNetwork >= Network.frequency && Network.connected) {
      timeSinceNetwork = 0
      Network.update()
    }
  }
}

// Adds new players if they have joined since the last update
let addNewPlayers = function() {
  while (Network.playersToAdd.length) {
    let player = Network.playersToAdd.pop()
    let x = parseInt(player.x)
    let y = parseInt(player.y)
    let colour = parseInt(player.colour, 16)
    Game.otherPlayers[player.id] = new Actor(x, y, 0, colour)
  }
}
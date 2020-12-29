let app;

let Game = {}
Game.otherPlayers = {}

const networkFrequency = 100
let timeSinceNetwork = 0

window.addEventListener("load", () => {
  // Setup PIXI
  app = new PIXI.Application();
  document.body.appendChild(app.view);
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
    addNewPlayers()
    
    Game.player.move(Game.joystick.magnitude, Game.joystick.direction, delta)
    
    timeSinceNetwork += app.ticker.deltaMS
    // See if the network should be updated
    if (timeSinceNetwork >= networkFrequency && Network.connected) {
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
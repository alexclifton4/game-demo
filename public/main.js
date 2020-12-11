let app;

let Game = {}
Game.otherPlayers = {}

const networkFrequency = 100
let timeSinceNetwork = 0

window.addEventListener("load", () => {
  // Setup PIXI
  app = new PIXI.Application();
  document.body.appendChild(app.view);
  app.ticker.add(update)
  
  // Create objects
  Game.joystick = new Joystick(128, 512)
  Game.player = new Actor(128, 128, 2)
})

// Main game loop
function update(delta) {
  addNewPlayers()
  
  Game.player.move(Game.joystick.xVal, Game.joystick.yVal, delta)
  
  timeSinceNetwork += app.ticker.deltaMS
  // See if the network should be updated
  if (timeSinceNetwork >= networkFrequency && Network.connected) {
    timeSinceNetwork = 0
    Network.update()
  }
}

// Adds new players if they have joined since the last update
let addNewPlayers = function() {
  while (Network.playersToAdd.length) {
    id = Network.playersToAdd.pop()
    Game.otherPlayers[id] = new Actor(0, 0, 0)
  }
}
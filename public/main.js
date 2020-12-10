let app;
let joystick;
let player;

const networkFrequency = 1000
let timeSinceNetwork = 0

window.addEventListener("load", () => {
  // Setup PIXI
  app = new PIXI.Application();
  document.body.appendChild(app.view);
  app.ticker.add(update)
  
  // Create objects
  joystick = new Joystick(128, 512)
  player = new Actor(128, 128, 2)
})

// Main game loop
function update(delta) {
  player.move(joystick.xVal, joystick.yVal, delta)
  
  timeSinceNetwork += app.ticker.deltaMS
  // See if the network should be updated
  if (timeSinceNetwork >= networkFrequency) {
    timeSinceNetwork = 0
    Network.update()
  }
}
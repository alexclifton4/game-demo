// Actor constructor
function Actor(x, y, speed) {
  // Create the graphic
  let actor = new PIXI.Graphics()
  actor.beginFill(0xFF0000)
  actor.drawRect(0, 0, 25, 25)
  actor.endFill()
  
  // Setup vars
  actor.x = x
  actor.y = y
  actor.speed = speed || 1
  
  // Add member functions
  actor.move = move
  
  // Add to the stage and return
  app.stage.addChild(actor)
  return actor
}

// For moving an actor
const move = function(dx, dy, delta) {
  this.x += dx * this.speed * delta
  this.y += dy * this.speed * delta
  
  // Restrict movement to the window
  if (this.x < 0) this.x = 0
  if (this.y < 0) this.y = 0
  if (this.x + this.width > app.screen.width) this.x = app.screen.width - this.width
  if (this.y + this.height > app.screen.height) this.y = app.screen.height - this.height
}
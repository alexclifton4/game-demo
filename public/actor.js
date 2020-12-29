// Actor constructor
function Actor(x, y, speed, colour) {
  // Create the graphic
  let actor = new PIXI.Graphics()
  actor.beginFill(colour)
  actor.drawRect(0, 0, 25, 25)
  actor.endFill()
  
  // Setup vars
  actor.x = x
  actor.y = y
  actor.speed = speed || 1
  
  // Add member functions
  actor.move = move
  actor.remove = remove
  
  // Add to the stage and return
  app.stage.addChild(actor)
  return actor
}

// For moving an actor
const move = function(magnitude, angle, delta) {
  this.x += delta * this.speed * magnitude * Math.cos(angle)
  this.y += delta * this.speed * magnitude * Math.sin(angle)
  
  // Restrict movement to the window
  if (this.x < 0) this.x = 0
  if (this.y < 0) this.y = 0
  if (this.x + this.width > app.screen.width) this.x = app.screen.width - this.width
  if (this.y + this.height > app.screen.height) this.y = app.screen.height - this.height
}

// Removes an actor from the scene
// Doesn't remove references to the Actor
const remove = function() {
  this.parent.removeChild(this)
}
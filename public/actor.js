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
  
  // For entity interpolation
  actor.interpolationPoints = []
  
  // Add member functions
  actor.move = move
  actor.remove = remove
  actor.updateInterpolate = updateInterpolate
  
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

// For updating an actor controlled by the server or another player
const updateInterpolate = function() {
  // The interpolation time is delayed by 2 network frames
  interpTime = performance.now() - (Network.frequency * 2)
  let now = performance.now()
  
  // Remove all but one of the points that are before the interpTime except one
  // Also make sure there are at least 2 points
  while ((this.interpolationPoints.length > 2) && (this.interpolationPoints[1].time < interpTime)) {
    this.interpolationPoints.shift()
  }
  
  // If there are at least 2 points, interpolate between them
  if (this.interpolationPoints.length >= 2) {
    let p1 = this.interpolationPoints[0]
    let p2 = this.interpolationPoints[1]
    
    let t = (interpTime - p1.time) / (p2.time - p1.time)
    if (t > 1) {
      t = 1
    }
    
    this.x = (p1.x * (1.0 - t)) + (p2.x * t)
    this.y = (p1.y * (1.0 - t)) + (p2.y * t)
  }
}

// Removes an actor from the scene
// Doesn't remove references to the Actor
const remove = function() {
  this.parent.removeChild(this)
}

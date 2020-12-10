// Joystick constructor
function Joystick(x, y) {
  // Create a container and add to stage
  joystick = new PIXI.Container()
  joystick.x = x
  joystick.y = y
  app.stage.addChild(joystick)
  
  // Create outer circle
  let outer = new PIXI.Graphics()
  outer.beginFill(0x9966FF)
  outer.drawCircle(0, 0, 100)
  outer.endFill()
  outer.x = 0
  outer.y = 0
  joystick.addChild(outer)
  
  // Create inner circle
  let inner = new PIXI.Graphics()
  inner.beginFill(0xFFFFFF)
  inner.drawCircle(0, 0, 50)
  inner.endFill()
  inner.x = 0
  inner.y = 0
  joystick.addChild(inner)
  
  // Register touch moves for inner circle
  inner.interactive = true
  inner.on('pointerdown', onDragStart)
  inner.on('pointerup', onDragEnd)
  inner.on('pointerupoutside', onDragEnd)
  inner.on('pointermove', onDragMove);
  
  // Set initial values
  joystick.xVal = 0
  joystick.yVal = 0
  joystick.angle = 0
  
  return joystick
}

// Drag events for inner circle
function onDragStart(event) {
  this.event = event.data
  this.dragging = true
}

function onDragEnd() {
  this.event = null
  this.dragging = false
  // Return to centre
  this.x = 0
  this.y = 0
  this.parent.xVal = 0
  this.parent.yVal = 0
}

function onDragMove() {
  if (this.dragging) {
    let newPosition = this.event.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
    
    // calculate distance and angle from resting pos
    let magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y))
    this.parent.angle = 0
    this.parent.angle = Math.atan2(this.y, this.x)
    
    // Restrict to inside outer circle
    if (magnitude > 128) {
      // recalculate x and y
      this.x = 128 * Math.cos(this.parent.angle)
      this.y = 128 * Math.sin(this.parent.angle)
    }
    
    // Workout values
    this.parent.xVal = this.x / 100
    this.parent.yVal = this.y / 100
  }
}
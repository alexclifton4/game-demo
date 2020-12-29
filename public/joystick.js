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
  joystick.magnitude = 0
  joystick.direction = 0
  
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
  this.parent.magnitude = 0
  this.parent.direction = 0
}

function onDragMove() {
  if (this.dragging) {
    let pos = this.event.getLocalPosition(this.parent)
    
    // Calculate magnitude and angle (in degrees)
    let magnitude = Math.sqrt((pos.x * pos.x) + (pos.y * pos.y))
    let angle = Math.atan2(pos.y, pos.x)
    
    // Restrict magnitude to 128
    if (magnitude > 128) {
      magnitude = 128
      // Move the circle to the restricted position
      this.x = 128 * Math.cos(angle)
      this.y = 128 * Math.sin(angle)
    } else {
      // Move the circle to the new position
      this.x = pos.x
      this.y = pos.y
    }
    
    // Work out the magnitude to set from the magnitude of the joystick
    if (magnitude > 50) {
      this.parent.magnitude = 1
    } else if (magnitude > 10) {
      this.parent.magnitude = 0.5
    } else {
      this.parent.magnitude = 0
    }
    
    // Round angle to nearest 45 degrees (pi/4 rad)
    let rads = Math.PI / 4
    this.parent.direction = Math.round(angle / rads) * rads
  }
}
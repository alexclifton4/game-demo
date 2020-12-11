let Network = {}
Network.connected = false
Network.playersToAdd = []
let socket;

// Open the socket
socket = new WebSocket("ws://" + location.host)

// Socket error events
socket.addEventListener('error', event => {
  console.log("Socket Error", event)
})

// Once the websocket has opened, send join message
socket.addEventListener('open', event => {
  socket.send("1") // Request to join
})

// Incoming messages from websocket
socket.addEventListener('message', event => {
    // first character is message type, rest is message
    let type = parseInt(event.data.charAt(0))
    let message = event.data.substring(1)
    
    // message router
    switch (type) {
      case 2: // Request to join returned
        joined(message)
        break
      case 3: // Other player joined
        newPlayer(message)
        break
      case 5: // Updated player positions
        updatePlayers(message)
        break
    }
})

// Request to join returned
let joined = function(id) {
  console.log("Joined with ID " + id)
    Network.connected = true
  Game.player.id = id
}

// Another player joined
let newPlayer = function(id) {
  // Ignore if its this player
  if (id != Game.player.id) {
    console.log("Another player joined with ID " + id)
    Network.playersToAdd.push(id)
  }
}

// Receive all player positions from the server
let updatePlayers = function(players) {
  // Players are separated by commas
  players.split(",").forEach((player) => {
      // player is x followed by y then player id
      // x and y are 3 characters each
      let x = player.substring(0, 3)
      let y = player.substring(3, 6)
      let id = player.substring(6)
      
      // Ignore the local player
      if (id != Game.player.id) {
        // update the other players location
        Game.otherPlayers[id].x = x
        Game.otherPlayers[id].y = y
      }
  })
}

// Send update to server
Network.update = function() {
  let x = Game.player.x.toFixed(0).padStart(3, '0')
  let y = Game.player.y.toFixed(0).padStart(3, '0')
  socket.send(`4${x}${y}${Game.player.id}`)
}
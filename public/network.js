let Network = {}
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
  player.id = id
}

// Another player joined
let newPlayer = function(id) {
  // Ignore if its this player
  if (id != player.id) {
    console.log("Another player joined with ID " + id)
  }
}

// Receive all player positions from the server
let updatePlayers = function(players) {
  console.log(players)
}

// Send update to server
Network.update = function() {
  let x = player.x.toFixed(0).padStart(3, '0')
  let y = player.y.toFixed(0).padStart(3, '0')
  socket.send(`4${x}${y}${player.id}`)
}
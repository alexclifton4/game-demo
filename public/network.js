let Network = {}
Network.connected = false
Network.playersToAdd = []
Network.frequency = 100
let socket;

// Open the socket
if (location.protocol == "http:") {
  socket = new WebSocket("ws://" + location.host)
} else {
  socket = new WebSocket("wss://" + location.host)
}

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
      case 7: // Other player leaving
        playerLeaving(message)
    }
})

// Request to join returned
let joined = function(message) {
  // the message is this player then all other players
  // separated by commas
  let players = message.split(",")
  // first is this player
  // split message into parts
  let colour = players[0].substring(0, 6)
  let x = parseInt(players[0].substring(6, 9))
  let y = parseInt(players[0].substring(9, 12))
  let id = players[0].substring(12)
  console.log("Joined with ID " + id)
  
  Network.connected = true
  Game.initPlayer(id, colour, x, y)
  
  // loop through the other players
  let otherPlayers = ""
  for (let i = 1; i < players.length; i++) {
    // split into parts
    let newPlayer = {}
    newPlayer.colour = players[i].substring(0, 6)
    newPlayer.x = parseInt(players[i].substring(6, 9))
    newPlayer.y = parseInt(players[i].substring(9, 12))
    newPlayer.id = players[i].substring(12)
    otherPlayers += newPlayer.id + ", "
    
    Network.playersToAdd.push(newPlayer)
  }
  if (players.length > 1) {
    console.log("Other players already in game: " + otherPlayers)
  }
}

// Another player joined
let newPlayer = function(message) {
  // split into parts
  let newPlayer = {}
  newPlayer.colour = message.substring(0, 6)
  newPlayer.x = parseInt(message.substring(6, 9))
  newPlayer.y = parseInt(message.substring(9, 12))
  newPlayer.id = message.substring(12)

  // Ignore if its this player
  if (newPlayer.id != Game.player.id) {
    console.log("Another player joined with ID " + newPlayer.id)
    Network.playersToAdd.push(newPlayer)
  }
}

// A player left
let playerLeaving = function(id) {
  console.log("Player left: " + id)
  Game.otherPlayers[id].remove()
  delete Game.otherPlayers[id]
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
        // Add the position to the players interpolation points
        if (Game.otherPlayers[id]) {
          point = {}
          point.x = x
          point.y = y
          point.time = performance.now()
          Game.otherPlayers[id].interpolationPoints.push(point)
        }
      }
  })
}

// Send update to server
Network.update = function() {
  let x = Game.player.x.toFixed(0).padStart(3, '0')
  let y = Game.player.y.toFixed(0).padStart(3, '0')
  socket.send(`4${x}${y}`)
}
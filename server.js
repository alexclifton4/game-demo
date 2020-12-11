const express = require('express');
const app = express();
const { Server } = require('ws')

let players = {}
let nextPlayerId = 0

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  console.log("Listening on port", port)
});

// Websockets
const wss = new Server({server})

// ws server incoming connections
wss.on('connection', (ws) => {
  console.log("Client connected")
  
  // Recieve a message
  ws.on('message', data => {
    // first character is message type, rest is message
    let type = parseInt(data.charAt(0))
    let message = data.substring(1)
    
    // Message router
    switch (type) {
      case 1: // Request to join
        joinRequest(ws, message)
        break
      case 4: // Player position
        playerPosition(ws, message)
        break
    }
  })
})

// Send a message to a socket
let sendMessage = function(ws, type, message) {
  // Append message type to front of message
  message = type + message
  
  ws.send(message)
}

// Broadcast a message to all sockets
let broadcastMessage = function(type, message) {
  // Append message type to front of message
  message = type + message
  
  for (let id in players) {
    players[id].ws.send(message)
  }
}

// Request to join
let joinRequest = function(ws, message) {
  // Create a new player object
  let player = {}
  player.id = nextPlayerId++
  player.ws = ws
  player.x = player.y = "000"
  players[player.id] = player
  
  console.log("Player joined with ID: ", player.id)
  
  // Send the id to the player
  sendMessage(ws, "2", player.id)
  
  // Broadcast the new player to all other players
  broadcastMessage("3", player.id)
}

// Receive a position update
let playerPosition = function(ws, message) {
  // Message is x followed by y then player id
  // x and y are 3 characters each
  let x = message.substring(0, 3)
  let y = message.substring(3, 6)
  let id = message.substring(6)
  
  players[id].x = x
  players[id].y = y
}

// Called periodically to send updates to players
let sendUpdates = function() {
  let message = ""
  for (let id in players) {
    message += players[id].x + players[id].y + id + ","
  }
  // Remove trailing comma
  message = message.slice(0, -1)
  
  broadcastMessage("5", message)
}
setInterval(sendUpdates, 100)
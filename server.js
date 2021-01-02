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
  
  // When a connection is closed
  ws.on('close', (code, reason) => {
    console.log("Player leaving: " + ws.id)
    // Remove them from the server
    delete players[ws.id]
    
    // Tell all other players
    broadcastMessage("7", ws.id)
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
  player.x = (Math.random()*775).toFixed(0).padStart(3, '0')
  player.y = (Math.random()*575).toFixed(0).padStart(3, '0')
  player.colour = (Math.random()*0xffffff).toString(16).slice(-6)
  players[player.id] = player
  
  ws.id = player.id
  
  console.log("Player joined with ID: ", player.id)
  
  // Send the player details to the player
  // Format: colour(6 digits) XY(3 + 3 digits) id(remaining digits to end)
  let newMessage = player.colour + player.x + player.y + player.id
  // Add the existing players to the message, in the same format
  for (let id in players) {
    // ignore the player that we are sending the message to
    if (id != player.id)
    newMessage += "," + players[id].colour + players[id].x + players[id].y + id
  }
  sendMessage(ws, "2", newMessage)
  
  // Broadcast the new player to all other players
  broadcastMessage("3", player.colour + player.x + player.y + player.id)
}

// Receive a position update
let playerPosition = function(ws, message) {
  // Message is x followed by y
  // x and y are 3 characters each
  let x = message.substring(0, 3)
  let y = message.substring(3, 6)
  
  players[ws.id].x = x
  players[ws.id].y = y
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
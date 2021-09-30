# Multiplayer Game Demo

I wanted to see if I could make the basics of a multiplayer game system, inspired by Among Us.
This is a simple demo with only a joystick which moves a square around the screen, but multiple players can be online at the same time.

The demo can be found here: [https://games.alexclifton.co.uk](https://games.alexclifton.co.uk).
The server is written with Node.js, while the client uses vanilla JS and PIXI.js for graphics. The two communicate using WebSockets.

Among Us was made with Unity and almost definitely uses a library for network communications, so the goal of this for me was not to replicate the game, but instead the network layer.

## Game architecture

The graphics update at roughly 60 fps, while the network updates about 10 times per second.
Every 100ms, the client sends its location to the server, and the server sends out an update with the positions of all clients. (This is not a call and response, the client and server have their own timer and initiate the messages themselves.)

As the players location updates 6 times slower than the graphics are rendered, this would result in jittery movement, so I implemented entity interpolation. The client delays rendering the other players by 2 network frames and interpolates between it's known positions.

However, as the client sends its position to the server, and the server simply forwards this to the other clients, there is no protection against cheating.
The next step would be to make the server authoritative, with the most common way of doing this being for the client to send the inputs from the joystick, instead of the position of the player. The server could them use this to calculate game logic, and then send player locations to all the clients.
To make this easier, I decided to make the joystick only use a few discrete values.

The following websites were really useful and helped me understand all of this:
* [Gabriel Gambetta](https://www.gabrielgambetta.com/client-server-game-architecture.html)
* [Valve Developer Community](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)

## Network protocol
I will document the network messages sometime hopefully soon.

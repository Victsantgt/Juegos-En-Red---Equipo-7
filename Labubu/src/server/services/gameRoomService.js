/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        score: 0
      },
      player2: {
        ws: player2Ws,
        score: 0
      },
      active: true,
    };

    rooms.set(roomId, room);

    // Spawn powerups
    spawnPowerup(player1Ws)
    room.powerupInterval = setInterval(() => spawnPowerup(player1Ws), 8000);


    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    return roomId;
  }

  /**
   * Handle paddle movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {number} y - Paddle Y position
   */
  function handleLabubuMove(ws, x, y, dir) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'labubuUpdate',
        x,
        y,
        dir
      }));
    }
  }

  // FUNCION PARA MANEJAR EL SPAWN DE POWERUPS
  function spawnPowerup(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    let posIndex = Math.floor(Math.random()*5);
    let powerupPositions = [[96,96],[608,96],[96,480],[608,480],[352,288]];

    const x = powerupPositions[posIndex][0];
    const y = powerupPositions[posIndex][1];

    let powerupType = Math.ceil(Math.random() * 3)

    if (room.player1.ws.readyState === 1) {
      room.player1.ws.send(JSON.stringify({
          type: 'powerupSpawn',
          powerupType: powerupType,
          x: x,
          y: y
      }));
    }

    if (room.player2.ws.readyState === 1) {
      room.player2.ws.send(JSON.stringify({
          type: 'powerupSpawn',
          powerupType: powerupType,
          x: x,
          y: y
      }));
    }
  }

  // FUNCION PARA DISPAROS
  function shoot(ws, x, y, dir) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    if (room.player1.ws.readyState === 1) { // WebSocket.OPEN
      room.player1.ws.send(JSON.stringify({
        type: 'shoot',
        x,
        y,
        dir
      }));
    }

    if (room.player2.ws.readyState === 1) { // WebSocket.OPEN
      room.player2.ws.send(JSON.stringify({
        type: 'shoot',
        x,
        y,
        dir
      }));
    }
  }

  function updateSkin(ws,skin){
    
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'updateSkin',
        skin
      }));
    }
  }

  /**
   * Handle goal event from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} side - Which side scored ('left' or 'right')
   */
  function handleGoal(ws, side) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Prevent duplicate goal detection (both clients send goal event)
    // Only process goal if ball is active
    if (!room.ballActive) {
      return; // Ball not in play, ignore goal
    }
    room.ballActive = false; // Mark ball as inactive until relaunched

    // Update scores
    // When ball hits LEFT goal (x=0), player2 scores (player1 missed)
    // When ball hits RIGHT goal (x=800), player1 scores (player2 missed)
    if (side === 'left') {
      room.player2.score++;
    } else if (side === 'right') {
      room.player1.score++;
    }

    // Broadcast score update to both players
    const scoreUpdate = {
      type: 'scoreUpdate',
      player1Score: room.player1.score,
      player2Score: room.player2.score
    };

    room.player1.ws.send(JSON.stringify(scoreUpdate));
    room.player2.ws.send(JSON.stringify(scoreUpdate));

    // Check win condition (first to 2)
    if (room.player1.score >= 2 || room.player2.score >= 2) {
      const winner = room.player1.score >= 2 ? 'player1' : 'player2';

      const gameOverMsg = {
        type: 'gameOver',
        winner,
        player1Score: room.player1.score,
        player2Score: room.player2.score
      };

      room.player1.ws.send(JSON.stringify(gameOverMsg));
      room.player2.ws.send(JSON.stringify(gameOverMsg));

      // Mark room as inactive
      room.active = false;
    } else {
      // Relaunch ball after 1 second delay
      setTimeout(() => {
        if (room.active) {
          // Generate new ball direction
          const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
          const speed = 300;
          const ballData = {
            x: 400,
            y: 300,
            vx: speed * Math.cos(angle),
            vy: speed * Math.sin(angle)
          };

          // Send ball relaunch to both players
          const relaunchMsg = {
            type: 'ballRelaunch',
            ball: ballData
          };

          room.player1.ws.send(JSON.stringify(relaunchMsg));
          room.player2.ws.send(JSON.stringify(relaunchMsg));

          // Mark ball as active again
          room.ballActive = true;
        }
      }, 1000);
    }
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

    if (room.powerupInterval) {
      clearInterval(room.powerupInterval);
    }

    // Clean up room
    room.active = false;
    rooms.delete(roomId);
  }

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handleLabubuMove,
    shoot,
    handleGoal,
    handleDisconnect,
    getActiveRoomCount,
    updateSkin
  };
}

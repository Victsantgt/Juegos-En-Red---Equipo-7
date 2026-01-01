/**
 * Lobby Scene - Waiting for multiplayer matchmaking
 */
export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
    this.ws = null;
  }

  preload(){
        this.load.image('matchamaking', 'assets/matchamaking.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.cameras.main.setBackgroundColor('#000000ff');

    let matchamaking = this.add.image(0, 0, 'matchamaking').setOrigin(0, 0);

    // Title
    this.add.text(4+(width / 2), 104, 'MATCHA-MAKING...!', {
      fontFamily: 'Lemon',
      fontSize: '52px',
      color: '#f35b15ff'
    }).setOrigin(0.5);

    this.add.text(2+(width / 2), 102, 'MATCHA-MAKING...!', {
      fontFamily: 'Lemon',
      fontSize: '52px',
      color: '#ff9a1eff'
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 100, 'MATCHA-MAKING...!', {
      fontFamily: 'Lemon',
      fontSize: '52px',
      color: '#ffc720ff'
    }).setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Connecting to server...', {
      fontFamily: 'Lemon',
      fontSize: '24px',
      color: '#646F4B'
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontFamily: 'Lemon',
      fontSize: '20px',
      color: '#F5B800'
    }).setOrigin(0.5);

    // Cancel button
    const cancelButton = this.add.text(width / 2, height - 100, 'Cancel', {
      fontFamily: 'Lemon',
      fontSize: '24px',
      color: '#CA3C25',
      backgroundColor: '#F5B800',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    cancelButton.on('pointerover', () => {
      cancelButton.setColor('#671E13');
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setColor('#CA3C25');
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
      this.scene.start('MenuScene');
    });

    // Connect to WebSocket server
    this.connectToServer();
  }

  connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.statusText.setText('Waiting for opponent...');

        // Join matchmaking queue
        this.ws.send(JSON.stringify({ type: 'joinQueue' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          console.error('Error parsing server message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.statusText.setText('Connection error!');
        this.statusText.setColor('#CA3C25');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          this.statusText.setText('Connection lost!');
          this.statusText.setColor('#CA3C25');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      this.statusText.setText('Failed to connect!');
      this.statusText.setColor('#CA3C25');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Players in queue: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        // Store game data and transition to multiplayer game scene
        this.scene.start('MultiplayerGameScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
          initialBall: data.ball
        });
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  leaveQueue() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
      this.ws.close();
    }
  }

  shutdown() {
    this.leaveQueue();
  }
}

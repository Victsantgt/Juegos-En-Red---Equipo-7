import Phaser from 'phaser';
import { Labubu } from '../entities/Labubu';
import { Bullet } from '../entities/Bullet';
import { RailNode } from '../entities/RailNode';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MovePaddleCommand } from '../commands/MovePaddleCommand';
import { PauseGameCommand } from '../commands/PuaseGameCommand';
import { Powerup } from '../entities/Powerup';
import { PowerupSpeed } from '../entities/PowerupSpeed';
import { PowerupTurn } from '../entities/PowerupTurn';
import { PowerupHealth } from '../entities/PowerupHealth';
import { connectionManager } from '../services/ConnectionManager';
collider1: Phaser.Physics.Arcade.Image;
nodes: Phaser.Physics.Arcade.StaticGroup;

/**
 * Multiplayer Game Scene - Online pong game
 * Ball physics run on both clients (deterministic)
 * Server only tracks scores and relays paddle positions
 */
export class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        this.remoteSkin = 0; // Valor por defecto skin
        this.ws = data.ws;
        this.playerRole = data.playerRole; // 'player1' | 'player2'
        this.roomId = data.roomId;

        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();
        this.bullets = [];
        this.gameEnded = false;

        this.localLabubu = null;
        this.remoteLabubu = null;
        this.localScore = 0;
        this.remoteScore = 0;
    }

    preload() {
        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('colliderCuadrado', 'assets/colliderCuadrado.png');
        this.load.image('colliderRectangulo', 'assets/colliderRectangulo.png');
        this.load.image('tapioca', 'assets/tapioca.png');

        this.load.audio('musicaBatalla', 'assets/audio/battleTheme.mp3');
        this.load.audio('spawn', 'assets/audio/itemSpawn.mp3');
        this.load.audio('powerupSonido', 'assets/audio/powerup.mp3');
        this.load.audio('aciertoSonido', 'assets/audio/hit.mp3');
        this.load.audio('disparoSonido', 'assets/audio/shoot.mp3');
        this.load.audio('choque', 'assets/audio/choque.mp3');

        //SPRITES LABUBUS

        //labubu

        this.load.spritesheet('labubu', 'assets/yellow/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu-l', 'assets/yellow/left.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu-r', 'assets/yellow/right.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu-u', 'assets/yellow/up.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        //labubu 2

        this.load.spritesheet('labubu2', 'assets/brownanim/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu2-l', 'assets/brownanim/left.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu2-r', 'assets/brownanim/right.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu2-u', 'assets/brownanim/up.png', {
            frameWidth: 68,
            frameHeight: 88
        });
        
        //labubu 3

        this.load.spritesheet('labubu3', 'assets/purpleanim/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu3-l', 'assets/purpleanim/left.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu3-r', 'assets/purpleanim/right.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu3-u', 'assets/purpleanim/up.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        //labubu 4

        this.load.spritesheet('labubu4', 'assets/redanim/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu4-l', 'assets/redanim/left.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu4-r', 'assets/redanim/right.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        this.load.spritesheet('labubu4-u', 'assets/redanim/up.png', {
            frameWidth: 68,
            frameHeight: 88
        });

        //SPRITES POWERUPS

        this.load.spritesheet('powerupSpeed', 'assets/chocolate/chocolateSpeed.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('powerupTurn', 'assets/chocolate/chocolateTurn.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('powerupHealth', 'assets/chocolate/chocolateHealth.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    create() {
        
        // FADE IN
        this.cameras.main.fadeIn(1000, 255, 255, 255);

        let fondo = this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        ////ANIMACIONES LABUBU 1////

        this.anims.create({
            key: 'labubu1-down',
            frames: this.anims.generateFrameNumbers('labubu', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu1-left',
            frames: this.anims.generateFrameNumbers('labubu-l', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu1-right',
            frames: this.anims.generateFrameNumbers('labubu-r', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu1-up',
            frames: this.anims.generateFrameNumbers('labubu-u', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //ANIMACIONES LABUBU 2//

        this.anims.create({
            key: 'labubu2-down',
            frames: this.anims.generateFrameNumbers('labubu2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu2-left',
            frames: this.anims.generateFrameNumbers('labubu2-l', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu2-right',
            frames: this.anims.generateFrameNumbers('labubu2-r', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu2-up',
            frames: this.anims.generateFrameNumbers('labubu2-u', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //ANIMACIONES LABUBU 3//

        this.anims.create({
            key: 'labubu3-down',
            frames: this.anims.generateFrameNumbers('labubu3', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu3-left',
            frames: this.anims.generateFrameNumbers('labubu3-l', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu3-right',
            frames: this.anims.generateFrameNumbers('labubu3-r', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu3-up',
            frames: this.anims.generateFrameNumbers('labubu3-u', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //ANIMACIONES LABUBU 4//

        this.anims.create({
            key: 'labubu4-down',
            frames: this.anims.generateFrameNumbers('labubu4', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu4-left',
            frames: this.anims.generateFrameNumbers('labubu4-l', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu4-right',
            frames: this.anims.generateFrameNumbers('labubu4-r', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'labubu4-up',
            frames: this.anims.generateFrameNumbers('labubu4-u', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });


        //ANIMACIÓN POWERUP HEALTH
        this.anims.create({
            key: 'powerupHealth',
            frames: this.anims.generateFrameNumbers('powerupHealth', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        //ANIMACIÓN POWERUP SPEED
        this.anims.create({
            key: 'powerupSpeed',
            frames: this.anims.generateFrameNumbers('powerupSpeed', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        })

        //ANIMACIÓN POWERUP TURN
        this.anims.create({
            key: 'powerupTurn',
            frames: this.anims.generateFrameNumbers('powerupTurn', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        // puntuaciones
        //j1 arriba izquierda
        this.scoreLeft = this.add.text(17, 0, '3', {
            fontFamily: 'Lemon',
            fontSize: '48px',
            color: '#e6dd38'
        });

        //j2 arriba derecha
        this.rightScore = this.add.text(657, 0, '3', {
            fontFamily: 'Lemon',
            fontSize: '48px',
            color: '#8a452e'
        });

        // Role indicator
        const roleText = this.playerRole === 'player1' ? 'Eres el Jugador 1 (Izquierda)' : 'Eres el jugador 2 (Derecha)';

        // Cambiamos 400 -> centerX
        this.add.text(352, 20, roleText, {
            fontFamily: 'Lemon',
            fontSize: '16px',
            color: '#ffff00'
        }).setOrigin(0.5);

        //MÚSICA
        this.sound.stopAll();
        this.sound.removeAll();
        this.musica = this.sound.add('musicaBatalla', {
            loop: true,
            volume: 0.3
        });
        this.musica.play();

        this.sfxcolision = this.sound.add('choque', {
            loop: false,
            volume: 1
        });

        this.createBounds();
        this.setRailNodes();

        //PAREDES DEL ESCENARIO. Todo esto se puede borrar cuando tengamos el escenario final, es solo para verlo visualmente
        this.walls = this.physics.add.staticGroup();

        let wall1 = this.walls.create(192, 190, 'colliderCuadrado');
        wall1.body.setSize(128, 136);
        wall1.setVisible(true);
        wall1.refreshBody();

        /*let wall2 = this.walls.create(512, 380, 'colliderCuadrado');
        wall2.body.setSize(128, 136);
        wall2.setVisible(true);
        wall2.refreshBody();*/

        let wall3 = this.walls.create(256, 380, 'colliderRectangulo');
        wall3.body.setSize(256, 136);
        wall3.setVisible(true);
        wall3.refreshBody();

        let wall4 = this.walls.create(448, 188, 'colliderRectangulo');
        wall4.body.setSize(256, 136);
        wall4.setVisible(true);
        wall4.refreshBody();

        //grupo para los powerups creados en spawnPowerup()
        this.powerups = this.physics.add.group();
        
        
        this.cursors = this.input.keyboard.createCursorKeys();

        // BORRAR ESTO MÁS TARDE QUE ES PARA CERRAR EL SOCKET MANUALMENTE
        this.input.keyboard.on('keydown-K', () => {
            this.ws.close();
        });

        this.setUpPlayers();
        
        // ---- COLLIDERS LABUBU LOCAL ----
        //COLLIDERS CON LÍMITES DE PAREDES
        this.physics.add.collider(this.localLabubu.sprite, this.leftWall);
        this.physics.add.collider(this.localLabubu.sprite, this.rightWall);
        this.physics.add.collider(this.localLabubu.sprite, this.topWall);
        this.physics.add.collider(this.localLabubu.sprite, this.bottomWall);

        //COLLIDERS NODOS
        this.physics.add.overlap(this.localLabubu.sprite, this.nodes, (spr, node) => {
            this.localLabubu.canTurn = true;
        }, null, this);

        //COLLIDERS CON POWERUPS
        this.physics.add.overlap(this.localLabubu.sprite, this.powerups, this.collectPowerup, null, this);

        // ---- COLLIDERS LABUBU REMOTO ----
        //COLLIDERS CON LÍMITES DE PAREDES
        this.physics.add.collider(this.remoteLabubu.sprite, this.leftWall);
        this.physics.add.collider(this.remoteLabubu.sprite, this.rightWall);
        this.physics.add.collider(this.remoteLabubu.sprite, this.topWall);
        this.physics.add.collider(this.remoteLabubu.sprite, this.bottomWall);

        //COLLIDERS NODOS
        this.physics.add.overlap(this.remoteLabubu.sprite, this.nodes, (spr, node) => {
            this.remoteLabubu.canTurn = true;
        }, null, this);

        //COLLIDERS CON POWERUPS
        this.physics.add.overlap(this.remoteLabubu.sprite, this.powerups, this.collectPowerup, null, this);

        //COLLIDER CHOQUE JUGADORES
        this.physics.add.overlap(this.localLabubu.sprite, this.remoteLabubu.sprite, () => {
            if (this.localLabubu.turnMode !== this.remoteLabubu.turnMode) {
                this.localLabubu.lastNode = null;
                this.remoteLabubu.lastNode = null;
                switch (this.localLabubu.currentDirection) {
                    case 'down':
                        this.localLabubu.currentDirection = 'up';
                        this.localLabubu.turnCooldown = 10;
                        this.localLabubu.alternateTurnmode();
                        break;
                    case 'up':
                        this.localLabubu.currentDirection = 'down';
                        this.localLabubu.turnCooldown = 10;
                        this.localLabubu.alternateTurnmode();
                        break;
                    case 'left':
                        this.localLabubu.currentDirection = 'right';
                        this.localLabubu.turnCooldown = 10;
                        this.localLabubu.alternateTurnmode();
                        break;
                    case 'right':
                        this.localLabubu.currentDirection = 'left';
                        this.localLabubu.turnCooldown = 10;
                        this.localLabubu.alternateTurnmode();
                        break;
                }
                switch (this.remoteLabubu.currentDirection) {
                    case 'down':
                        this.remoteLabubu.currentDirection = 'up';
                        this.remoteLabubu.turnCooldown = 10;
                        this.remoteLabubu.alternateTurnmode();
                        break;
                    case 'up':
                        this.remoteLabubu.currentDirection = 'down';
                        this.remoteLabubu.turnCooldown = 10;
                        this.remoteLabubu.alternateTurnmode();
                        break;
                    case 'left':
                        this.remoteLabubu.currentDirection = 'right';
                        this.remoteLabubu.turnCooldown = 10;
                        this.remoteLabubu.alternateTurnmode();
                        break;
                    case 'right':
                        this.remoteLabubu.currentDirection = 'left';
                        this.remoteLabubu.turnCooldown = 10;
                        this.remoteLabubu.alternateTurnmode();
                        break;
                }
                this.sfxcolision.play();
            }
        });

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.setupWebSocketListeners();

        this.connectionListener = (data) => {
            if (!data.connected && this.scene.isActive()) {
                this.onConnectionLost();
            }
        };
        connectionManager.addListener(this.connectionListener);
    }

    createBounds() {
        const gameWidth = 704;
        const gameHeight = 576;
        const wallThickness = 70;

        this.leftWall = this.add.rectangle(wallThickness / 2, gameHeight / 2, wallThickness, gameHeight);
        this.physics.add.existing(this.leftWall, true);
        this.leftWall.visible = false;

        this.rightWall = this.add.rectangle(gameWidth - wallThickness / 2, gameHeight / 2, wallThickness, gameHeight);
        this.physics.add.existing(this.rightWall, true);
        this.rightWall.visible = false;

        this.topWall = this.add.rectangle(gameWidth / 2, wallThickness / 2, gameWidth, wallThickness);
        this.physics.add.existing(this.topWall, true);
        this.topWall.visible = false;

        this.bottomWall = this.add.rectangle(gameWidth / 2, gameHeight - wallThickness / 2, gameWidth, wallThickness);
        this.physics.add.existing(this.bottomWall, true);
        this.bottomWall.visible = false;
    }

    setRailNodes() {
        this.nodes = this.add.group(); // sin classType

        //nodo superior
        this.nodes.add(new RailNode(this, 289, 82.5, [
            { direction: "down", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
            { direction: "down", turnMode: "normal" }], 0));
       
        //nodo central derecho
        this.nodes.add(new RailNode(this, 288.5,268.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
            { direction: "left", turnMode: "normal" }], 1));
        
        //nodo central izquierdo
        this.nodes.add(new RailNode(this,  416.5, 268.5, [
            { direction: "down", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
            ], 1));
        //nodo izquierdo
         this.nodes.add(new RailNode(this,  608.5, 268.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "down", turnMode: "normal" },
            ], 2));
        //nodo derecho
         this.nodes.add(new RailNode(this,  98.5, 268.5, [
            { direction: "up", turnMode: "normal" },
            { direction: "right", turnMode: "normal" },
            { direction: "down", turnMode: "reverse" },
            ], 2));


        //nodo abajo del todo
         this.nodes.add(new RailNode(this,  416.5, 460.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "left", turnMode: "normal" },
            { direction: "right", turnMode: "reverse" },
            ], 3));
        
    }

    setUpPlayers() {
        if (this.playerRole === 'player1') {
            this.localLabubu = new Labubu(this, 'player1', 96, 220, 'labubu3-down');
            this.remoteLabubu = new Labubu(this, 'player2', 608, 220, '');
            this.localLabubu.turnMode = "reverse";
            this.remoteLabubu.turnMode = "normal";
        } else {
            this.localLabubu = new Labubu(this, 'player2', 608, 220, 'labubu3-down');
            this.remoteLabubu = new Labubu(this, 'player1', 96, 220, '');
            this.localLabubu.turnMode = "normal";
            this.remoteLabubu.turnMode = "reverse";
        }

        switch (parseInt(localStorage.getItem("skin"), 10)) {
            case 1:
                this.localLabubu.animKey = 'labubu1-down';
                break;

            case 0:
                this.localLabubu.animKey = 'labubu2-down';
                break;

            case 2:
                this.localLabubu.animKey = 'labubu3-down';
                break;

            case 3:
                this.localLabubu.animKey = 'labubu4-down';
                break;
        }

        this.sendMessage({
            type: 'updateSkin',
            skin: parseInt(localStorage.getItem("skin"), 10)
        });


        this.localLabubu.score = 3;
        this.remoteLabubu.score = 3;
    }

    spawnPowerup(data) {
        let powerup;
        switch (data.powerupType) {
            case 1:
                powerup = new PowerupSpeed(this, 'powerupSpeed');
                powerup.sprite.play('powerupSpeed');
                break;
            case 2:
                powerup = new PowerupTurn(this, 'powerupTurn');
                powerup.sprite.play('powerupTurn');
                break;
            case 3:
                powerup = new PowerupHealth(this, 'powerupHealth');
                powerup.sprite.play('powerupHealth');
                break;
        }
        powerup.sprite.setPosition(data.x, data.y);
        this.powerups.add(powerup.sprite);  // añadir al grupo de powerups
    }

    collectPowerup(player, powerup) {

        let speedmult = 1.4;
        player.lastNode = null; 
        this.sfxpowerup = this.sound.add('powerupSonido', {
            loop: false,
            volume: 1
        });
        this.sfxpowerup.play();

        if (powerup.poweruptype == 'Speed') {

            player.playerInstance.baseSpeed *= speedmult;
            player.playerInstance.scene.time.delayedCall(5000, () => {
                player.playerInstance.baseSpeed /= speedmult;
            });

        } else if (powerup.poweruptype == 'Turn') {
            player.playerInstance.score--;
            this.scoreUpdate();
        } else {
            player.playerInstance.score++;
            this.scoreUpdate();
        }


        powerup.destroy();

    }

    scoreUpdate() {
        // Si el juego ya terminó, no actualizamos nada más
        if (this.gameEnded) return;

        this.scoreLeft.setText(this.localLabubu.score.toString());
        this.rightScore.setText(this.remoteLabubu.score.toString());

        if (this.playerRole === 'player1') {
            if (this.localLabubu.score <= 0) {
                this.endGame('player2'); // Gana el 2 porque el 1 murió
            }
            else if (this.remoteLabubu.score <= 0) {
                this.endGame('player1'); // Gana el 1 porque el 2 murió
            }
        }
        else {
            if (this.localLabubu.score <= 0) {
                this.endGame('player1'); // Gana el 1 porque el 2 murió
            }
            else if (this.remoteLabubu.score <= 0) {
                this.endGame('player2'); // Gana el 2 porque el 1 murió
            }
        }
    }

    endGame(winnerId) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        this.physics.pause();
        this.scene.pause();

        // 1. Obtener skin local
        const mySkin = parseInt(localStorage.getItem("skin"), 10) || 0;

        // 2. Asignar skins a Player 1 y Player 2
        let p1Skin, p2Skin;

        if (this.playerRole === 'player1') {
            console.log(mySkin);
            console.log(this.remoteSkin);
            p1Skin = mySkin;
            p2Skin = this.remoteSkin;
        } else {
            console.log(mySkin);
            console.log(this.remoteSkin);
            p1Skin = this.remoteSkin;
            p2Skin = mySkin;
        }

        // 3. Lanzar victoria pasando todos los datos
        this.scene.launch('MultiplayerVictoryScene', { 
            winnerId: winnerId,
            p1Skin: p1Skin, // Skin del J1
            p2Skin: p2Skin, // Skin del J2
            isMultiplayer: true // Aviso de que es online
        });
    }

    getTurnDirectionNormal(dir) {
        const fixedTurns = {
            'left': 'up',
            'up': 'right',
            'right': 'down',
            'down': 'left'
        };
        return fixedTurns[dir];
    }

    getTurnDirectionReverse(dir) {
        const reverseTurns = {
            'left': 'down',
            'down': 'right',
            'right': 'up',
            'up': 'left'
        };
        return reverseTurns[dir];
    }

    setPauseState(isPaused) {
        this.isPaused = isPaused;
        if (isPaused) {
            this.scene.launch('PauseScene', { originalScene: 'GameScene' });
            this.scene.pause();
        }
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        const newPauseState = !this.isPaused;
        this.processor.process(
            new PauseGameCommand(this, newPauseState)
        );
    }

    createMenuButton() {
        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#cccccc'))
        .on('pointerout', () => menuBtn.setColor('#ffffff'))
        .on('pointerdown', () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.scene.start('MenuScene');
        });
    }

    onConnectionLost() {
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', { previousScene: 'GameScene' });
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }

    setupWebSocketListeners() {
        this.ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data);
        });

        this.ws.addEventListener('close', () => this.handleDisconnection());
        this.ws.addEventListener('error', () => this.handleDisconnection());
    }

    handleDisconnection() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.localLabubu.sprite.setVelocity(0, 0);
        this.remoteLabubu.sprite.setVelocity(0, 0);
        this.physics.pause();

        this.add.text(352, 288, '¡OPONENTE DESCONECTADO!', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#ff0000',
            // --- SOMBRA ---
            shadow: {
                offsetX: 3,       // Desplazamiento horizontal
                offsetY: 3,       // Desplazamiento vertical
                color: '#000000', // Color de la sombra (Negro)
                blur: 0,          // Difuminado (0 es nítido, ideal para pixel art)
                stroke: true,     // Si la sombra se aplica al borde
                fill: true        // Si la sombra se aplica al relleno
            }
        }).setOrigin(0.5);
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
 
    handleServerMessage(data) {
        switch (data.type) {

            case 'labubuUpdate':
                this.remoteLabubu.sprite.x = data.x;
                this.remoteLabubu.sprite.y = data.y;
                this.remoteLabubu.currentDirection = data.dir;
                break;

            case 'powerupSpawn':
                this.spawnPowerup(data);
                break;

            case 'shoot':
                this.shoot(data);
                this.sfxshot = this.sound.add('disparoSonido', {
                    loop: false,
                    volume: 1
                });
                this.sfxshot.play();
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            case 'updateSkin':
                switch(data.skin){
                    case 1:
                        this.remoteSkin = 1;
                        this.remoteLabubu.animKey = 'labubu1-down';
                        break;

                    case 0:
                        this.remoteSkin = 0;
                        this.remoteLabubu.animKey = 'labubu2-down';
                        break;
                        
                    case 2:
                        this.remoteSkin = 2;
                        this.remoteLabubu.animKey = 'labubu3-down';
                        break;

                    case 3:
                        this.remoteSkin = 3;
                        this.remoteLabubu.animKey = 'labubu4-down';
                        break;
                }
                break;

            default:
                console.log('Unknown message type:', data.type);
        }

    }

    animateRemoteLabubu(anim) {
        if (!anim) return;
        
        if (
            (anim.endsWith('down') && this.remoteLabubu.currentDirection !== 'down') ||
            (anim.endsWith('left') && this.remoteLabubu.currentDirection !== 'left') ||
            (anim.endsWith('right') && this.remoteLabubu.currentDirection !== 'right') ||
            (anim.endsWith('up') && this.remoteLabubu.currentDirection !== 'up')) {

            if (this.remoteLabubu.currentDirection === 'right' && anim.startsWith('labubu1-')) this.remoteLabubu.sprite.play('labubu1-right');
            if (this.remoteLabubu.currentDirection === 'left' && anim.startsWith('labubu1-')) this.remoteLabubu.sprite.play('labubu1-left');
            if (this.remoteLabubu.currentDirection === 'down' && anim.startsWith('labubu1-')) this.remoteLabubu.sprite.play('labubu1-down');
            if (this.remoteLabubu.currentDirection === 'up' && anim.startsWith('labubu1-')) this.remoteLabubu.sprite.play('labubu1-up');

            if (this.remoteLabubu.currentDirection === 'right' && anim.startsWith('labubu2-')) this.remoteLabubu.sprite.play('labubu2-right');
            if (this.remoteLabubu.currentDirection === 'left' && anim.startsWith('labubu2-')) this.remoteLabubu.sprite.play('labubu2-left');
            if (this.remoteLabubu.currentDirection === 'down' && anim.startsWith('labubu2-')) this.remoteLabubu.sprite.play('labubu2-down');
            if (this.remoteLabubu.currentDirection === 'up' && anim.startsWith('labubu2-')) this.remoteLabubu.sprite.play('labubu2-up');

            if (this.remoteLabubu.currentDirection === 'right' && anim.startsWith('labubu3-')) this.remoteLabubu.sprite.play('labubu3-right');
            if (this.remoteLabubu.currentDirection === 'left' && anim.startsWith('labubu3-')) this.remoteLabubu.sprite.play('labubu3-left');
            if (this.remoteLabubu.currentDirection === 'down' && anim.startsWith('labubu3-')) this.remoteLabubu.sprite.play('labubu3-down');
            if (this.remoteLabubu.currentDirection === 'up' && anim.startsWith('labubu3-')) this.remoteLabubu.sprite.play('labubu3-up');

            if (this.remoteLabubu.currentDirection === 'right' && anim.startsWith('labubu4-')) this.remoteLabubu.sprite.play('labubu4-right');
            if (this.remoteLabubu.currentDirection === 'left' && anim.startsWith('labubu4-')) this.remoteLabubu.sprite.play('labubu4-left');
            if (this.remoteLabubu.currentDirection === 'down' && anim.startsWith('labubu4-')) this.remoteLabubu.sprite.play('labubu4-down');
            if (this.remoteLabubu.currentDirection === 'up' && anim.startsWith('labubu4-')) this.remoteLabubu.sprite.play('labubu4-up');
        }
    }

    update() {

        if (this.gameEnded) return;

        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }

        // MOVIMIENTO BALAS
        this.bullets.forEach(bullet => {
            switch (bullet.currentDirection) {
                case 'up':
                    bullet.sprite.setVelocity(0, -bullet.speed);
                    break;
                case 'down':
                    bullet.sprite.setVelocity(0, bullet.speed);
                    break;
                case 'left':
                    bullet.sprite.setVelocity(-bullet.speed, 0);
                    break;
                case 'right':
                    bullet.sprite.setVelocity(bullet.speed, 0);
                    break;
            }
        });

        // MANEJAR MOVIMIENTO LOCAL
        const speed = this.localLabubu.baseSpeed;
        const body = this.localLabubu.sprite.body;
        let newDirection = this.localLabubu.currentDirection;

        this.localLabubu.updateCenterCollider();

        //DETECTAR SI ESTÁ SOBRE UN NODO
        this.physics.overlap(this.localLabubu.centerCollider, this.nodes, (spr, node) => {
            if (this.localLabubu.isWaitingAtNode) return;
            if (this.localLabubu.lastNode === node) return;

            if (Phaser.Math.Distance.Between(this.localLabubu.centerCollider.x, this.localLabubu.centerCollider.y, node['x'], node['y']) > 18) {
                return;
            }

            this.localLabubu.lastNode = node;
            this.localLabubu.isWaitingAtNode = true;

            // Guardar direcciones válidas (FUNCIONA)
            this.localLabubu.allowedTurns = node['allowedTurns'].map(e => e.direction);
            this.localLabubu.nodeRules = node['allowedTurns'];
            //parar en seco
            this.localLabubu.sprite.setVelocity(0, 0);
            this.snapLabubuToNode(this.localLabubu, node);
        });

        //INPUT
        let inputDir = null;
        if (this.cursors.up.isDown) {
            inputDir = 'up';
        } else if (this.cursors.down.isDown) {
            inputDir = 'down';
        } else if (this.cursors.left.isDown) {
            inputDir = 'left';
        } else if (this.cursors.right.isDown) {
            inputDir = 'right';
        } else {
            inputDir = 'default';
        }

        if (this.localLabubu.isWaitingAtNode && inputDir && this.localLabubu.allowedTurns.includes(inputDir)) {

            console.log("GIRANDO A " + inputDir);
            // aceptar dirección
            this.localLabubu.currentDirection = inputDir;

            // Buscar la regla correspondiente en el array
            const rule = this.localLabubu.nodeRules.find(e => e.direction === inputDir);
            if (rule) {
                this.localLabubu.turnMode = rule.turnMode;
            }
            this.localLabubu.isWaitingAtNode = false;

            this.localLabubu.exitingNode = true;
            console.log(this.localLabubu.turnMode);


        }
        
        this.sendMessage({
            type: 'labubuMove',
            x: this.localLabubu.sprite.x,
            y: this.localLabubu.sprite.y,
            dir: this.localLabubu.currentDirection
        });

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.localLabubu.cooldown <= 0) 
        {
            this.sendMessage({
                type: 'shoot',
                x: this.localLabubu.sprite.x,
                y: this.localLabubu.sprite.y,
                dir: this.localLabubu.currentDirection
            });
            this.localLabubu.cooldown = 300;
        }

        
 
        //ANIMACIONES LABUBU LOCAL

        let newAnimL = this.localLabubu.animKey;
        let newAnimR = this.remoteLabubu.animKey;
        if (newAnimL && this.localLabubu.currentAnim !== newAnimL) {
                this.localLabubu.sprite.play(newAnimL, true);
                this.localLabubu.currentAnim = newAnimL;
            }

        if (newAnimR && this.remoteLabubu.currentAnim !== newAnimR) {
                this.remoteLabubu.sprite.play(newAnimR, true);
                this.remoteLabubu.currentAnim = newAnimR;
            }

        let anim = this.localLabubu.sprite.anims.currentAnim?.key;
        //if (!anim) return;

        if (
            (anim.endsWith('down') && this.localLabubu.currentDirection !== 'down') ||
            (anim.endsWith('left') && this.localLabubu.currentDirection !== 'left') ||
            (anim.endsWith('right') && this.localLabubu.currentDirection !== 'right') ||
            (anim.endsWith('up') && this.localLabubu.currentDirection !== 'up')) {

            if (this.localLabubu.currentDirection === 'right' && anim.startsWith('labubu1-')) this.localLabubu.sprite.play('labubu1-right');
            if (this.localLabubu.currentDirection === 'left' && anim.startsWith('labubu1-')) this.localLabubu.sprite.play('labubu1-left');
            if (this.localLabubu.currentDirection === 'down' && anim.startsWith('labubu1-')) this.localLabubu.sprite.play('labubu1-down');
            if (this.localLabubu.currentDirection === 'up' && anim.startsWith('labubu1-')) this.localLabubu.sprite.play('labubu1-up');

            if (this.localLabubu.currentDirection === 'right' && anim.startsWith('labubu2-')) this.localLabubu.sprite.play('labubu2-right');
            if (this.localLabubu.currentDirection === 'left' && anim.startsWith('labubu2-')) this.localLabubu.sprite.play('labubu2-left');
            if (this.localLabubu.currentDirection === 'down' && anim.startsWith('labubu2-')) this.localLabubu.sprite.play('labubu2-down');
            if (this.localLabubu.currentDirection === 'up' && anim.startsWith('labubu2-')) this.localLabubu.sprite.play('labubu2-up');

            if (this.localLabubu.currentDirection === 'right' && anim.startsWith('labubu3-')) this.localLabubu.sprite.play('labubu3-right');
            if (this.localLabubu.currentDirection === 'left' && anim.startsWith('labubu3-')) this.localLabubu.sprite.play('labubu3-left');
            if (this.localLabubu.currentDirection === 'down' && anim.startsWith('labubu3-')) this.localLabubu.sprite.play('labubu3-down');
            if (this.localLabubu.currentDirection === 'up' && anim.startsWith('labubu3-')) this.localLabubu.sprite.play('labubu3-up');

            if (this.localLabubu.currentDirection === 'right' && anim.startsWith('labubu4-')) this.localLabubu.sprite.play('labubu4-right');
            if (this.localLabubu.currentDirection === 'left' && anim.startsWith('labubu4-')) this.localLabubu.sprite.play('labubu4-left');
            if (this.localLabubu.currentDirection === 'down' && anim.startsWith('labubu4-')) this.localLabubu.sprite.play('labubu4-down');
            if (this.localLabubu.currentDirection === 'up' && anim.startsWith('labubu4-')) this.localLabubu.sprite.play('labubu4-up');
        }
        //ANIMACIONES LABUBU REMOTO
        anim = this.remoteLabubu.sprite.anims.currentAnim?.key;
        this.animateRemoteLabubu(anim);
        
        // REDUCIR COOLDOWN
        if (this.localLabubu.cooldown > 0) {
            this.localLabubu.cooldown--;
        }

        if (this.localLabubu.turnCooldown > 0) {
            this.localLabubu.turnCooldown--;
        }
        //APICAR MOVIMIENTO CONSTANTE
        this.handleRailMovement(this.localLabubu);

    }

    //NUEVA FUNCIÓN PARA EL MOVIMIENTO
    handleRailMovement(labubu) {
        if (labubu.isWaitingAtNode) {
            labubu.sprite.setVelocity(0, 0);
            return;
        }

        const body = labubu.sprite.body;
        let mustTurn = false;

        // SOLO comprobar colisiones si NO estamos en nodo
        switch (labubu.currentDirection) {
            case 'up': mustTurn = body.blocked.up; break;
            case 'down': mustTurn = body.blocked.down; break;
            case 'left': mustTurn = body.blocked.left; break;
            case 'right': mustTurn = body.blocked.right; break;
        }

        if (mustTurn) {
            if (labubu.turnMode === "reverse") {
                labubu.currentDirection =
                    this.getTurnDirectionReverse(labubu.currentDirection);
            } else {
                labubu.currentDirection =
                    this.getTurnDirectionNormal(labubu.currentDirection);
            }
        }

        const speed = labubu.baseSpeed;

        switch (labubu.currentDirection) {
            case 'up': labubu.sprite.setVelocity(0, -speed); break;
            case 'down': labubu.sprite.setVelocity(0, speed); break;
            case 'left': labubu.sprite.setVelocity(-speed, 0); break;
            case 'right': labubu.sprite.setVelocity(speed, 0); break;
        }

        //salida del nodo
        if (labubu.exitingNode && labubu.currentNode) {

            const stillOverlapping = this.physics.overlap(
                labubu.centerCollider,
                labubu.currentNode
            );

            if (!stillOverlapping) {
                labubu.exitingNode = false;
                labubu.currentNode = null;
                labubu.isWaitingAtNode = false;
                labubu.lastNode = null;
            }
        }

    }

    snapLabubuToNode(labubu, node) {

        // Parar completamente
        labubu.sprite.setVelocity(0, 0);
        // Colocar EXACTO en el nodo
        labubu.sprite.setPosition(node.x, node.y);
        // Alinear el collider
        labubu.updateCenterCollider();
    }

    shoot(data) {

        let bullet = new Bullet(this, data.x, data.y, data.dir);

        //las balas tienen un poco de offset para que se coloquen bien y no se choquen
        //con los labubus
        switch (data.dir) {
            case 'up':
                bullet.sprite.y -= 50;
                break;
            case 'down':
                bullet.sprite.y += 70;
                break;
            case 'left':
                bullet.sprite.x -= 50;
                bullet.sprite.y += 16;
                break;
            case 'right':
                bullet.sprite.x += 50;
                bullet.sprite.y += 16;
                break;
        }
        this.bullets.push(bullet);

        // COLISIONES LABUBUS
        this.physics.add.overlap(bullet.sprite, this.localLabubu.sprite, () => {
            if (bullet.currentDirection === this.localLabubu.currentDirection) {
                //ACIERTO
                this.localLabubu.score--;
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.sprite.destroy();
                this.scoreUpdate();
                this.sfxhit = this.sound.add('aciertoSonido', {
                    loop: false,
                    volume: 1
                });
                this.sfxhit.play();
            }
            else {
                //FALLO
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.sprite.destroy();
                this.sfxcolision.play();
            }
        });
        this.physics.add.overlap(bullet.sprite, this.remoteLabubu.sprite, () => {
            if (bullet.currentDirection === this.remoteLabubu.currentDirection) {
                //ACIERTO
                this.remoteLabubu.score--;
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.sprite.destroy();
                this.scoreUpdate();
                this.sfxhit = this.sound.add('aciertoSonido', {
                    loop: false,
                    volume: 1
                });
                this.sfxhit.play();
            }
            else {
                //FALLO
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.sprite.destroy();
                this.sfxcolision.play();
            }
        });

        // COLISIONES MUNDO
        this.physics.add.overlap(bullet.sprite, this.rightWall, () => {
            this.bullets = this.bullets.filter(b => b !== bullet);
            bullet.sprite.destroy();
        });
        this.physics.add.overlap(bullet.sprite, this.leftWall, () => {
            this.bullets = this.bullets.filter(b => b !== bullet);
            bullet.sprite.destroy();
        });
        this.physics.add.overlap(bullet.sprite, this.topWall, () => {
            this.bullets = this.bullets.filter(b => b !== bullet);
            bullet.sprite.destroy();
        });
        this.physics.add.overlap(bullet.sprite, this.bottomWall, () => {
            this.bullets = this.bullets.filter(b => b !== bullet);
            bullet.sprite.destroy();
        });
        this.physics.add.overlap(bullet.sprite, this.walls, () => {
            this.bullets = this.bullets.filter(b => b !== bullet);
            bullet.sprite.destroy();
        });
    }
}

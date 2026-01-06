import Phaser from 'phaser';
import { Labubu } from '../entities/Labubu';
import { Bullet } from '../entities/Bullet';
import { RailNode } from '../entities/RailNode';
import { CommandProcessor } from '../commands/CommandProcessor';
import { PauseGameCommand } from '../commands/PuaseGameCommand';
import { PowerupSpeed } from '../entities/PowerupSpeed';
import { PowerupTurn } from '../entities/PowerupTurn';
import { PowerupHealth } from '../entities/PowerupHealth';
import { connectionManager } from '../services/ConnectionManager';
collider1: Phaser.Physics.Arcade.Image;
nodes: Phaser.Physics.Arcade.StaticGroup;

//borrame

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
        //cuadrados de 64pxls
        //ancho 704 pxls
        //alto 576 pxls
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();
        this.bullets = [];
        this.gameEnded = false;
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

        /*let wall1 = this.walls.create(192, 190, 'colliderCuadrado');
        wall1.body.setSize(128, 136);
        wall1.setVisible(true);
        wall1.refreshBody();

        let wall2 = this.walls.create(512, 380, 'colliderCuadrado');
        wall2.body.setSize(128, 136);
        wall2.setVisible(true);
        wall2.refreshBody();

        let wall3 = this.walls.create(256, 380, 'colliderRectangulo');
        wall3.body.setSize(256, 136);
        wall3.setVisible(true);
        wall3.refreshBody();

        let wall4 = this.walls.create(448, 188, 'colliderRectangulo');
        wall4.body.setSize(256, 136);
        wall4.setVisible(true);
        wall4.refreshBody();*/

        //grupo para los powerups creados en spawnPowerup()
        this.powerups = this.physics.add.group();

        this.setUpPlayers();

        this.players.forEach((player) => {

            //COLLIDERS CON LOS OBJETOS DEL ESCENARIO
            //this.physics.add.collider(player.sprite, this.walls);

            //COLLIDERS CON LÍMITES DE PAREDES
            this.physics.add.collider(player.sprite, this.leftWall);
            this.physics.add.collider(player.sprite, this.rightWall);
            this.physics.add.collider(player.sprite, this.topWall);
            this.physics.add.collider(player.sprite, this.bottomWall);

            //COLLIDERS NODOS
            this.physics.add.overlap(player.sprite, this.nodes, (spr, node) => {
                player.canTurn = true;
            }, null, this);

            //COLLIDERS CON POWERUPS
            this.physics.add.overlap(player.sprite, this.powerups, this.collectPowerup, null, this);
        });


        this.time.addEvent({
            delay: 8000,
            callback: () => {
                this.spawnPowerup();
            },
            loop: true
        });


        //COLLIDER CHOQUE JUGADORES
        this.physics.add.overlap(this.players.get('player1').sprite, this.players.get('player2').sprite, () => {
            if (this.players.get('player1').turnMode !== this.players.get('player2').turnMode) {
                this.players.get('player1').lastNode = null;
                this.players.get('player2').lastNode = null;
                this.players.forEach((player) => {
                    switch (player.currentDirection) {
                        case 'down':
                            player.currentDirection = 'up';
                            player.turnCooldown = 10;
                            player.alternateTurnmode();
                            break;
                        case 'up':
                            player.currentDirection = 'down';
                            player.turnCooldown = 10;
                            player.alternateTurnmode();
                            break;
                        case 'left':
                            player.currentDirection = 'right';
                            player.turnCooldown = 10;
                            player.alternateTurnmode();
                            break;
                        case 'right':
                            player.currentDirection = 'left';
                            player.turnCooldown = 10;
                            player.alternateTurnmode();
                            break;
                    }
                });
                this.sfxcolision.play();
            } else if (this.players.get('player1').isWaitingAtNode) {
                const player2 = this.players.get('player2');

                switch (player2.currentDirection) {
                    case 'down':
                        player2.currentDirection = 'up';
                        break;
                    case 'up':
                        player2.currentDirection = 'down';
                        break;
                    case 'left':
                        player2.currentDirection = 'right';
                        break;
                    case 'right':
                        player2.currentDirection = 'left';
                        break;
                }
                this.players.get('player2').lastNode = null;
                player2.turnCooldown = 10;
                player2.alternateTurnmode();
                this.sfxcolision.play();
                
            } else if (this.players.get('player2').isWaitingAtNode) {
                const player1 = this.players.get('player1');

                switch (player1.currentDirection) {
                    case 'down':
                        player1.currentDirection = 'up';
                        break;
                    case 'up':
                        player1.currentDirection = 'down';
                        break;
                    case 'left':
                        player1.currentDirection = 'right';
                        break;
                    case 'right':
                        player1.currentDirection = 'left';
                        break;
                }
                this.players.get('player1').lastNode = null;
                player1.turnCooldown = 10;
                player1.alternateTurnmode();
                this.sfxcolision.play();
            }
        });

        this.spawnPowerup();

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //////////////NUEVO///////////////////////////////////////////////////////////////////////
        this.connectionListener = (data) => {
            if (!data.connected && this.scene.isActive()) {
                this.onConnectionLost();
            }
        };
        connectionManager.addListener(this.connectionListener);
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
    ///////////////////////////////////////////////////////////////////

    setUpPlayers() {

        console.log(parseInt(localStorage.getItem("skin"), 10));



        let jugadorUno = new Labubu(this, 'player1', 96, 220, 'labubu1-down');
        let jugadorDos = new Labubu(this, 'player2', 608, 220, 'labubu2-down');

        this.jugadorTexto = this.add.text(jugadorUno.sprite.x, jugadorUno.sprite.y - jugadorUno.sprite.height / 1.65, ' ' + localStorage.getItem("username") + ' ', {
            fontSize: '14px',
            fontFamily: 'Lemon',
            backgroundColor: '#2525257b',
            color: '#ffffff'
        }).setOrigin();

        switch (parseInt(localStorage.getItem("skin"), 10)) {
            case 0:
                jugadorUno.animKey = 'labubu1-down';
                jugadorDos.animKey = 'labubu2-down';
                break;

            case 1:
                jugadorUno.animKey = 'labubu2-down';
                jugadorDos.animKey = 'labubu1-down';
                break;

            case 2:
                jugadorUno.animKey = 'labubu3-down';
                jugadorDos.animKey = 'labubu4-down';
                break;

            case 3:
                jugadorUno.animKey = 'labubu4-down';
                jugadorDos.animKey = 'labubu3-down';
                break;
        }


        //Empiezan con 1 vida cada uno para testear (luego lo cambio)
        jugadorUno.score = 3;
        jugadorDos.score = 3;

        this.players.set('player1', jugadorUno);
        this.players.set('player2', jugadorDos);
        this.players.get('player1').turnMode = "reverse";
        this.players.get('player2').turnMode = "normal"
        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D',
                shootKey: 'SHIFT'
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                shootKey: 'ENTER'
            }
        ]
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                shootKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.shootKey]),
            }
        });
    }

    spawnPowerup() {

        let type = Math.ceil(Math.random() * 3)
        //let type = 2    //testear el cambio de direccion
        let p;

        switch (type) {
            case 1:
                p = new PowerupSpeed(this, 'powerupSpeed');
                p.sprite.play('powerupSpeed');
                break;
            case 2:
                p = new PowerupTurn(this, 'powerupTurn');
                p.sprite.play('powerupTurn');
                break;
            case 3:
                p = new PowerupHealth(this, 'powerupHealth');
                p.sprite.play('powerupHealth');
                break;
        }
        this.sfxspawn = this.sound.add('spawn', {
            loop: false,
            volume: 1
        });
        this.sfxspawn.play();
    }

    scoreUpdate() {
        // Si el juego ya terminó, no actualizamos nada más
        if (this.gameEnded) return;

        const player1 = this.players.get('player1');
        const player2 = this.players.get('player2');

        this.scoreLeft.setText(player1.score.toString());
        this.rightScore.setText(player2.score.toString());

        if (player1.score <= 0) {
            this.endGame('player2'); // Gana el 2 porque el 1 murió
        }
        else if (player2.score <= 0) {
            this.endGame('player1'); // Gana el 1 porque el 2 murió
        }
    }

    collectPowerup(player, powerup) {

        console.debug(this.players.get('player2').playerInstance)

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
            /*switch (player.playerInstance.currentDirection) {
                case 'down':
                    player.playerInstance.currentDirection = 'up';
                    player.playerInstance.turnCooldown = 50;
                    player.playerInstance.alternateTurnmode();
                    break;
                case 'up':
                    player.playerInstance.currentDirection = 'down';
                    player.playerInstance.turnCooldown = 50;
                    player.playerInstance.alternateTurnmode();
                    break;
                case 'left':
                    player.playerInstance.currentDirection = 'right';
                    player.playerInstance.turnCooldown = 50;
                    player.playerInstance.alternateTurnmode();
                    break;
                case 'right':
                    player.playerInstance.currentDirection = 'left';
                    player.playerInstance.turnCooldown = 50;
                    player.playerInstance.alternateTurnmode();
                    break;
            }*/
            player.playerInstance.score--;
            this.scoreUpdate();


        } else {
            player.playerInstance.score++;
            this.scoreUpdate();
        }


        powerup.destroy();

    }

    endGame(winnerId) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        // Congelar físicas (balas y jugadores quietos)
        this.physics.pause();

        // Pausar la escena actual por completo (para que deje de procesar inputs o update)
        this.scene.pause();

        // Lanzar la escena de Victoria ENCIMA de esta (Overlay)
        // Pasamos el ID del ganador
        this.scene.launch('VictoryScene', { winnerId: winnerId });
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

    updateAnim(player) {



    }

    update() {

        this.inputMappings.forEach(mapping => {

            const labubu = this.players.get(mapping.playerId);
            let newAnim = labubu.animKey;
            //REPRODUCIR ANIMACIÓN SOLO SI CAMBIA
            if (newAnim && labubu.currentAnim !== newAnim) {
                labubu.sprite.play(newAnim, true);
                labubu.currentAnim = newAnim;
            }

        });

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



        //LABUBUS
        this.players.forEach(labubu => {

            const speed = labubu.baseSpeed;
            const body = labubu.sprite.body;
            let newDirection = labubu.currentDirection;

            labubu.updateCenterCollider();

            //DETECTAR SI ESTÁ SOBRE UN NODO
            this.physics.overlap(labubu.centerCollider, this.nodes, (spr, node) => {
                if (labubu.isWaitingAtNode) return;
                if (labubu.lastNode === node) return;

                if (Phaser.Math.Distance.Between(labubu.centerCollider.x, labubu.centerCollider.y, node['x'], node['y']) > 18) {
                    return;
                }

                labubu.lastNode = node;
                labubu.isWaitingAtNode = true;

                // Guardar direcciones válidas (FUNCIONA)
                labubu.allowedTurns = node['allowedTurns'].map(e => e.direction);
                labubu.nodeRules = node['allowedTurns'];
                //parar en seco
                labubu.sprite.setVelocity(0, 0);
                this.snapLabubuToNode(labubu, node);
            });

            // USERNAME

            this.jugadorTexto.x = this.players.get('player1').sprite.x;
            this.jugadorTexto.y = this.players.get('player1').sprite.y - this.players.get('player1').sprite.height / 1.65;

            //INPUT
            const mapping = this.inputMappings.find(m => m.playerId === labubu.id);
            let inputDir = null;

            if (mapping) {
                if (mapping.upKeyObj.isDown) inputDir = 'up';
                else if (mapping.downKeyObj.isDown) inputDir = 'down';
                else if (mapping.leftKeyObj.isDown) inputDir = 'left';
                else if (mapping.rightKeyObj.isDown) inputDir = 'right';

                //disparo
                if (mapping.shootKeyObj.isDown && labubu.cooldown === 0) {
                    this.shoot(labubu.currentDirection, labubu.sprite.x, labubu.sprite.y);
                    labubu.cooldown = 300;
                    this.sfxshot = this.sound.add('disparoSonido', {
                        loop: false,
                        volume: 1
                    });
                    this.sfxshot.play();
                }
            }

            if (labubu.isWaitingAtNode && inputDir && labubu.allowedTurns.includes(inputDir)) {

                console.log("GIRANDO A " + inputDir);
                // aceptar dirección
                labubu.currentDirection = inputDir;

                // Buscar la regla correspondiente en el array
                const rule = labubu.nodeRules.find(e => e.direction === inputDir);
                if (rule) {
                    labubu.turnMode = rule.turnMode;
                }
                labubu.isWaitingAtNode = false;

                labubu.exitingNode = true;
                console.log(labubu.turnMode);

            }



            //ANIMACIONES
            let anim = labubu.sprite.anims.currentAnim?.key;

            if (
                (anim.endsWith('down') && labubu.currentDirection !== 'down') ||
                (anim.endsWith('left') && labubu.currentDirection !== 'left') ||
                (anim.endsWith('right') && labubu.currentDirection !== 'right') ||
                (anim.endsWith('up') && labubu.currentDirection !== 'up')) {

                if (labubu.currentDirection === 'right' && anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-right');
                if (labubu.currentDirection === 'left' && anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-left');
                if (labubu.currentDirection === 'down' && anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-down');
                if (labubu.currentDirection === 'up' && anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-up');

                if (labubu.currentDirection === 'right' && anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-right');
                if (labubu.currentDirection === 'left' && anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-left');
                if (labubu.currentDirection === 'down' && anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-down');
                if (labubu.currentDirection === 'up' && anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-up');

                if (labubu.currentDirection === 'right' && anim.startsWith('labubu3-')) labubu.sprite.play('labubu3-right');
                if (labubu.currentDirection === 'left' && anim.startsWith('labubu3-')) labubu.sprite.play('labubu3-left');
                if (labubu.currentDirection === 'down' && anim.startsWith('labubu3-')) labubu.sprite.play('labubu3-down');
                if (labubu.currentDirection === 'up' && anim.startsWith('labubu3-')) labubu.sprite.play('labubu3-up');

                if (labubu.currentDirection === 'right' && anim.startsWith('labubu4-')) labubu.sprite.play('labubu4-right');
                if (labubu.currentDirection === 'left' && anim.startsWith('labubu4-')) labubu.sprite.play('labubu4-left');
                if (labubu.currentDirection === 'down' && anim.startsWith('labubu4-')) labubu.sprite.play('labubu4-down');
                if (labubu.currentDirection === 'up' && anim.startsWith('labubu4-')) labubu.sprite.play('labubu4-up');


            }


            // REDUCIR COOLDOWN
            if (labubu.cooldown > 0) {
                labubu.cooldown--;
            }

            if (labubu.turnCooldown > 0) {
                labubu.turnCooldown--;
            }
            //APICAR MOVIMIENTO CONSTANTE
            this.handleRailMovement(labubu);

        }
        );

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


    setRailNodes() {
        this.nodes = this.add.group(); // sin classType

        //nodo superior
        this.nodes.add(new RailNode(this, 289, 82.5, [
            { direction: "down", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
            { direction: "down", turnMode: "normal" }], 0));

        //nodo central derecho
        this.nodes.add(new RailNode(this, 288.5, 268.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
            { direction: "left", turnMode: "normal" }], 1));

        //nodo central izquierdo
        this.nodes.add(new RailNode(this, 416.5, 268.5, [
            { direction: "down", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "right", turnMode: "normal" },
        ], 1));
        //nodo izquierdo
        this.nodes.add(new RailNode(this, 608.5, 268.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "left", turnMode: "reverse" },
            { direction: "down", turnMode: "normal" },
        ], 2));
        //nodo derecho
        this.nodes.add(new RailNode(this, 98.5, 268.5, [
            { direction: "up", turnMode: "normal" },
            { direction: "right", turnMode: "normal" },
            { direction: "down", turnMode: "reverse" },
        ], 2));


        //nodo abajo del todo
        this.nodes.add(new RailNode(this, 416.5, 460.5, [
            { direction: "up", turnMode: "reverse" },
            { direction: "left", turnMode: "normal" },
            { direction: "right", turnMode: "reverse" },
        ], 3));

    }
    snapLabubuToNode(labubu, node) {

        // Parar completamente
        labubu.sprite.setVelocity(0, 0);
        // Colocar EXACTO en el nodo
        labubu.sprite.setPosition(node.x, node.y);
        // Alinear el collider
        labubu.updateCenterCollider();
    }

    shoot(dir, x, y) {

        let bullet = new Bullet(this, x, y, dir);

        //las balas tienen un poco de offset para que se coloquen bien y no se choquen
        //con los labubus
        switch (dir) {
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
        this.players.forEach(labubu => {
            this.physics.add.overlap(bullet.sprite, labubu.sprite, () => {
                if (bullet.currentDirection === labubu.currentDirection) {
                    //ACIERTO
                    labubu.score--;
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
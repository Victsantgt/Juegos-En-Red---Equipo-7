import Phaser from 'phaser';
import { Labubu } from '../entities/Labubu';
import { Bullet } from '../entities/Bullet';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MovePaddleCommand } from '../commands/MovePaddleCommand';
import { PauseGameCommand } from '../commands/PuaseGameCommand';
collider1: Phaser.Physics.Arcade.Image;
nodes: Phaser.Physics.Arcade.StaticGroup;

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
        //this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
        this.processor = new CommandProcessor();
        this.bullets = [];
    }

    preload() {

        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('colliderCuadrado', 'assets/colliderCuadrado.png');
        this.load.image('colliderRectangulo', 'assets/colliderRectangulo.png');
        this.load.image('tapioca', 'assets/tapioca.png');

        //SPRITES//
        this.load.spritesheet('labubu', 'assets/brownanim/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });
        this.load.spritesheet('labubu2', 'assets/yellow/down.png', {
            frameWidth: 68,
            frameHeight: 88
        });

    }

    create() {

        let fondo = this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        ////ANIMACIÓN ABAJO JUGADOR 1////
        this.anims.create({
            key: 'labubu1-down',
            frames: this.anims.generateFrameNumbers('labubu', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //ANIMACIÓN ABAJO JUGADOR 2//
        this.anims.create({
            key: 'labubu2-down',
            frames: this.anims.generateFrameNumbers('labubu2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // puntuaciones
        //j1 arriba izquierda
        this.scoreLeft = this.add.text(17, 10, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        //j2 arriba derecha
        this.rightScore = this.add.text(657, 10, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        this.createBounds();
        this.createRailNodes();

        // this.createBall();
        //this.launchBall();

        // this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        // this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        // ---------- PAREDES DEL ESCENARIO ----------
        this.walls = this.physics.add.staticGroup();

        let wall1 = this.walls.create(192, 190, 'colliderCuadrado');
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
        wall4.refreshBody();


        this.setUpPlayers();

        this.players.forEach((player) => {

            //COLLIDERS CON LOS OBJETOS DEL ESCENARIO
            this.physics.add.collider(player.sprite, this.walls);

            //COLLIDERS CON LÍMITES DE PAREDES
            this.physics.add.collider(player.sprite, this.leftWall);
            this.physics.add.collider(player.sprite, this.rightWall);
            this.physics.add.collider(player.sprite, this.topWall);
            this.physics.add.collider(player.sprite, this.bottomWall);

            //COLLIDERS NODOS
            this.physics.add.overlap(player.sprite, this.nodes, (spr, node) => {
                player.canTurn = true;
            }, null, this);
        });

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const jugadorUno = new Labubu(this, 'player1', 96, 288, 'labubu1-down');
        const jugadorDos = new Labubu(this, 'player2', 608, 288, 'labubu2-down');

        this.players.set('player1', jugadorUno);
        this.players.set('player2', jugadorDos);
        this.players.get('player1').turnMode = "reverse";
        this.players.get('player2').turnMode = "normal";


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

    /*scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score += 1;
        this.scoreLeft.setText(player1.score.toString());

        if (player1.score >= 2) {
            this.endGame('player1');
        } else {
            // this.resetBall();
        }
    }

    scoreRightGoal() {
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.rightScore.setText(player2.score.toString());

        if (player2.score >= 2) {
            this.endGame('player2');
        } else {
            // this.resetBall();
        }
    }
        */

    endGame(winnerId) {
        // this.ball.setVelocity(0, 0);
        this.players.forEach(paddle => {
            paddle.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        const winnerText = winnerId === 'player1' ? 'Player 1 Wins!' : 'Player 2 Wins!';
        this.add.text(400, 250, winnerText, {
            fontSize: '64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(400, 350, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setColor('#cccccc'))
            .on('pointerout', () => menuBtn.setColor('#ffffff'))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
    }

    /*
    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
    
        this.time.delayedCall(1000, () => {
            //this.launchBall();
        });
    }

    //podríamos reutilizar esto para hacer que los jugadores empiecen
    con una velocidad constante, osea lo q queremos lol, y que uno
    tire para arriba y otro hacia abajo, pa q empiecen distinto

    //la idea es que si llega a x pixel gire automaticamente para el
    lado que toque y si detecta intersección que permita girar a donde
    se pueda
    
    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 300;
        const direction = Math.random() < 0.5 ? 1 : -1;

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }
        */
    /*
        createBall() {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(8, 8, 8);
            graphics.generateTexture('ball', 16, 16);
            graphics.destroy();
    
            this.ball = this.physics.add.sprite(400, 300, 'ball');
            this.ball.setCollideWorldBounds(true);
            this.ball.setBounce(1);
        }
            */

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

    update() {

       if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }/*


        this.inputMappings.forEach(mapping => {

            const labubu = this.players.get(mapping.playerId);
            let newAnim = labubu.animKey;

            
            //Resetea la velocidad antes de aplicar movimiento
            labubu.sprite.setVelocity(0,16);

            //Movimiento en las cuatro direciones
            if (mapping.upKeyObj.isDown) {
                labubu.sprite.setVelocityY(-labubu.baseSpeed);
                newAnim = 'labubu-down';

            } else if (mapping.downKeyObj.isDown) {
                labubu.sprite.setVelocityY(labubu.baseSpeed);
                newAnim = 'labubu-down';
            }
            if (mapping.leftKeyObj.isDown) {
                labubu.sprite.setVelocityX(-labubu.baseSpeed);
                newAnim = 'labubu-down';
            } else if (mapping.rightKeyObj.isDown) {
                labubu.sprite.setVelocityX(labubu.baseSpeed);
                newAnim = 'labubu-down';
            }

            //REPRODUCIR ANIMACIÓN SOLO SI CAMBIA
            if (newAnim && labubu.currentAnim !== newAnim) {
                labubu.sprite.play(newAnim, true);
                labubu.currentAnim = newAnim;
            }

        });

         if (this.escKey.isDown && !this.escWasDown) {
        this.togglePause();
    }*/

        this.bullets.forEach(bullet =>{
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

        this.players.forEach(labubu => {
            const speed = labubu.baseSpeed;
            const body = labubu.sprite.body;

            let newDirection = labubu.currentDirection;

            // ---------- INPUT ----------
            const mapping = this.inputMappings.find(m => m.playerId === labubu.id);
            let inputDir = null;
            if (mapping) {
                if (mapping.upKeyObj.isDown) inputDir = 'up';
                else if (mapping.downKeyObj.isDown) inputDir = 'down';
                else if (mapping.leftKeyObj.isDown) inputDir = 'left';
                else if (mapping.rightKeyObj.isDown) inputDir = 'right';

                else if (mapping.shootKeyObj.isDown && labubu.cooldown === 0) {
                    this.shoot(labubu.currentDirection, labubu.sprite.x, labubu.sprite.y);
                    labubu.cooldown = 300;
                }
            }

            // ---------- GIRO POR INPUT ----------
            if (inputDir && !body.blocked[inputDir]) {
                newDirection = inputDir;
            }

            // ---------- GIRO AUTOMÁTICO (SEGÚN MODO DEL LABUBU) ----------
            if (body.blocked.up || body.blocked.down || body.blocked.left || body.blocked.right) {

                if (labubu.turnMode === "normal") {
                    newDirection = this.getTurnDirectionNormal(labubu.currentDirection);
                } else if (labubu.turnMode === "reverse") {
                    newDirection = this.getTurnDirectionReverse(labubu.currentDirection);
                }
            }
            // ---------- APLICAR MOVIMIENTO ----------
            labubu.currentDirection = newDirection;
            switch (labubu.currentDirection) {
                case 'up': labubu.sprite.setVelocity(0, -speed); break;
                case 'down': labubu.sprite.setVelocity(0, speed); break;
                case 'left': labubu.sprite.setVelocity(-speed, 0); break;
                case 'right': labubu.sprite.setVelocity(speed, 0); break;
            }
            // ---------- REDUCIR COOLDOWN ----------
            if(labubu.cooldown > 0) {
                labubu.cooldown--;
            }

        });

    }
    createRailNodes() {
        this.nodes = this.physics.add.staticGroup();

        const nodePositions = [
            //{ x: 287, y: 95 },
            //{ x: 100, y: 100 },
            // { x: 100, y: 470 },
            // { x: 192, y: 128 },
            // { x: 192, y: 192 },

        ];

        nodePositions.forEach(p => {
            /*let n = this.nodes.create(p.x, p.y, null);
            n.setDisplaySize(74, 74).setVisible(true);
            n.refreshBody();*/
            const node = this.nodes.create(p.x, p.y, 'colliderCuadrado'); // textura real
            node.setDisplaySize(64, 64);
            node.setVisible(true); // invisible en juego
            node.refreshBody();
        });

        function tryTurn(labubu) {

            const speed = labubu.baseSpeed;

            switch (labubu.nextDirection) {
                case 'up':
                    labubu.sprite.setVelocity(0, -speed);
                    labubu.currentDirection = 'up';
                    break;
                case 'down':
                    labubu.sprite.setVelocity(0, speed);
                    labubu.currentDirection = 'down';
                    break;
                case 'left':
                    labubu.sprite.setVelocity(-speed, 0);
                    labubu.currentDirection = 'left';
                    break;
                case 'right':
                    labubu.sprite.setVelocity(speed, 0);
                    labubu.currentDirection = 'right';
                    break;
            }
        }
    }
    shoot(dir, x, y) {

        let bullet = new Bullet(this, x, y, dir);

        switch (dir) {
            case 'up':
                bullet.sprite.y -= 40;
                break;
            case 'down':
                bullet.sprite.y += 40;
                break;
            case 'left':
                bullet.sprite.x -= 40;
                bullet.sprite.y += 16;
                break;
            case 'right':
                bullet.sprite.x += 40;
                bullet.sprite.y += 16;
                break;
        }
        this.bullets.push(bullet);
        this.physics.add.overlap(bullet.sprite, this.walls, () => console.log('a'));
        this.physics.add.overlap(bullet.sprite, this.leftWall, () => console.log('a'));
        this.physics.add.overlap(bullet.sprite, this.rightWall, () => console.log('a'));
        this.physics.add.overlap(bullet.sprite, this.topWall, () => console.log('a'));
        this.physics.add.overlap(bullet.sprite, this.bottomWall, () => console.log('a'));
    }
}
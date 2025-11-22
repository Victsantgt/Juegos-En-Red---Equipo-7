import Phaser from 'phaser';
import { Labubu } from '../entities/Labubu';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MovePaddleCommand } from '../commands/MovePaddleCommand';
import { PauseGameCommand } from '../commands/PuaseGameCommand';

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
    }

    preload() {

        this.load.image('fondo', 'assets/fondo.png');

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
        // this.createBall();
        //this.launchBall();

        // this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        // this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        //LOS COLLIDERS
        let collider1 = this.physics.add.image(400, 500, 'suelo');
        collider1.setImmovable(true);  // No se mueve al impacto
        this.setUpPlayers();
        this.players.forEach(paddle => {
            //this.physics.add.collider(this.ball, paddle.sprite);
        });

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const jugadorUno = new Labubu(this, 'player1', 96, 288,'labubu1-down');
        const jugadorDos = new Labubu(this, 'player2', 608, 288, 'labubu2-down');

        this.players.set('player1', jugadorUno);
        this.players.set('player2', jugadorDos);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D'
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT'
            }
        ]
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });
    }

    scoreLeftGoal() {
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
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(700, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(true);
        this.rightGoal.setVisible(false);
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

    update() {

        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }


        this.inputMappings.forEach(mapping => {

            const labubu = this.players.get(mapping.playerId);
             let newAnim = labubu.animKey;

            //Resetea la velocidad antes de aplicar movimiento
            labubu.sprite.setVelocity(0);

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

    }
}
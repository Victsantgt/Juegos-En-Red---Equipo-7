import Phaser from 'phaser';
import { Paddle } from '../entities/Paddle';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
    }

    preload(){

      this.load.image('fondo', '../public/assets/prueba.png');
      
    }
    create() {
        
        let fondo = this.add.sprite(400, 300, 'fondo').setOrigin(0, 0);
        //this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

        // Center discontinued line
        for (let i = 0; i < 12; i++) {
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0x444444);
        }
    
        // Score texts
        this.scoreLeft = this.add.text(100, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        this.rightScore = this.add.text(700, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        this.createBounds();
        this.createBall();
        this.launchBall();

        this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        this.setUpPlayers();
        this.players.forEach(paddle => {
            this.physics.add.collider(this.ball, paddle.sprite);
        });
    }

    setUpPlayers() {
        const leftPaddle = new Paddle(this, 'player1', 50, 300);
        const rightPaddle = new Paddle(this, 'player2', 750, 300); 

        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey : 'W',
                downKey : 'S',
            },
            {
                playerId: 'player2',
                upKey : 'UP',
                downKey : 'DOWN',
            }
        ]
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
            }
        });
    }

    scoreLeftGoal() {
        console.log("Left Goal Scored");
        this.resetBall();
    }

    scoreRightGoal() {
        console.log("Right Goal Scored");
        this.resetBall();
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
    
        this.time.delayedCall(1000, () => {
            this.launchBall();
        });
    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 300;
        const direction = Math.random() < 0.5 ? 1 : -1;

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }

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

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(true);
        this.rightGoal.setVisible(false);
    }

    update() {
        this.inputMappings.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            if (mapping.upKeyObj.isDown) {
                paddle.sprite.setVelocityY(-paddle.baseSpeed);
            } else if (mapping.downKeyObj.isDown) {
                paddle.sprite.setVelocityY(paddle.baseSpeed);
            } else {
                paddle.sprite.setVelocityY(0);
            }
        });
    }
}
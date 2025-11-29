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
        this.load.spritesheet('powerupSpeed','assets/chocolate/chocolateSpeed.png',{
            frameWidth: 48,
            frameHeight: 48
        });
        
        this.load.spritesheet('powerupTurn','assets/chocolate/chocolateTurn.png',{
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('powerupHealth','assets/chocolate/chocolateHealth.png',{
            frameWidth: 48,
            frameHeight: 48
        });
        
    }

    create() {
        // FADE IN
        this.cameras.main.fadeIn(1000, 255, 255, 255);

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

        //ANIMACIÓN POWERUP HEALTH
        this.anims.create({
            key: 'powerupHealth',
            frames: this.anims.generateFrameNumbers('powerupHealth', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        //ANIMACIÓN POWERUP SPEED
        this.anims.create({
            key:'powerupSpeed',
            frames: this.anims.generateFrameNumbers('powerupSpeed',{start:0,end:3}),
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

        this.createBounds();
        this.setRailNodes();


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

        //grupo para los powerups creados en spawnPowerup()
        this.powerups = this.physics.add.group();

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

            //COLLIDERS CON POWERUPS
            this.physics.add.overlap(player.sprite,this.powerups,this.collectPowerup,null,this);
        });

        /*
        //COLLIDER CHOQUE JUGADORES
        this.physics.add.overlap(this.players.get('player1').sprite, this.players.get('player2').sprite, () => {
                if (this.players.get('player1').turnMode !== this.players.get('player2').turnMode) {
                    this.players.forEach((player) => {
                        switch(player.currentDirection){
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
                }
            });
            */


        this.spawnPowerup();

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const jugadorUno = new Labubu(this, 'player1', 96, 288, 'labubu1-down');
        const jugadorDos = new Labubu(this, 'player2', 608, 288, 'labubu2-down');
        //const powerupprueba = new PowerupSpeed(this, 300, 400, 'powerupSpeed');

        //Empiezan con 3 vidas cada uno
        jugadorUno.score = 3;
        jugadorDos.score = 3;

        this.players.set('player1', jugadorUno);
        this.players.set('player2', jugadorDos);
        this.players.get('player1').turnMode = "reverse";
        this.players.get('player2').turnMode = "normal";

        //this.players.get('player2').currentDirection = "up";

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

    spawnPowerup(){
        
        let type = Math.ceil(Math.random()*3)
        //let type = 2
        let p;
        
        switch(type){
            case 1:
                p = new PowerupSpeed(this,'powerupSpeed');
                p.sprite.play('powerupSpeed');
                break;
            case 2:
                p = new PowerupTurn(this,'powerupTurn');
                p.sprite.play('powerupTurn');
                break;
            case 3:
                p = new PowerupHealth(this,'powerupHealth');
                p.sprite.play('powerupHealth');
                break;
        }    
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

    collectPowerup(player, powerup){
        
        let speedmult = 1.4;        
        if(powerup.poweruptype=='Speed'){
        
          player.playerInstance.baseSpeed *=speedmult;
          player.playerInstance.scene.time.delayedCall(5000, () => {
          player.playerInstance.baseSpeed /= speedmult;  
          });     

        }else if(powerup.poweruptype == 'Turn'){        
        switch(player.playerInstance.currentDirection){
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
        }       

        }else {
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

    update() {

        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }



        /* 


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
            let currentRailx = 0;
            let currentRaily = 0;

            let newDirection = labubu.currentDirection;

            // --- reset de flags por frame ---
            labubu.canTurn = false;
            labubu.allowedTurns = labubu.allowedTurns || [];

            labubu.updateCenterCollider();
            //console.log("LABUBU : " + labubu.centerCollider.y);


            // --- detectar si está sobre un nodo ---
            this.physics.overlap(labubu.centerCollider, this.nodes, (spr, node) => {
                if(Phaser.Math.Distance.Between(labubu.centerCollider.x, labubu.centerCollider.y, node['x'], node['y']) > 18){
                    return;
                }        
                labubu.canTurn = true;
                
                currentRailx = node['x'];
                currentRaily = node['y'];
                // Usar node['allowedTurns'] en vez de node.allowedTurns

                labubu.allowedTurns = node['allowedTurns'] || [];
            });

            // ---------- INPUT ----------
            const mapping = this.inputMappings.find(m => m.playerId === labubu.id);
            let inputDir = null;

            if (mapping) {
                if (mapping.upKeyObj.isDown) inputDir = 'up';
                else if (mapping.downKeyObj.isDown) inputDir = 'down';
                else if (mapping.leftKeyObj.isDown) inputDir = 'left';
                else if (mapping.rightKeyObj.isDown) inputDir = 'right';

                // --- disparo ---
                if (mapping.shootKeyObj.isDown && labubu.cooldown === 0) {
                    this.shoot(labubu.currentDirection, labubu.sprite.x, labubu.sprite.y);
                    labubu.cooldown = 300;
                }
            }

            // ---------- GIRO POR INPUT SOLO EN NODO ----------
            if (inputDir && labubu.canTurn && !labubu.blockMove && labubu.turnCooldown === 0) {


                // Verifica si la dirección que quiere el jugador está permitida por el nodo
                if (labubu.allowedTurns.includes(inputDir) && !body.blocked[inputDir]) {
                    // Giro permitido → actualizar dirección
                    newDirection = inputDir;
                    labubu.canTurn = false; // evita múltiples giros en el mismo nodo
                    // labubu.sprite.setPosition(currentRailx, currentRaily);
                    this.tweens.add({
                        targets: labubu.sprite,
                        x: currentRailx,
                        //y: currentRaily,
                        duration:600,
                        ease: 'Sine',
                        onComplete: () => { 
                            labubu.blockMove = false} 
                    });
                    labubu.turnCooldown = 50;


                } else {
                    // Giro no permitido → mantener la dirección anterior
                    newDirection = labubu.currentDirection;
                }
            }

            // ---------- GIRO AUTOMÁTICO ----------
            if(labubu.turnCooldown === 0) {
                    if (body.blocked.up || body.blocked.down || body.blocked.left || body.blocked.right) {
                    if (labubu.turnMode === "normal") {
                        newDirection = this.getTurnDirectionNormal(labubu.currentDirection);
                        labubu.turnCooldown = 50;
                    } else if (labubu.turnMode === "reverse") {
                        newDirection = this.getTurnDirectionReverse(labubu.currentDirection);
                        labubu.turnCooldown = 50;
                    }
                }
            }
            

            // ---------- APLICAR MOVIMIENTO ----------

            if(!labubu.blockMove){

            labubu.currentDirection = newDirection;

            switch (labubu.currentDirection) {
                case 'up': labubu.sprite.setVelocity(0, -speed); break;
                case 'down': labubu.sprite.setVelocity(0, speed); break;
                case 'left': labubu.sprite.setVelocity(-speed, 0); break;
                case 'right': labubu.sprite.setVelocity(speed, 0); break;
            }

            }
            else{
                labubu.sprite.setVelocity(0, 0);
            }

            // ---------- REDUCIR COOLDOWN ----------
            if (labubu.cooldown > 0) {
                labubu.cooldown--;
            }

            if (labubu.turnCooldown > 0) {
                labubu.turnCooldown--;
            }

        });

    }
    /*createRailNodes() {
        this.nodes = this.physics.add.staticGroup();

        const nodePositions = [
            { x: 287, y: 95, allowedTurns: ['down'] },
            //{ x: 100, y: 100 },
            // { x: 100, y: 470 },
            // { x: 192, y: 128 },
            // { x: 192, y: 192 },

        ];

        nodePositions.forEach(p => {
            const node = this.nodes.create(p.x, p.y, 'colliderCuadrado');
            node.setDisplaySize(64, 64);
            node.setVisible(true);
            node.refreshBody();
            node.allowedTurns = p.allowedTurns; // anexo la info de giros permitidos

            // Cuando un labubu entra en un nodo puede girar
            this.players.forEach(player => {
                this.physics.add.overlap(player.sprite, this.nodes, () => {
                    player.canTurn = true;
                });
            });

        });
    }*/
    setRailNodes() {
        this.nodes = this.add.group(); // sin classType


        this.nodes.add(new RailNode(this, 288.5, 95.5, ["down", "left", "right"]));
        this.nodes.add(new RailNode(this, 95.5, 288.5, ["up", "down", "left"]));
        this.nodes.add(new RailNode(this, 288.5, 288.5, ["up", "right", "left"]));
        this.nodes.add(new RailNode(this, 416.5, 288.5, ["down", "right", "left"]));
        this.nodes.add(new RailNode(this, 608.5, 288.5, ["up", "down", "left"]));
        this.nodes.add(new RailNode(this, 416.5, 480.5, ["up", "right", "left"]));



        //this.nodes.add(new RailNode(this, 400, 300, ["up"]));
        //this.nodes.add(new RailNode(this, 600, 300, ["left", "right"]));

        // Puedes agregar más nodos según tu mapa
        // Ejemplo:
        // this.nodes.add(new RailNode(this, 500, 200, ["up", "right"]));
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
                }
                else {
                    //FALLO
                    this.bullets = this.bullets.filter(b => b !== bullet);
                    bullet.sprite.destroy();
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
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

        this.load.spritesheet('labubu2', 'assets/brownanim/down.png', {
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

        //SPRITES POWERUPS

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


        ////ANIMACIONES JUGADOR 1////

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

        //ANIMACIONES JUGADOR 2//

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
        this.scoreLeft = this.add.text(17, 0, '1', {
            fontFamily: 'Lemon',
            fontSize: '48px',
            color: '#e6dd38'
        });

        //j2 arriba derecha
        this.rightScore = this.add.text(657, 0, '1', {
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


        //PAREDES DEL ESCENARIO 
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
                    this.sfxcolision.play();
                }
            });

        this.spawnPowerup();

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const jugadorUno = new Labubu(this, 'player1', 96, 288, 'labubu1-down');
        const jugadorDos = new Labubu(this, 'player2', 608, 288, 'labubu2-down');

        //Empiezan con 1 vida cada uno para testear (luego lo cambio)
        jugadorUno.score = 1;
        jugadorDos.score = 1;

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

    spawnPowerup(){
        
        let type = Math.ceil(Math.random()*3)
        //let type = 2    //testear el cambio de direccion
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

    collectPowerup(player, powerup){
        
        let speedmult = 1.4; 
        
        this.sfxpowerup = this.sound.add('powerupSonido', {
                loop: false,
                volume: 1
            });
            this.sfxpowerup.play();

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

    updateAnim(player){



    }



    update() {




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
            let currentRailx = 0;
            let currentRaily = 0;

            let newDirection = labubu.currentDirection;

            //eset de flags por frame
            labubu.canTurn = false;
            labubu.allowedTurns = labubu.allowedTurns || [];

            labubu.updateCenterCollider();
            //detectar si está sobre un nodo 
            this.physics.overlap(labubu.centerCollider, this.nodes, (spr, node) => {
                if(Phaser.Math.Distance.Between(labubu.centerCollider.x, labubu.centerCollider.y, node['x'], node['y']) > 18){
                    return;
                }        
                labubu.canTurn = true;
                
                currentRailx = node['x'];
                currentRaily = node['y'];
                labubu.allowedTurns = node['allowedTurns'] || [];
            });

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

            //GIRO POR INPUT SOLO EN NODO
            if (inputDir && labubu.canTurn && !labubu.blockMove && labubu.turnCooldown === 0) {


                // Verifica si la dirección que quiere el jugador está permitida por el nodo
                if (labubu.allowedTurns.includes(inputDir) && !body.blocked[inputDir]) {
                    // Giro permitido: actualizar dirección
                    newDirection = inputDir;
                    labubu.canTurn = false; // evita múltiples giros en el mismo nodo
                    
                    //hacer el giro más fluido
                    this.tweens.add({
                        targets: labubu.sprite,
                        x: currentRailx,
                        duration:600,
                        ease: 'Sine',
                        onComplete: () => { 
                            labubu.blockMove = false} 
                    });
                    labubu.turnCooldown = 50;


                } else {
                    // Giro no permitido: mantener la dirección anterior
                    newDirection = labubu.currentDirection;
                }
            }

            //GIRO AUTOMÁTICO 
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
            
            let anim = labubu.sprite.anims.currentAnim?.key;

            if (
                (anim.endsWith('down') && labubu.currentDirection !== 'down') ||
                (anim.endsWith('left') && labubu.currentDirection !== 'left') ||
                (anim.endsWith('right') && labubu.currentDirection !== 'right') ||
                (anim.endsWith('up') && labubu.currentDirection !== 'up'))
                {
                    
                    if(labubu.currentDirection==='right'&&anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-right');
                    if(labubu.currentDirection==='left'&&anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-left');
                    if(labubu.currentDirection==='down'&&anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-down');
                    if(labubu.currentDirection==='up'&&anim.startsWith('labubu1-')) labubu.sprite.play('labubu1-up');

                    if(labubu.currentDirection==='right'&&anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-right');
                    if(labubu.currentDirection==='left'&&anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-left');
                    if(labubu.currentDirection==='down'&&anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-down');
                    if(labubu.currentDirection==='up'&&anim.startsWith('labubu2-')) labubu.sprite.play('labubu2-up');


                }   


            //APLICAR MOVIMIENTO

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

            // REDUCIR COOLDOWN
            if (labubu.cooldown > 0) {
                labubu.cooldown--;
            }

            if (labubu.turnCooldown > 0) {
                labubu.turnCooldown--;
            }

        });

    }
    setRailNodes() {
        this.nodes = this.add.group(); // sin classType


        this.nodes.add(new RailNode(this, 288.5, 95.5, ["down", "left", "right"]));
        this.nodes.add(new RailNode(this, 95.5, 288.5, ["up", "down", "left"]));
        this.nodes.add(new RailNode(this, 288.5, 288.5, ["up", "right", "left"]));
        this.nodes.add(new RailNode(this, 416.5, 288.5, ["down", "right", "left"]));
        this.nodes.add(new RailNode(this, 608.5, 288.5, ["up", "down", "left"]));
        this.nodes.add(new RailNode(this, 416.5, 480.5, ["up", "right", "left"]));
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
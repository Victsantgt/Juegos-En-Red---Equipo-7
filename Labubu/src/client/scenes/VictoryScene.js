import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    init(data) {
        this.winnerId = data.winnerId;
    }

    preload() {
        // Carga de imágenes
        this.load.image('j1Ganador', 'assets/pantallaVictoria/j1Ganador.png');
        this.load.image('j2Ganador', 'assets/pantallaVictoria/j2Ganador.png');

        this.load.image('j1Perdedor', 'assets/pantallaVictoria/j1Perdedor.png');
        this.load.image('j2Perdedor', 'assets/pantallaVictoria/j2Perdedor.png');

        this.load.image('sady', 'assets/spritesVic/sady.png'); // Para j1Perdedor
        this.load.image('sadb', 'assets/spritesVic/sadb.png'); // Para j2Perdedor

        this.load.image('happyY1', 'assets/spritesVic/happyY1.png'); // Para j1Ganador
        this.load.image('happyY2', 'assets/spritesVic/happyY2.png'); // Para j1Ganador

        this.load.image('happyB1', 'assets/spritesVic/happyB1.png'); // Para j2Ganador
        this.load.image('happyB2', 'assets/spritesVic/happyB2.png'); // Para j2Ganador

        this.load.image('Botones', 'assets/pantallaVictoria/Botones.png');

        this.load.audio('musicaVictoria', 'assets/audio/winTheme.mp3');
    }

    create() {
        // --- Fondo Oscuro ---
        this.add.rectangle(0, 0, 704, 576, 0x000000, 0.8).setOrigin(0, 0);

        //MÚSICA
        this.sound.stopAll();
        this.sound.removeAll();
        this.musica = this.sound.add('musicaVictoria', {
            loop: true,
            volume: 0.5
        });
        this.musica.play();
        
        // Variables para las claves de las imágenes
        let winnerAsset = '';
        let loserAsset = '';
        let sadAsset = ''; 
        let happyAsset1 = '';
        let happyAsset2 = '';

        if (this.winnerId === 'player1') {
            // Gana J1
            winnerAsset = 'j1Ganador';  // Imagen J1 Ganando
            loserAsset = 'j2Perdedor';  // Imagen J2 Perdiendo
            sadAsset = 'sadb';          // Imagen triste asociada a J2
            happyAsset1 = 'happyY1';
            happyAsset2 = 'happyY2';
        } else {
            // Gana J2            
            winnerAsset = 'j2Ganador';  // Imagen J2 Ganando
            loserAsset = 'j1Perdedor';  // Imagen J1 Perdiendo
            sadAsset = 'sady';          // Imagen triste asociada a J1
            happyAsset1 = 'happyB1';
            happyAsset2 = 'happyB2';
        }

        // --- ANIMACIÓN ---
        // 352 píxels es el centro

        // EL GANADOR
        const winnerSprite = this.add.image(-300, 288, winnerAsset)
            .setDepth(1); // Profundidad 1 (por encima del perdedor y la imagen triste)
        winnerSprite.setScale(1);

        this.tweens.add({
            targets: winnerSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // HAPPY ANIMATION
        // Creamos la animación específica para esta victoria
        this.anims.create({
            key: 'happyAnim',
            frames: [
                { key: happyAsset1 },
                { key: happyAsset2 }
            ],
            frameRate: 4,
            repeat: -1
        });

        const happySprite = this.add.sprite(-300, 288, happyAsset1)
            .setDepth(1.5) // Por encima del ganador base (1) pero debajo del texto (2)
            .play('happyAnim');
        happySprite.setScale(1);

        this.tweens.add({
            targets: happySprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // EL PERDEDOR
        const loserSprite = this.add.image(1004, 288, loserAsset);
        loserSprite.setScale(1);

        this.tweens.add({
            targets: loserSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // SAD
        const sadSprite = this.add.image(1004, 288, sadAsset)
            .setDepth(0.5); // Profundidad 0.5 (entre el perdedor y el ganador)
        sadSprite.setScale(1);

        this.tweens.add({
            targets: sadSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // BOTONES
        const botonesSprite = this.add.image(1004, 288, 'Botones');
        botonesSprite.setScale(1);

        this.tweens.add({
            targets: botonesSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // --- Botón del Menú ---
        const menuBtn = this.add.text(1133, 90, 'VOLVER AL MENÚ', { 
            fontFamily: 'Lemon',
            fontSize: '35px',
            color: '#000000ff',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .setDepth(2); 

        this.tweens.add({
            targets: menuBtn,
            x: 520,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        menuBtn.on('pointerover', () => menuBtn.setColor('#424242ff'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#000000ff'));

        menuBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.stop('GameScene');
                this.scene.start('MenuScene');
            });
        });

        // --- Botón de Revancha ---
        const resumeBtn = this.add.text(1130, 220, 'REVANCHA', {
            fontFamily: 'Lemon',
            fontSize: '40px',
            color: '#000000ff',
        }).setOrigin(0.5) //0.5 para alinear centro con el botón de menú
          .setInteractive({ useHandCursor: true })
          .setDepth(2);

        this.tweens.add({
            targets: resumeBtn,
            x: 560,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        resumeBtn.on('pointerover', () => resumeBtn.setColor('#424242ff'));
        resumeBtn.on('pointerout', () => resumeBtn.setColor('#000000ff'));
        resumeBtn.on('pointerdown', () => {
            // Reiniciamos la partida
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.stop('GameScene'); 
                this.scene.start('GameScene');
            });
        });
    }
}
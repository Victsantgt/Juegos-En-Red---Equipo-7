import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    init(data) {
        this.winnerId = data.winnerId;

        this.winnerAsset = '';
        this.loserAsset = '';
        this.sadAsset = ''; 
        this.happyAsset1 = '';
        this.happyAsset2 = '';
    
        // Parsear el skin y poner un valor por defecto si falla (|| 0)
        const skinID = parseInt(localStorage.getItem("skin"), 10) || 0;

        switch(skinID){
            case 0:
                this.sadAsset = 'sadb';
                this.happyAsset1 = 'happyY1'; // Ojo: Aquí pusiste happyY (Yellow) para skin 0? 
                this.happyAsset2 = 'happyY2'; // Asegúrate que los colores coinciden con tu diseño
            break;
            case 1:
                this.sadAsset = 'sady';
                this.happyAsset1 = 'happyB1';
                this.happyAsset2 = 'happyB2';
            break;
            
            case 2:
                this.sadAsset = 'sadp';
                this.happyAsset1 = 'happyR1';
                this.happyAsset2 = 'happyR2';
            break;
            
            case 3:
                this.sadAsset = 'sadr';
                this.happyAsset1 = 'happyP1';
                this.happyAsset2 = 'happyP2';
            break;
            
            default: // Caso de seguridad extra
                this.sadAsset = 'sadb';
                this.happyAsset1 = 'happyY1';
                this.happyAsset2 = 'happyY2';
            break;
        }
    }

    preload() {
        // Carga de imágenes

        this.load.image('j1Ganador', 'assets/pantallaVictoria/j1Ganador.png');
        this.load.image('j2Ganador', 'assets/pantallaVictoria/j2Ganador.png');

        this.load.image('j1Perdedor', 'assets/pantallaVictoria/j1Perdedor.png');
        this.load.image('j2Perdedor', 'assets/pantallaVictoria/j2Perdedor.png');

        this.load.image('sady', 'assets/spritesVic/sady.png'); 
        this.load.image('sadb', 'assets/spritesVic/sadb.png');
        this.load.image('sadp', 'assets/spritesVic/sadp.png');
        this.load.image('sadr', 'assets/spritesVic/sadr.png');

        this.load.image('happyY1', 'assets/spritesVic/happyY1.png'); //amarillo
        this.load.image('happyY2', 'assets/spritesVic/happyY2.png'); 

        this.load.image('happyB1', 'assets/spritesVic/happyB1.png'); //marron
        this.load.image('happyB2', 'assets/spritesVic/happyB2.png'); 

        this.load.image('happyP1', 'assets/spritesVic/happyP1.png'); //morado
        this.load.image('happyP2', 'assets/spritesVic/happyP2.png'); 

        this.load.image('happyR1', 'assets/spritesVic/happyR1.png'); //rojo
        this.load.image('happyR2', 'assets/spritesVic/happyR2.png'); 

        this.load.image('Botones', 'assets/pantallaVictoria/Botones.png');

        this.load.audio('musicaVictoria', 'assets/audio/winTheme.mp3');
    }

    create() {
        // --- Fondo Oscuro ---
        this.add.rectangle(0, 0, 704, 576, 0x000000, 0.8).setOrigin(0, 0);

        // --- MÚSICA ---
        this.sound.stopAll();
        this.sound.removeAll();
        this.musica = this.sound.add('musicaVictoria', {
            loop: true,
            volume: 0.5
        });
        this.musica.play();
        

        // --- Determinar quién gana visualmente ---
        if (this.winnerId === 'player1') {
            // Gana J1
            this.winnerAsset = 'j1Ganador';  
            this.loserAsset = 'j2Perdedor';  
        } else {
            // Gana J2            
            this.winnerAsset = 'j2Ganador';  
            this.loserAsset = 'j1Perdedor';  
        }
        

        // --- ANIMACIÓN ---
        // 352 píxels es el centro

        // 1. EL GANADOR (Base)
        const winnerSprite = this.add.image(-300, 288, this.winnerAsset)
            .setDepth(1); // Profundidad 1
        winnerSprite.setScale(1);

        this.tweens.add({
            targets: winnerSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // 2. HAPPY ANIMATION (ARREGLO AQUÍ)
        // Importante: Si la animación ya existe de una partida anterior, la borramos
        // para que se pueda volver a crear con los assets del color correcto.
        if (this.anims.exists('happyAnim')) {
            this.anims.remove('happyAnim');
        }

        this.anims.create({
            key: 'happyAnim',
            frames: [
                { key: this.happyAsset1 },
                { key: this.happyAsset2 }
            ],
            frameRate: 4,
            repeat: -1
        });

        let happySprite = this.add.sprite(-300, 288, this.happyAsset1)
            .setDepth(1.5) // Por encima del ganador base
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

        // 3. EL PERDEDOR
        let loserSprite = this.add.image(1004, 288, this.loserAsset);
        loserSprite.setScale(1);

        this.tweens.add({
            targets: loserSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // 4. SAD (Triste)
        let sadSprite = this.add.image(1004, 288, this.sadAsset)
            .setDepth(0.5); // Profundidad 0.5
        sadSprite.setScale(1);

        this.tweens.add({
            targets: sadSprite,
            x: 352,        
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // 5. BOTONES DECORATIVOS (Fondo de botones)
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

        // --- INTERFAZ ---

        // Botón del Menú
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
                this.scene.stop('GameScene'); // Aseguramos parar la escena de juego
                this.scene.start('MenuScene');
            });
        });

        // Botón de Revancha
        const resumeBtn = this.add.text(1130, 220, 'REVANCHA', {
            fontFamily: 'Lemon',
            fontSize: '40px',
            color: '#000000ff',
        }).setOrigin(0.5)
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
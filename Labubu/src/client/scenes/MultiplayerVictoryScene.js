import Phaser from 'phaser';

export class MultiplayerVictoryScene extends Phaser.Scene {
    constructor() {
        super('MultiplayerVictoryScene');
    }

    init(data) {
        // Recibimos los datos de la escena de juego
        this.winnerId = data.winnerId; // 'player1' o 'player2'
        
        const p1Skin = data.p1Skin || 0;
        const p2Skin = data.p2Skin || 0;

        let winnerSkinNum = 0;
        let loserSkinNum = 0;

        // Lógica: Asignar skin basada en quién ganó
        if (this.winnerId === 'player1') {
            winnerSkinNum = p1Skin;
            loserSkinNum = p2Skin;
        } else {
            winnerSkinNum = p2Skin;
            loserSkinNum = p1Skin;
        }

        // --- Configuración de Assets ---
        this.winnerAsset = '';
        this.loserAsset = '';
        
        const happyAssets = this.getSkinConfig(winnerSkinNum);
        const sadAssets = this.getSkinConfig(loserSkinNum);

        // Asignamos las variables que usará el create()
        this.happyAsset1 = happyAssets.happy1;
        this.happyAsset2 = happyAssets.happy2;
        this.sadAsset = sadAssets.sad; 
    }

    // Función auxiliar para traducir ID de skin a nombre de archivo
    getSkinConfig(skinId) {
        switch(skinId) {
            case 1: return { sad: 'sady', happy1: 'happyY1', happy2: 'happyY2' }; // Skin 1
            case 0: return { sad: 'sadb', happy1: 'happyB1', happy2: 'happyB2' }; // Skin 0
            case 2: return { sad: 'sadp', happy1: 'happyP1', happy2: 'happyP2' }; // Skin 2
            case 3: return { sad: 'sadr', happy1: 'happyR1', happy2: 'happyR2' }; // Skin 3
            default: return { sad: 'sadb', happy1: 'happyY1', happy2: 'happyY2' }; // Fallback
        }
    }

    preload() {
        // Cargamos los mismos assets que la victoria normal
        this.load.image('j1Ganador', 'assets/pantallaVictoria/j1Ganador.png');
        this.load.image('j2Ganador', 'assets/pantallaVictoria/j2Ganador.png');
        this.load.image('j1Perdedor', 'assets/pantallaVictoria/j1Perdedor.png');
        this.load.image('j2Perdedor', 'assets/pantallaVictoria/j2Perdedor.png');

        this.load.image('sady', 'assets/spritesVic/sady.png'); 
        this.load.image('sadb', 'assets/spritesVic/sadb.png');
        this.load.image('sadp', 'assets/spritesVic/sadp.png');
        this.load.image('sadr', 'assets/spritesVic/sadr.png');

        this.load.image('happyY1', 'assets/spritesVic/happyY1.png'); 
        this.load.image('happyY2', 'assets/spritesVic/happyY2.png'); 
        this.load.image('happyB1', 'assets/spritesVic/happyB1.png'); 
        this.load.image('happyB2', 'assets/spritesVic/happyB2.png'); 
        this.load.image('happyP1', 'assets/spritesVic/happyP1.png'); 
        this.load.image('happyP2', 'assets/spritesVic/happyP2.png'); 
        this.load.image('happyR1', 'assets/spritesVic/happyR1.png'); 
        this.load.image('happyR2', 'assets/spritesVic/happyR2.png'); 

        this.load.image('buttons', 'assets/pantallaVictoria/buttons.png');
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

        // --- Determinar Textos ---
        if (this.winnerId === 'player1') {
            this.winnerAsset = 'j1Ganador';  
            this.loserAsset = 'j2Perdedor';  
        } else {       
            this.winnerAsset = 'j2Ganador';  
            this.loserAsset = 'j1Perdedor';  
        }

        // --- ANIMACIÓN ---

        // 1. EL GANADOR (Texto)
        const winnerSprite = this.add.image(-300, 288, this.winnerAsset).setDepth(1);
        this.tweens.add({ targets: winnerSprite, x: 352, duration: 1000, ease: 'Linear' });

        // 2. HAPPY ANIMATION
        // Limpiamos animación por si acaso
        if (this.anims.exists('happyAnimMP')) {
            this.anims.remove('happyAnimMP');
        }

        this.anims.create({
            key: 'happyAnimMP', // Key única para multiplayer
            frames: [
                { key: this.happyAsset1 },
                { key: this.happyAsset2 }
            ],
            frameRate: 4,
            repeat: -1
        });

        let happySprite = this.add.sprite(-300, 288, this.happyAsset1)
            .setDepth(1.5)
            .play('happyAnimMP');
            
        this.tweens.add({ targets: happySprite, x: 352, duration: 1000, ease: 'Linear' });

        // 3. EL PERDEDOR (Texto)
        let loserSprite = this.add.image(1004, 288, this.loserAsset);
        this.tweens.add({ targets: loserSprite, x: 352, duration: 1000, ease: 'Linear' });

        // 4. SAD (Sprite)
        let sadSprite = this.add.image(1004, 288, this.sadAsset).setDepth(0.5);
        this.tweens.add({ targets: sadSprite, x: 352, duration: 1000, ease: 'Linear' });

        // 5. BOTONES DECORATIVOS
        const botonesSprite = this.add.image(1004, 288, 'buttons');
        this.tweens.add({ targets: botonesSprite, x: 352, duration: 1000, ease: 'Linear' });

        // --- INTERFAZ ---

        // Función para volver al menú
        const goToMenu = () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.stop('MultiplayerGameScene'); 
                this.scene.start('MenuScene'); 
            });
        };

        // Botón Menú
        const menuBtn = this.add.text(1133, 90, 'SALIR AL MENÚ', { 
            fontFamily: 'Lemon', fontSize: '35px', color: '#000000ff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2); 

        this.tweens.add({ targets: menuBtn, x: 520, duration: 1000, ease: 'Linear' });

        menuBtn.on('pointerover', () => menuBtn.setColor('#424242ff'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#000000ff'));
        menuBtn.on('pointerdown', goToMenu);
    }
}
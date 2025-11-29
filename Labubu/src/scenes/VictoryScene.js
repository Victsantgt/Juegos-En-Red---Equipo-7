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

        this.load.image('Botones', 'assets/pantallaVictoria/Botones.png');
    }

    create() {
        // --- Fondo Oscuro ---
        this.add.rectangle(0, 0, 704, 576, 0x000000, 0.8).setOrigin(0, 0);

        // --- LÓGICA DE GANADOR / PERDEDOR ---
        let winnerText = '';
        let winnerColor = '';
        
        // Variables para las claves de las imágenes
        let winnerAsset = '';
        let loserAsset = '';

        if (this.winnerId === 'player1') {
            // Gana J1
            winnerText = '¡JUGADOR 1 GANA!';
            winnerColor = '#e6dd38'; // Amarillo
            
            winnerAsset = 'j1Ganador';  // Imagen J1 Ganando
            loserAsset = 'j2Perdedor';  // Imagen J2 Perdiendo
        } else {
            // Gana J2
            winnerText = '¡JUGADOR 2 GANA!';
            winnerColor = '#8a452e'; // Marrón/Rojo (según tu código pasado)
            
            winnerAsset = 'j2Ganador';  // Imagen J2 Ganando
            loserAsset = 'j1Perdedor';  // Imagen J1 Perdiendo
        }

        // --- ANIMACIÓN SIMULTÁNEA ---

        // EL GANADOR (Entra por la IZQUIERDA)
        const winnerSprite = this.add.image(-300, 288, winnerAsset)
            .setDepth(1); 
        winnerSprite.setScale(1);

        this.tweens.add({
            targets: winnerSprite,
            x: 280,         // Destino: Un poco a la izquierda del centro
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // EL PERDEDOR (Entra por la DERECHA)
        const loserSprite = this.add.image(1004, 288, loserAsset);
        loserSprite.setScale(1);

        this.tweens.add({
            targets: loserSprite,
            x: 424,         // Destino: Un poco a la derecha del centro
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // BOTONES (Entra por la DERECHA)
        const botonesSprite = this.add.image(1004, 288, 'Botones');
        botonesSprite.setScale(1);

        this.tweens.add({
            targets: botonesSprite,
            x: 424,         // Destino: Un poco a la derecha del centro
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        // --- Botón del Menú ---
        const menuBtn = this.add.text(1130, 108, 'VOLVER AL MENÚ', { 
            fontFamily: 'Lemon',
            fontSize: '25px',
            color: '#ffffff',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .setDepth(2); 

        this.tweens.add({
            targets: menuBtn,
            x: 550,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false
        });

        menuBtn.on('pointerover', () => menuBtn.setColor('#cccccc'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'));

        menuBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.stop('GameScene');
                this.scene.start('MenuScene');
            });
        });
    }
}
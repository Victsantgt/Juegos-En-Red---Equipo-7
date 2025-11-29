import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuFondo', 'assets/menuFondo.png');
    }

    create() {
        // FADE IN
        this.cameras.main.fadeIn(1000, 255, 255, 255);

        let menuFondo = this.add.image(0, 0, 'menuFondo').setOrigin(0, 0);

        const localBtn = this.add.text(400, 320, 'Local 2 Player', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setColor('#553922'))
        .on('pointerout', () => localBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            
            // Desactivamos el botón para que no le den clic 2 veces
            localBtn.disableInteractive();

            // Iniciamos el fundido a negro (1000ms = 1 segundo)
            this.cameras.main.fadeOut(1000, 255, 255, 255);

            // Esperamos a que la cámara termine de oscurecerse para cambiar de escena
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('GameScene');
            });
        });

        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not available)', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.6, 0.6);
    }
}
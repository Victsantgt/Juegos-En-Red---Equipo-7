import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuFondo', 'assets/menuFondo.png');
        this.load.audio('musicaFondo', 'assets/audio/menuPpal.mp3');
    }

    create() {
        // --- CONFIGURACIÓN INICIAL ---
        this.cameras.main.setBackgroundColor('#ffffff');
        this.cameras.main.fadeIn(1000, 255, 255, 255);

        this.add.image(0, 0, 'menuFondo').setOrigin(0, 0);

        // --- CAPA DE OSCURECIMIENTO (OVERLAY) ---
        // Creamos un rectángulo negro que ocupa toda la pantalla, pero invisible (alpha 0)
        // Asumimos un tamaño de 800x600 (ajústalo al tamaño de tu juego)
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0)
            .setDepth(10); // Depth alto para que tape los botones

        // --- BOTÓN LOCAL (Lógica anterior) ---
        const localBtn = this.add.text(400, 320, 'Local 2 Jugadores', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setColor('#553922'))
        .on('pointerout', () => localBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            localBtn.disableInteractive();
            this.cameras.main.fadeOut(1000, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameScene');
            });
        });

        // --- BOTÓN ONLINE ---
        this.add.text(400, 390, 'Online Multiplayer (Not available)', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.6, 0.6);
        
        // --- BOTÓN CRÉDITOS ---
        const creditBtn = this.add.text(400, 200, 'Créditos', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => creditBtn.setColor('#553922'))
        .on('pointerout', () => creditBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            
            creditBtn.disableInteractive();

            // TWEEN: Animamos el oscurecimiento suavemente
            this.tweens.add({
                targets: overlay,
                alpha: 0.6, // Se oscurece al 60% (se sigue viendo el fondo)
                duration: 500, // Duración del fundido (0.5 segundos)
                onComplete: () => {
                    // Una vez oscuro, pausamos y lanzamos
                    this.scene.pause();
                    this.scene.launch('CreditScene');
                }
            });
        });

        // --- EVENTO RESUME (Al volver de créditos) ---
        this.events.on('resume', () => {
            // Quitamos el oscurecimiento suavemente
            this.tweens.add({
                targets: overlay,
                alpha: 0, // Vuelve a ser invisible
                duration: 300,
                onComplete: () => {
                    // Reactivamos el botón al terminar la animación
                    creditBtn.setInteractive();
                    creditBtn.setColor('#5eb232'); 
                }
            });
        });
    }
}
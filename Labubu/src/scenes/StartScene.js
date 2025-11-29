import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.audio('musicaFondo', 'assets/audio/menuPpal.mp3');
    }

    create() {
        //MÚSICA
        this.musica = this.sound.add('musicaFondo', {
            loop: true,      // que la música se repita
            volume: 0.5      // volumen inicial
        });

        // FADE IN
        this.cameras.main.setBackgroundColor('#ffffff');
        this.cameras.main.fadeIn(600, 255, 255, 255);

        const text = this.add.text(420, 576/2, 'Haz click para empezar...', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.7, 0.7);

        this.tweens.add({
            targets: text,
            alpha: 0,          // se vuelve invisible
            duration: 800,     // tiempo en desaparecer
            yoyo: true,        // vuelve a alpha 1
            repeat: -1         // repite infinito
        });

        this.input.once('pointerdown', () => {
            this.musica.play();
            this.cameras.main.fadeOut(1000, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('MenuScene');
            });
        });
    }
}
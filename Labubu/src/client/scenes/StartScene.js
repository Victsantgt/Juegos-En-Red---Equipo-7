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
            loop: true,
            volume: 0.5
        });
        this.sound.volume = parseFloat(localStorage.getItem("volume")) || 1;    //Cargar el volumen de partidas anteriores

        // FADE IN
        this.cameras.main.setBackgroundColor('#ffffff');
        this.cameras.main.fadeIn(600, 255, 255, 255);

        const text = this.add.text(704/2, 576/2, 'Click to start...', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#000000ff',
        }).setOrigin(0.5, 0.5);

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
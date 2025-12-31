import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }

    create(data) {    
        // --- REFERENCIAS DE PANTALLA (704x576) ---
        const width = 704;
        const height = 576;
        const centerX = width / 2;
        const centerY = height / 2;

        // --- FONDO SEMITRANSPARENTE ---
        // Cubrimos toda la pantalla
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0);

        // --- TÍTULO ---
        this.add.text(centerX, centerY - 70, 'JUEGO PAUSADO', {
            fontFamily: 'Lemon',
            fontSize: '64px',
            color: '#8b4a00ff'
        }).setOrigin(0.5, 0.5); // Centro absoluto del texto

        // --- BOTÓN RESUME ---
        const resumeBtn = this.add.text(centerX, centerY, 'Continuar', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => resumeBtn.setColor('#553922')) 
        .on('pointerout', () => resumeBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            this.scene.stop();
            
            if (data && data.originalScene) {
                this.scene.resume(data.originalScene);
            }
        });

        // --- BOTÓN RETURN TO MENU ---
        const menuBtn = this.add.text(centerX, centerY + 70, 'Volver al Menú', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#553922'))
        .on('pointerout', () => menuBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            if (data && data.originalScene) {
                this.scene.stop(data.originalScene);
            }
            this.scene.stop();           
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });

        //AJUSTE VOLUMEN
        let volume = parseFloat(localStorage.getItem("volume")) || 1;

        this.add.text(centerX, centerY + 130, "Volumen", {
            fontFamily: 'Lemon',
            fontSize: '20px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5);

        let volumeText = this.add.text(centerX, centerY + 160, `${Math.round(volume * 100)}%`, {
            fontFamily: 'Lemon',
            fontSize: '20px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5);

        const minus = this.add.text(centerX - 80, centerY + 130, "-", {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5).setInteractive();
        const plus = this.add.text(centerX + 80, centerY + 130, "+", {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232',
        }).setOrigin(0.5, 0.5).setInteractive();

        minus.on("pointerdown", () => {
            volume = Math.max(0, volume - 0.1);
            this.sound.volume = volume;
            volumeText.setText(`${Math.round(volume * 100)}%`);
            localStorage.setItem("volume", `${volume}%`);

        });
        minus.on('pointerover', () => minus.setColor('#553922'));
        minus.on('pointerout', () => minus.setColor('#5eb232'));

        plus.on("pointerdown", () => {
            volume = Math.min(1, volume + 0.1);
            this.sound.volume = volume;
            volumeText.setText(`${Math.round(volume * 100)}%`);
            localStorage.setItem("volume", `${volume}%`);
        });
        plus.on('pointerover', () => plus.setColor('#553922'));
        plus.on('pointerout', () => plus.setColor('#5eb232'));
    }
}
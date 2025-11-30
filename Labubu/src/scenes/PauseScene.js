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

        // --- TÍTULO (Game Paused) ---
        this.add.text(centerX, centerY - 100, 'Game Paused', {
            fontFamily: 'Lemon',
            fontSize: '64px',
            color: '#8b4a00ff'
        }).setOrigin(0.5, 0.5); // Centro absoluto del texto

        // --- BOTÓN RESUME ---
        const resumeBtn = this.add.text(centerX, centerY + 20, 'Resume', {
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
        const menuBtn = this.add.text(centerX, centerY + 100, 'Return to Main Menu', {
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
            this.scene.start('MenuScene');
        });
    }
}
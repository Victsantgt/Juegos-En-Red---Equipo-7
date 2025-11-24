import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {

    constructor() {
        super('PauseScene');
    }

    create(data) {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        this.add.text(400, 200, 'Game Paused', {
            fontFamily: 'Lemon',
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.6, 0);

        const resumeBtn = this.add.text(400, 320, 'Resume', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#00a6ffff',
        }).setOrigin(0.8, 0.3)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => resumeBtn.setColor('#ffd900ff'))
        .on('pointerout', () => resumeBtn.setColor('#00a6ffff'))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#0015ffff',
        }).setOrigin(0.6, 0.6)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#ff0000ff'))
        .on('pointerout', () => menuBtn.setColor('#0015ffff'))
        .on('pointerdown', () => {
            this.scene.stop(data.originalScene);
            this.scene.start('MenuScene');
        });
    }
}
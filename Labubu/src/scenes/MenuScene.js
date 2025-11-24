import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 100, 'LABUBU MATCHUP', {
        fontFamily: 'Lemon', 
        fontSize: '64px',
        color: '#ffffff'
    }).setOrigin(0.57, 0);

        const localBtn = this.add.text(400, 320, 'Local 2 Player', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#ff0000ff',
        }).setOrigin(0.7, 0.7)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setColor('#0048ffff'))
        .on('pointerout', () => localBtn.setColor('#ff0000ff'))
        .on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not available)', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#8e0000ff',
        }).setOrigin(0.6, 0.6);
    }
}
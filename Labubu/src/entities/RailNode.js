export class RailNode extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, allowedTurns) {
        super(scene, x, y, 'railNode');

        this.allowedTurns = allowedTurns; // direcciones permitidas
        
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true → body estático

        // Ajustar tamaño 64x64
        this.setDisplaySize(10, 10);
        this.body.setSize(10, 10);
        this.setVisible(true);
        //this.body.setImmovable(true);
    }
}
export class RailNode extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, allowedTurns) {
        super(scene, x, y, 'railNode');

        this.allowedTurns = allowedTurns; // direcciones permitidas
        this.x = x;
        this.y=y;
        
        scene.add.existing(this);
        scene.physics.add.existing(this, true); 

        // Ajustar tamaño 64x64
        this.setDisplaySize(20, 20);
        this.body.setSize(20,20);
        this.setVisible(true);

    }
    
}
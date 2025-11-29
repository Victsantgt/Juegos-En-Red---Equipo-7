export class RailNode extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, allowedTurns) {
        super(scene, x, y, 'railNode');

        this.allowedTurns = allowedTurns; // direcciones permitidas
        this.x = x;
        this.y=y;
        
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true → body estático

        // Ajustar tamaño 64x64
        this.setDisplaySize(20, 20);
        this.body.setSize(20,20);
        this.setVisible(true);
        //this.body.setImmovable(true);

        //COLLIDER DEL CENTRO
        /*this.centerPoint = scene.add.zone(x, y, 20, 20);
        scene.physics.add.existing(this.centerPoint, true);
        this.centerPoint.setVisible(true);
        this.getCenter();*/
    }
    
}
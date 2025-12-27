export class RailNode extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, allowedTurns, id) {
        super(scene, x, y, 'railNode');

        this.allowedTurns = this.allowedTurns = allowedTurns.map(dir => ({
            direction: dir.direction || dir, // en caso de que venga solo string
            turnMode: dir.turnMode || "normal"
        }));
        this.x = x;
        this.y = y;
        this.id = id;
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        // Ajustar tamaño 64x64
        this.setDisplaySize(20, 20);
        this.body.setSize(20, 20);
        this.setVisible(true);

    }

}
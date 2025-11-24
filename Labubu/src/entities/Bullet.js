export class Bullet {

    constructor(scene, x, y, dir) {
        this.scene = scene;

        this.speed = 600;
        
        this.sprite = this.scene.physics.add.sprite(x, y, 'tapioca');

        // Mover el collider hacia abajo
        this.sprite.body.setSize(100, 100);

        this.sprite.setCollideWorldBounds(false);
        this.sprite.body.allowGravity = false;
        this.sprite.setVisible(true);
        this.currentDirection = dir;
    }
}
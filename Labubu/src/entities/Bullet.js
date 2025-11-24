export class Bullet {

    constructor(scene, x, y, dir) {
        this.scene = scene;

        this.baseSpeed = 600;
        
        this.sprite = this.scene.physics.add.sprite(x, y, 'tapioca');

        // Mover el collider hacia abajo
        this.sprite.body.setOffset(
            (this.sprite.width - 50) / 2,       // centrado horizontalmente
            (this.sprite.height - 50) / 2       // centrado verticalmente
        );

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;

        this.currentDirection = dir;
    }

    


}
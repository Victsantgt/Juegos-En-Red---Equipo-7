export class Bullet {

    constructor(scene, x, y, dir) {
        this.scene = scene;

        this.speed = 600;
        
        this.sprite = this.scene.physics.add.sprite(x, y, 'tapioca');

        this.sprite.setCollideWorldBounds(true);   
        this.sprite.body.allowGravity = false;
        this.currentDirection = dir;
    }
}
export class Labubu {

    constructor(scene, id, x, y) {
          this.id = id;
        this.scene = scene;
        this.score = 0;

        this.baseSpeed = 300;

        // Crear sprite físico del jugador usando el spritesheet
        this.sprite = this.scene.physics.add.sprite(x, y, 'labubu');

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;

        // Reproducir animación automáticamente
        this.sprite.play('labubu-walk');
    }

}
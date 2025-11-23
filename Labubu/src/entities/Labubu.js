export class Labubu {

    constructor(scene, id, x, y, animKey) {
        this.id = id;
        this.scene = scene;
        this.score = 0;

        this.baseSpeed = 300;

        // Crear sprite físico del jugador usando el spritesheet
        this.sprite = this.scene.physics.add.sprite(x, y, 'labubu');

        //Retocamos el collider porque lo queremos un poco más pequeño
        this.sprite.body.setSize(58, 50);

        // Mover el collider hacia abajo
        this.sprite.body.setOffset(
            (this.sprite.width - 50) / 2,   // centrado horizontalmente
            this.sprite.height - 50         // alineado a la parte inferior
        );

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;

        //control de animaciones
        this.currentAnim = null;
        //la animación que ha recibido el constructor
        this.animKey = animKey;
    }

}
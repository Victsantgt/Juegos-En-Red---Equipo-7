export class Labubu {

    constructor(scene, id, x, y) {
        this.id = id;
        this.scene = scene;
        this.score = 0;

        // Ahora es un cuadrado
        this.size = 50;       // Ajusta el tamaño aquí
        this.baseSpeed = 300;

        // Crear textura del cuadrado
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xff0000);                      // color
        graphics.fillRect(0, 0, this.size, this.size);     // cuadrado
        graphics.generateTexture(`square-${id}`, this.size, this.size);
        graphics.destroy();

       // Crear sprite físico del cuadrado
        this.sprite = this.scene.physics.add.sprite(x, y, `square-${id}`);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
    }

}
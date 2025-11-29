import { Powerup } from "./Powerup";

export class PowerupTurn extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Turn'
        scene.powerups.add(this.sprite);
    }


}
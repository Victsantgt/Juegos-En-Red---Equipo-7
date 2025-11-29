import { Powerup } from "./Powerup";

export class PowerupHealth extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Health'
        scene.powerups.add(this.sprite);
    }


}
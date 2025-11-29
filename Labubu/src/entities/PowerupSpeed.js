import { Powerup } from "./Powerup";

export class PowerupSpeed extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Speed'
        scene.powerups.add(this.sprite);
    }


}
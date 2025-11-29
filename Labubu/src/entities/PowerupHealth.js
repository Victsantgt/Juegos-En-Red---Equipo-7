import { Powerup } from "./Powerup";

<<<<<<< Updated upstream
export class PowerupHealth extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Health'
        scene.powerups.add(this.sprite);
    }


=======
export class PowerupHealth extends Powerup {

    constructor(){
        super();
    }

>>>>>>> Stashed changes
}
import { Powerup } from "./Powerup";

<<<<<<< Updated upstream
export class PowerupTurn extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Turn'
        scene.powerups.add(this.sprite);
    }


=======
export class PowerupTurn extends Powerup {

    constructor(){
        super();
    }

>>>>>>> Stashed changes
}
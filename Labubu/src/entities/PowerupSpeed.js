import { Powerup } from "./Powerup";

<<<<<<< Updated upstream
export class PowerupSpeed extends Powerup{

    constructor(scene, name) {
        super(scene);
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name);
        this.sprite.poweruptype = 'Speed'
        scene.powerups.add(this.sprite);
    }


=======
export class PowerupSpeed extends Powerup {

    constructor(scene,x,y,animKey){
        super(scene,x,y,animKey);

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'powerupSpeed')
        this.sprite.body.setSize(32, 32);
    }




>>>>>>> Stashed changes
}
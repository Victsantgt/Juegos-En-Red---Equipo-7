export class Powerup {

    constructor(scene, x, y) {
        this.scene = scene;

        this.posIndex = Math.floor(Math.random()*5);
        this.powerupPositions = [[96,96],[608,96],[96,480],[608,480],[352,288]];

        this.x = this.powerupPositions[this.posIndex][0];
        this.y = this.powerupPositions[this.posIndex][1];
    }
}

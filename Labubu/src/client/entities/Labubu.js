export class Labubu {

    constructor(scene, id, x, y, animKey) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.cooldown = 0;
        this.turnCooldown = 0;
        this.baseSpeed = 300;
        this.blockMove=false;
        this.isWaitingAtNode=false;
        this.lastNode = null; //anti re-trigger


        // Crear sprite físico del jugador usando el spritesheet
        this.sprite = this.scene.physics.add.sprite(x, y, 'labubu');
        
        //Retocamos el collider porque lo queremos un poco más pequeño
        this.sprite.body.setSize(50, 50);

        // Mover el collider hacia abajo
        this.sprite.body.setOffset(
            (this.sprite.width - 50) / 2,   // centrado horizontalmente
            this.sprite.height - 50         // alineado a la parte inferior
        );

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
        this.sprite.playerInstance = this;

        //COLLIDER PARA DETECTAR NODOS
        
        this.centerCollider = this.scene.add.zone(x, y, 10,10);
        this.scene.physics.add.existing(this.centerCollider);
        this.centerCollider.body.setAllowGravity(false);
        this.centerCollider.body.setImmovable(true);
        

        //control de animaciones
        this.currentAnim = null;
        //la animación que ha recibido el constructor
        this.animKey = animKey;

        this.currentDirection = 'down';     // dirección inicial
        this.turnMode = "normal";
        
    }

    updateCenterCollider() {
    const offset = 4;
        this.centerCollider.x = this.sprite.x+offset;
        this.centerCollider.y = this.sprite.y+offset;
    }

    alternateTurnmode() {
        if (this.turnMode === "normal") this.turnMode = "reverse";
        else this.turnMode = "normal";
    }


}
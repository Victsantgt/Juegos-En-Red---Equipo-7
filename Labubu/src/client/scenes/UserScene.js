import Phaser from 'phaser';

export class UserScene extends Phaser.Scene {
    constructor() {
        super('UserScene');
    }

    preload() {
        const savedSkin1 = parseInt(localStorage.getItem("skin1"), 10);
        this.currentSkin1 = Number.isInteger(savedSkin1) && savedSkin1 >= 0 ?
            savedSkin1 :
            0;
        const savedSkin2 = parseInt(localStorage.getItem("skin2"), 10);
        this.currentSkin2 = Number.isInteger(savedSkin2) && savedSkin2 >= 0 ?
            savedSkin2 :
            0;

        // Carga de sprites (Mantenemos igual)
        this.load.spritesheet('labubuMarron', 'assets/brownanim/skin.png', { frameWidth: 136, frameHeight: 176 });
        this.load.spritesheet('labubuAmarillo', 'assets/yellow/skin.png', { frameWidth: 136, frameHeight: 176 });
        this.load.spritesheet('labubuMorado', 'assets/purpleanim/skin.png', { frameWidth: 136, frameHeight: 176 });
        this.load.spritesheet('labubuRojo', 'assets/redanim/skin.png', { frameWidth: 136, frameHeight: 176 });
    }

    create() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        // --- CREACIÓN DE ANIMACIONES (Solo si no existen) ---
        if (!this.anims.exists('labubuM')) {
            this.anims.create({ key: 'labubuM', frames: this.anims.generateFrameNumbers('labubuMarron', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'labubuA', frames: this.anims.generateFrameNumbers('labubuAmarillo', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'labubuMo', frames: this.anims.generateFrameNumbers('labubuMorado', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'labubuR', frames: this.anims.generateFrameNumbers('labubuRojo', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        }

        // --- CONFIGURACIÓN DE COLORES ---
        const colorTitle = '#8b4a00ff'; // Naranja oscuro
        const colorBtn = '#5eb232';     // Verde
        const colorHover = '#553922';   // Marrón oscuro

        // --- PANEL DE FONDO ---
        this.add.graphics()
            .fillStyle(0x000000, 0.85)
            .fillRoundedRect(centerX - 291, centerY - 185, 580, 400, 14);

        // --- TÍTULO PRINCIPAL ---
        this.add.text(centerX, centerY - 130, 'EDIT SKINS', {
            fontFamily: 'Lemon',
            fontSize: '40px', // Un poco más grande
            color: colorTitle
        }).setOrigin(0.5);

        /* ================= SELECCIÓN DE SKIN ================= */
        this.skins = [
            { name: 'Brown', texture: 'labubuMarron', anim: 'labubuM', color: '#ffa200ff' },
            { name: 'Yellow', texture: 'labubuAmarillo', anim: 'labubuA', color: '#fdeb51ff' },
            { name: 'Purple', texture: 'labubuMorado', anim: 'labubuMo', color: '#7632fcff' },
            { name: 'Red', texture: 'labubuRojo', anim: 'labubuR', color: '#ff2424ff' }
        ];

        // Sprite del personaje
        this.skinSprite1 = this.add.sprite(
            centerX - 150,
            centerY - 10,
            this.skins[this.currentSkin1].texture
        ).setScale(0.9); // Un pelín más pequeño para que no agobie

        this.skinSprite2 = this.add.sprite(
            centerX + 150,
            centerY - 10,
            this.skins[this.currentSkin2].texture
        ).setScale(0.9);

        this.skinSprite1.play(this.skins[this.currentSkin1].anim);
        this.skinSprite2.play(this.skins[this.currentSkin2].anim);

        // Nombre de la Skin (debajo del sprite)
        this.skinText1 = this.add.text(
            centerX - 150,
            centerY + 90,
            this.skins[this.currentSkin1].name,
            {
                fontFamily: 'Lemon',
                fontSize: '22px',
                color: this.skins[this.currentSkin1].color,
                stroke: '#000000', // Un borde negro finito para que se lea mejor el color
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        this.skinText2 = this.add.text(
            centerX + 150,
            centerY + 90,
            this.skins[this.currentSkin2].name,
            {
                fontFamily: 'Lemon',
                fontSize: '22px',
                color: this.skins[this.currentSkin2].color,
                stroke: '#000000', // Un borde negro finito para que se lea mejor el color
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // --- FLECHAS DE SELECCIÓN ---
        const buttonOffset = 100; 
        const arrowStyle = { 
            fontFamily: 'Lemon', 
            fontSize: '48px', 
            color: colorBtn 
        };

        // Botón Izquierda (<)
        this.leftButton1 = this.add.text(centerX - buttonOffset - 150, centerY - 10, '<', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin1(-1))
            .on('pointerover', () => this.leftButton1.setColor(colorHover))
            .on('pointerout', () => this.leftButton1.setColor(colorBtn));
        this.leftButton2 = this.add.text(centerX - buttonOffset + 150, centerY - 10, '<', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin2(-1))
            .on('pointerover', () => this.leftButton2.setColor(colorHover))
            .on('pointerout', () => this.leftButton2.setColor(colorBtn));

        // Botón Derecha (>)
        this.rightButton1 = this.add.text(centerX + buttonOffset - 150, centerY - 10, '>', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin1(1))
            .on('pointerover', () => this.rightButton1.setColor(colorHover))
            .on('pointerout', () => this.rightButton1.setColor(colorBtn));
        this.rightButton2 = this.add.text(centerX + buttonOffset + 150, centerY - 10, '>', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin2(1))
            .on('pointerover', () => this.rightButton2.setColor(colorHover))
            .on('pointerout', () => this.rightButton2.setColor(colorBtn));

        /* ================= BOTÓN CONFIRMAR ================= */
        const confirmBtn = this.add.text(centerX, centerY + 160, 'CONFIRM', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: colorBtn
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => confirmBtn.setColor(colorHover))
        .on('pointerout', () => confirmBtn.setColor(colorBtn))
        .on('pointerdown', () => this.confirm());

        /* ================= LÓGICA DE TECLADO ================= */

        this.input.keyboard.on('keydown-A', () => {
            this.changeSkin1(-1);
            this.leftButton1.setColor(colorHover);
            this.time.delayedCall(150, () => this.leftButton1.setColor(colorBtn));
        });
        
        this.input.keyboard.on('keydown-D', () => {
            this.changeSkin1(1);
            this.rightButton1.setColor(colorHover);
            this.time.delayedCall(150, () => this.rightButton1.setColor(colorBtn));
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.changeSkin2(-1);
            this.leftButton2.setColor(colorHover);
            this.time.delayedCall(150, () => this.leftButton2.setColor(colorBtn));
        });
        
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.changeSkin2(1);
            this.rightButton2.setColor(colorHover);
            this.time.delayedCall(150, () => this.rightButton2.setColor(colorBtn));
        });
        
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
    }

    changeSkin1(dir) {
        this.currentSkin1 = (this.currentSkin1 + dir + this.skins.length) % this.skins.length;
        const skin = this.skins[this.currentSkin1];

        // Actualiza nombre y color
        this.skinText1.setText(skin.name);
        this.skinText1.setColor(skin.color);

        // Cambia la textura y reproduce animación
        this.skinSprite1.setTexture(skin.texture);
        this.skinSprite1.play(skin.anim, true);
    }

    changeSkin2(dir) {
        this.currentSkin2 = (this.currentSkin2 + dir + this.skins.length) % this.skins.length;
        const skin = this.skins[this.currentSkin2];

        // Actualiza nombre y color
        this.skinText2.setText(skin.name);
        this.skinText2.setColor(skin.color);

        // Cambia la textura y reproduce animación
        this.skinSprite2.setTexture(skin.texture);
        this.skinSprite2.play(skin.anim, true);
    }

    confirm() {
        // Guardar datos
        localStorage.setItem("skin1", this.currentSkin1);
        localStorage.setItem("skin2", this.currentSkin2);

        // Salir
        this.scene.stop();
        this.scene.resume('MenuScene');
    }
}
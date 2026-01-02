import Phaser from 'phaser';

export class UserScene extends Phaser.Scene {
    constructor() {
        super('UserScene');
    }

    preload() {
        this.username = localStorage.getItem("username") || "";
        const savedSkin = parseInt(localStorage.getItem("skin"), 10);
        this.currentSkin = Number.isInteger(savedSkin) && savedSkin >= 0 ?
            savedSkin :
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
        // Lo hacemos un poco más alto (450px) para que quepa todo bien
        this.add.graphics()
            .fillStyle(0x000000, 0.85)
            .fillRoundedRect(centerX - 175, centerY - 225, 350, 450, 14);

        // --- TÍTULO PRINCIPAL ---
        this.add.text(centerX, centerY - 190, 'EDITAR USUARIO', {
            fontFamily: 'Lemon',
            fontSize: '32px', // Un poco más grande
            color: colorTitle
        }).setOrigin(0.5);

        /* ================= INPUT NOMBRE ================= */
        const inputWidth = 280;
        const inputHeight = 50; // Un poco más alto para la fuente Lemon
        const inputX = centerX - inputWidth / 2;
        const inputY = centerY - 140;

        // Caja blanca del input
        this.add.graphics()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(inputX, inputY, inputWidth, inputHeight, 8)
            .lineStyle(2, 0x000000)
            .strokeRoundedRect(inputX, inputY, inputWidth, inputHeight, 8);

        // Texto escrito (Nombre del usuario)
        this.nameText = this.add.text(
            inputX + 15,
            inputY + inputHeight / 2,
            '', 
            { fontFamily: 'Lemon', fontSize: '20px', color: '#000000' }
        ).setOrigin(0, 0.5);

        // Placeholder
        this.placeholder = this.add.text(
            inputX + 15,
            inputY + inputHeight / 2,
            'Escribe tu nombre...',
            { fontFamily: 'Lemon', fontSize: '18px', color: '#999999' }
        ).setOrigin(0, 0.5);

        // Cursor parpadeante
        this.cursor = this.add.text(
            inputX + 10, // Se actualizará
            inputY + inputHeight / 2 - 2, // Ajuste fino vertical
            '|',
            { fontFamily: 'Lemon', fontSize: '20px', color: '#000000' }
        ).setOrigin(0, 0.5);

        this.cursor.visible = false;
        this.isFocused = true;

        // Timer del cursor
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                if (this.isFocused) this.cursor.visible = !this.cursor.visible;
                else this.cursor.visible = false;
            }
        });

        /* ================= SELECCIÓN DE SKIN ================= */
        this.skins = [
            { name: 'Marrón', texture: 'labubuMarron', anim: 'labubuM', color: '#ffa200ff' },
            { name: 'Amarillo', texture: 'labubuAmarillo', anim: 'labubuA', color: '#fdeb51ff' },
            { name: 'Morado', texture: 'labubuMorado', anim: 'labubuMo', color: '#7632fcff' },
            { name: 'Rojo', texture: 'labubuRojo', anim: 'labubuR', color: '#ff2424ff' }
        ];

        // Título de sección Skins
        this.add.text(centerX, centerY - 60, 'ELIGE TU SKIN', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: colorTitle
        }).setOrigin(0.5);

        // Sprite del personaje
        this.skinSprite = this.add.sprite(
            centerX,
            centerY + 40,
            this.skins[this.currentSkin].texture
        ).setScale(0.9); // Un pelín más pequeño para que no agobie

        this.skinSprite.play(this.skins[this.currentSkin].anim);

        // Nombre de la Skin (debajo del sprite)
        this.skinText = this.add.text(
            centerX,
            centerY + 130,
            this.skins[this.currentSkin].name,
            {
                fontFamily: 'Lemon',
                fontSize: '22px',
                color: this.skins[this.currentSkin].color,
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
        this.leftButton = this.add.text(centerX - buttonOffset, centerY + 40, '<', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin(-1))
            .on('pointerover', () => this.leftButton.setColor(colorHover))
            .on('pointerout', () => this.leftButton.setColor(colorBtn));

        // Botón Derecha (>)
        this.rightButton = this.add.text(centerX + buttonOffset, centerY + 40, '>', arrowStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.changeSkin(1))
            .on('pointerover', () => this.rightButton.setColor(colorHover))
            .on('pointerout', () => this.rightButton.setColor(colorBtn));

        /* ================= BOTÓN CONFIRMAR ================= */
        const confirmBtn = this.add.text(centerX, centerY + 180, 'CONFIRMAR', {
            fontFamily: 'Lemon',
            fontSize: '28px',
            color: colorBtn
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => confirmBtn.setColor(colorHover))
        .on('pointerout', () => confirmBtn.setColor(colorBtn))
        .on('pointerdown', () => this.confirm());

        /* ================= LÓGICA DE TECLADO ================= */
        this.input.keyboard.on('keydown', (event) => {
            if (!this.isFocused) return;

            if (event.key === 'Backspace') {
                this.username = this.username.slice(0, -1);
            } else if (event.key.length === 1 && this.username.length < 12) { // Límite de 12 letras para que quepa
                // Solo permitimos letras y números
                if (/^[a-zA-Z0-9 ]$/.test(event.key)) {
                    this.username += event.key;
                }
            }
            this.updateNameField();
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            this.changeSkin(-1);
            this.leftButton.setColor(colorHover);
            this.time.delayedCall(150, () => this.leftButton.setColor(colorBtn));
        });
        
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.changeSkin(1);
            this.rightButton.setColor(colorHover);
            this.time.delayedCall(150, () => this.rightButton.setColor(colorBtn));
        });
        
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());

        // Inicializar texto del input
        this.updateNameField();
    }

    updateNameField() {
        this.nameText.setText(this.username);
        this.placeholder.setVisible(this.username.length === 0);
        
        // Movemos el cursor al final del texto
        this.cursor.x = this.nameText.x + this.nameText.width + 2;
    }

    changeSkin(dir) {
        this.currentSkin = (this.currentSkin + dir + this.skins.length) % this.skins.length;
        const skin = this.skins[this.currentSkin];

        // Actualiza nombre y color
        this.skinText.setText(skin.name);
        this.skinText.setColor(skin.color);

        // Cambia la textura y reproduce animación
        this.skinSprite.setTexture(skin.texture);
        this.skinSprite.play(skin.anim, true);
    }

    confirm() {
        if (this.username.trim().length === 0) {
            this.placeholder.setText('¡Nombre obligatorio!');
            this.placeholder.setColor('#ff0000');
            
            // Animación de "temblor" si hay error
            this.tweens.add({
                targets: [this.nameText, this.placeholder],
                x: '+=5',
                yoyo: true,
                duration: 50,
                repeat: 3
            });

            this.time.delayedCall(1200, () => {
                this.placeholder.setText('Escribe tu nombre...');
                this.placeholder.setColor('#999999');
            });
            return;
        }

        // Guardar datos
        localStorage.setItem("username", this.username);
        localStorage.setItem("skin", this.currentSkin);

        // Salir
        this.scene.stop();
        this.scene.resume('MenuScene');
    }
}
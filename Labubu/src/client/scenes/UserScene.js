import Phaser from 'phaser';

export class UserScene extends Phaser.Scene
{
    constructor() {
        super('UserScene');
    }

    preload() {
        this.username = localStorage.getItem("username") || "";
        this.currentSkin = parseFloat(localStorage.getItem("skin"));
        console.log(this.currentSkin)

        this.load.spritesheet('labubuMarron', 'assets/brownanim/skin.png', {
            frameWidth: 136,
            frameHeight: 176
        });

        this.load.spritesheet('labubuAmarillo', 'assets/yellow/skin.png', {
            frameWidth: 136,
            frameHeight: 176
        });

        this.load.spritesheet('labubuMorado', 'assets/purpleanim/skin.png', {
            frameWidth: 136,
            frameHeight: 176
        });

        this.load.spritesheet('labubuRojo', 'assets/redanim/skin.png', {
            frameWidth: 136,
            frameHeight: 176
        });
    }

    create() {
    const { width, height } = this.scale;

    this.anims.create({
        key: 'labubuM',
        frames: this.anims.generateFrameNumbers('labubuMarron', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'labubuA',
        frames: this.anims.generateFrameNumbers('labubuAmarillo', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'labubuMo',
        frames: this.anims.generateFrameNumbers('labubuMorado', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'labubuR',
        frames: this.anims.generateFrameNumbers('labubuRojo', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    /* ================= PANEL ================= */
    this.add.graphics()
      .fillStyle(0x000000, 0.85)
      .fillRoundedRect(width / 2 - 175, height / 2 - 200, 350, 400, 14);

    this.add.text(width / 2, height / 2 - 170, 'EDITAR USUARIO', {
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    /* ================= INPUT NOMBRE ================= */
    const inputWidth = 280;
    const inputHeight = 42;
    const inputX = width / 2 - inputWidth / 2;
    const inputY = height / 2 - 140;

    // Caja
    this.add.graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(inputX, inputY, inputWidth, inputHeight, 8)
      .lineStyle(2, 0x000000)
      .strokeRoundedRect(inputX, inputY, inputWidth, inputHeight, 8);

    // Texto escrito
    this.nameText = this.add.text(
      inputX + 12,
      inputY + inputHeight / 2,
      '',
      { fontSize: '18px', color: '#000000' }
    ).setOrigin(0, 0.5);

    // Placeholder
    this.placeholder = this.add.text(
      inputX + 12,
      inputY + inputHeight / 2,
      'Escribe tu nombre...',
      { fontSize: '18px', color: '#999999' }
    ).setOrigin(0, 0.5);

    // Cursor
    this.cursor = this.add.text(
      inputX + 6,
      inputY + inputHeight / 2,
      '|',
      { fontSize: '18px', color: '#000000' }
    ).setOrigin(0, 0.5);

    this.cursor.visible = false;

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.isFocused) {
          this.cursor.visible = !this.cursor.visible;
        } else {
          this.cursor.visible = false;
        }
      }
    });

    this.isFocused = true;

    /* ================= SKINS ================= */
    this.skins = [
        { name: 'Marrón', texture: 'labubuMarron', anim: 'labubuM', color: '#ffa200ff' },
        { name: 'Amarillo', texture: 'labubuAmarillo', anim: 'labubuA', color: '#fdeb51ff' },
        { name: 'Morado', texture: 'labubuMorado', anim: 'labubuMo', color: '#7632fcff' },
        { name: 'Rojo', texture: 'labubuRojo', anim: 'labubuR', color: '#ff2424ff' }
    ];

    this.add.text(width / 2, height / 2 - 70, 'ELIGE TU SKIN', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.skinSprite = this.add.sprite(
        width / 2,
        height / 2 + 30,
        this.skins[this.currentSkin].texture
    ).setScale(1);

    this.skinSprite.play(this.skins[this.currentSkin].anim);

    this.skinText = this.add.text(
        width / 2,
        height / 2 + 130,
        this.skins[this.currentSkin].name,
        {
            fontSize: '18px',
            color: this.skins[this.currentSkin].color
        }
    ).setOrigin(0.5);

    const buttonOffset = 120; // distancia del sprite
    const buttonStyle = { fontSize: '32px', color: '#ffffff', backgroundColor: '#000000', padding: {x:10,y:5} };

    // Botón izquierda
    this.leftButton = this.add.text(
    this.skinSprite.x - buttonOffset,
    this.skinSprite.y,
    '<',
    buttonStyle
    ).setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.changeSkin(-1));

    // Botón derecha
    this.rightButton = this.add.text(
    this.skinSprite.x + buttonOffset,
    this.skinSprite.y,
    '>',
    buttonStyle
    ).setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.changeSkin(1));

    [this.leftButton, this.rightButton].forEach(btn => {
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#555555' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#000000' }));
    });


    /* ================= INPUT TECLADO ================= */
    this.input.keyboard.on('keydown', (event) => {
      if (!this.isFocused) return;

      if (event.key === 'Backspace') {
        this.username = this.username.slice(0, -1);
      }
      else if (event.key.length === 1 && this.username.length < 20) {
        this.username += event.key;
      }

      this.updateNameField();
    });

    this.input.keyboard.on('keydown-LEFT', () => this.changeSkin(-1));
    this.input.keyboard.on('keydown-RIGHT', () => this.changeSkin(1));

    /* ================= CONFIRMAR ================= */
    this.add.text(
      width / 2,
      height / 2 + 170,
      'CONFIRMAR',
      {
        fontSize: '20px',
        color: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 12, y: 6 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.confirm());
  }

  update() {
    if (this.username !== '') this.updateNameField();
  }

  updateNameField() {
    this.nameText.setText(this.username);
    this.placeholder.setVisible(this.username.length === 0);
    this.cursor.x = this.nameText.x - 6 + this.nameText.width + 2;
  }

  changeSkin(dir) {
        this.currentSkin =
            (this.currentSkin + dir + this.skins.length) % this.skins.length;

        const skin = this.skins[this.currentSkin];

        // Actualiza nombre debajo del sprite
        this.skinText.setText(skin.name);
        this.skinText.setColor(skin.color);

        // Cambia la textura y la animación
        this.skinSprite.setTexture(skin.texture);
        this.skinSprite.play(skin.anim, true);
    }

  confirm() {
    if (this.username.length === 0) {
        this.placeholder.setText('¡Nombre obligatorio!');
        this.placeholder.setColor('#ff0000');
        this.time.delayedCall(1200, () => {
            this.placeholder.setText('Escribe tu nombre...');
            this.placeholder.setColor('#999999');
        });
        return
    };

    // Enviar datos al almacenamiento local
    localStorage.setItem("username", this.username);
    localStorage.setItem("skin", this.currentSkin);

    this.scene.stop();
    this.scene.resume('MenuScene');
  }
}

import Phaser from 'phaser';

export class ControlsScene extends Phaser.Scene {

    constructor() {
        super('ControlsScene');
    }

    create() {
        // --- MEDIDAS ---
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        // --- FONDO ---
        // Usamos un fondo oscuro sólido o semitransparente para tapar el menú
        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);

        // --- TÍTULO PRINCIPAL ---
        this.add.text(centerX, 60, 'CONTROLS', {
            fontFamily: 'Lemon',
            fontSize: '48px',
            color: '#5eb232', // Verde del juego
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);

        // --- COLUMNA JUGADOR 1 (Izquierda) ---
        const p1X = centerX - 180;
        const p1Y = 160;

        // Título J1 (Color amarillo del CSS: #e6dd38)
        this.add.text(p1X, p1Y, 'PLAYER 1', {
            fontFamily: 'Lemon',
            fontSize: '28px',
            color: '#e6dd38'
        }).setOrigin(0.5);

        // Dibujamos las teclas WASD
        // W
        this.createKey(p1X, p1Y + 60, 'W');
        // A S D
        this.createKey(p1X - 50, p1Y + 115, 'A');
        this.createKey(p1X, p1Y + 115, 'S');
        this.createKey(p1X + 50, p1Y + 115, 'D');

        this.add.text(p1X, p1Y + 165, 'Move', { fontFamily: 'Lemon', fontSize: '14px', color: '#aaaaaa' }).setOrigin(0.5);

        // SHIFT (Tecla ancha)
        this.createKey(p1X, p1Y + 220, 'SHIFT', 120);
        this.add.text(p1X, p1Y + 260, 'Shoot', { fontFamily: 'Lemon', fontSize: '14px', color: '#aaaaaa' }).setOrigin(0.5);


        // --- COLUMNA JUGADOR 2 (Derecha) ---
        const p2X = centerX + 180;
        const p2Y = 160;

        // Título J2 (Color rojizo del CSS: #8a452e)
        this.add.text(p2X, p2Y, 'PLAYER 2', {
            fontFamily: 'Lemon',
            fontSize: '28px',
            color: '#8a452e'
        }).setOrigin(0.5);

        // Dibujamos las flechas
        // Arriba
        this.createKey(p2X, p2Y + 60, '↑');
        // Izq Abajo Der
        this.createKey(p2X - 50, p2Y + 115, '←');
        this.createKey(p2X, p2Y + 115, '↓');
        this.createKey(p2X + 50, p2Y + 115, '→');

        this.add.text(p2X, p2Y + 165, 'Move', { fontFamily: 'Lemon', fontSize: '14px', color: '#aaaaaa' }).setOrigin(0.5);

        // ENTER (Tecla ancha)
        this.createKey(p2X, p2Y + 220, 'ENTER', 120);
        this.add.text(p2X, p2Y + 260, 'Shoot', { fontFamily: 'Lemon', fontSize: '14px', color: '#aaaaaa' }).setOrigin(0.5);


        // --- SECCIÓN PAUSA (Abajo) ---
        this.add.text(centerX, 450, 'ESC to Pause', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);


        // --- BOTÓN VOLVER ---
        const backBtn = this.add.text(centerX, height - 60, 'Go back to Menu', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backBtn.setColor('#553922')) 
        .on('pointerout', () => backBtn.setColor('#5eb232')) 
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('MenuScene');
        });
    }

    /**
     * Función auxiliar para dibujar una tecla de estilo teclado
     * @param {number} x - Posición X centro
     * @param {number} y - Posición Y centro
     * @param {string} label - Texto de la tecla
     * @param {number} width - Ancho de la tecla (por defecto 40)
     */
    createKey(x, y, label, width = 45) {
        const height = 45;
        const radius = 8;

        // Sombra de la tecla (para dar volumen)
        this.add.graphics()
            .fillStyle(0x999999, 1)
            .fillRoundedRect(x - width / 2, y - height / 2 + 4, width, height, radius);

        // Cara superior de la tecla (Blanca)
        this.add.graphics()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            .lineStyle(2, 0x000000) // Borde negro
            .strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);

        // Texto de la tecla
        this.add.text(x, y, label, {
            fontFamily: 'Lemon',
            fontSize: label.length > 1 ? '16px' : '24px', // Letra más pequeña si es palabra larga
            color: '#000000'
        }).setOrigin(0.5);
    }
}
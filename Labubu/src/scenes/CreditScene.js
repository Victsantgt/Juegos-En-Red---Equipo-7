import Phaser from 'phaser';

export class CreditScene extends Phaser.Scene {

    constructor() {
        super('CreditScene');
    }

    create(data) {    
        // --- MEDIDAS ---
        const width = 704;
        const height = 576;
        const centerX = width / 2;
        const centerY = height / 2;

        // Fondo semitransparente oscuro
        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0,0);

        // --- TÍTULO (Arriba del centro) ---
        // Lo subimos 200px desde el centro
        this.add.text(centerX, centerY - 200, 'Créditos', {
            fontFamily: 'Lemon', 
            fontSize: '48px',
            color: '#8b4a00ff'
        }).setOrigin(0.5, 0.5);

        // --- LISTA DE CRÉDITOS (En el centro absoluto) ---
        const equipo = [
            "Carla Calvache Amador - Programadora UIs, community manager",
            "Daniel Redondo Pascual - concept art, ilustración 2D, programador",
            "Tinka Armas Martí - concept art, ilustración 2D, programadora",
            "Víctor Santiago Gil Torres - Compositor, programador, guionista"
        ];

        // Espacio entre líneas
        const gap = 45; 
        
        // Calculamos dónde empieza el primer nombre para que el bloque quede centrado
        // (Mitad de la pantalla) - (Mitad de la altura del bloque de texto)
        const totalHeight = (equipo.length - 1) * gap;
        const startY = centerY - (totalHeight / 2);

        equipo.forEach((texto, index) => {
            this.add.text(centerX, startY + (index * gap), texto, {
                fontFamily: 'Lemon',
                fontSize: '14px', 
                color: '#e0e0e0', 
                align: 'center'
            }).setOrigin(0.5, 0.5);
        });

        const menuBtn = this.add.text(centerX, centerY + 200, 'Volver al menú', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232', 
        }).setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#553922')) 
        .on('pointerout', () => menuBtn.setColor('#5eb232')) 
        .on('pointerdown', () => {
            
            menuBtn.disableInteractive();

            // Fundido a blanco
            this.cameras.main.fadeOut(1000, 255, 255, 255);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                if (data && data.originalScene) {
                    this.scene.stop(data.originalScene);
                }
                this.scene.start('MenuScene');
            });
        });
    }
}